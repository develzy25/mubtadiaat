import { useState, useEffect } from 'react';
import { School, Plus, Search, Trash2, Edit3, X, Save, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, PremiumButton, SoftInput, Table, Thead, Tbody, Tr, Th, Td, Modal, PremiumSelect, DataExportImport } from '../../components/ui';
import { useNotificationStore } from '../../stores/notificationStore';
import * as masterService from '../../services/master.service';
import { generateExcelTemplate, exportToExcel, parseExcel, type ExcelColumnConfig } from '../../utils/excelService';

const KELAS_COLUMNS: ExcelColumnConfig[] = [
  { key: 'jenjangName', header: 'Induk Jenjang', width: 25, type: 'text', required: true, example: 'Ibtida\'iyyah' },
  { key: 'tingkatName', header: 'Tingkat / Kelas', width: 20, type: 'text', required: true, example: 'I' },
  { key: 'bagian', header: 'Nama Bagian Kelas', width: 20, type: 'text', required: true, example: 'أ' },
  { key: 'lokal', header: 'Lokasi / Gedung', width: 25, type: 'text', required: true, example: 'Gedung Utama Lt 1' },
];

interface KelasItem {
  id: string;
  jenjangId: string;
  jenjangName: string;
  tingkatId: string;
  tingkatName: string;
  bagian: string;
  lokal: string;
  mustahiqId: string;
  mustahiqName: string;
  munawwibIds: string[];
}

interface JenjangItem {
  id: string;
  name: string;
}

interface TingkatItem {
  id: string;
  jenjangId: string;
  jenjangName: string;
  romanName: string;
}

export const AdminKelasRombelPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  
  const [classList, setClassList] = useState<KelasItem[]>([]);
  const [jenjangList, setJenjangList] = useState<JenjangItem[]>([]);
  const [tingkatList, setTingkatList] = useState<TingkatItem[]>([]);
  const [asatidzList, setAsatidzList] = useState<masterService.AsatidzItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [filterJenjangId, setFilterJenjangId] = useState<string>('ALL');
  const [filterTingkatId, setFilterTingkatId] = useState<string>('ALL');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KelasItem | null>(null);
  
  const [formJenjangId, setFormJenjangId] = useState('');
  const [formTingkatId, setFormTingkatId] = useState('');
  const [formBagian, setFormBagian] = useState('');
  const [formLokal, setFormLokal] = useState('');
  const [formMustahiqId, setFormMustahiqId] = useState('');
  const [formMunawwibIds, setFormMunawwibIds] = useState<string[]>(['']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, jRes, tRes, aRes] = await Promise.all([
        masterService.fetchKelas(),
        masterService.fetchJenjang(),
        masterService.fetchTingkat(),
        masterService.fetchAsatidz()
      ]);
      if (cRes.success) {
        const parsedKelas = cRes.data.map((c: any) => ({
          ...c,
          munawwibIds: c.munawwibIds ? JSON.parse(c.munawwibIds) : []
        }));
        setClassList(parsedKelas);
      }
      if (jRes.success) setJenjangList(jRes.data);
      if (tRes.success) setTingkatList(tRes.data);
      if (aRes.success) setAsatidzList(aRes.data);
    } catch (err) {
      showToast('Gagal memuat data Kelas Rombel', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (jenjangList.length > 0 && !formJenjangId) {
      setFormJenjangId(jenjangList[0].id);
    }
  }, [jenjangList]);

  useEffect(() => {
    const filteredTingkat = tingkatList.filter(t => t.jenjangId === formJenjangId);
    if (filteredTingkat.length > 0) {
      if (!filteredTingkat.find(t => t.id === formTingkatId)) {
        setFormTingkatId(filteredTingkat[0].id);
      }
    } else {
      setFormTingkatId('');
    }
  }, [formJenjangId, tingkatList]);

  const openAddModal = () => {
    setEditingItem(null);
    if (jenjangList.length > 0) setFormJenjangId(jenjangList[0].id);
    setFormBagian('');
    setFormLokal('');
    setFormMustahiqId('');
    setFormMunawwibIds(['']);
    setModalOpen(true);
  };

  const openEditModal = (item: KelasItem) => {
    setEditingItem(item);
    setFormJenjangId(item.jenjangId);
    setFormTingkatId(item.tingkatId);
    setFormBagian(item.bagian);
    setFormLokal(item.lokal || '');
    setFormMustahiqId(item.mustahiqId || '');
    setFormMunawwibIds(item.munawwibIds && item.munawwibIds.length > 0 ? item.munawwibIds : ['']);
    setModalOpen(true);
  };


  const handleMunawwibChange = (idx: number, val: string) => {
    const newArr = [...formMunawwibIds];
    newArr[idx] = val;
    setFormMunawwibIds(newArr);
  };

  const addMunawwibField = () => {
    setFormMunawwibIds([...formMunawwibIds, '']);
  };

  const removeMunawwibField = (idx: number) => {
    const newArr = [...formMunawwibIds];
    newArr.splice(idx, 1);
    setFormMunawwibIds(newArr.length > 0 ? newArr : ['']);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTingkatId || !formBagian || !formLokal) {
      showToast('Tingkat, Bagian, dan Lokal harus diisi', 'error');
      return;
    }
    
    setIsSubmitting(true);
    const payload = {
      tingkatId: formTingkatId,
      bagian: formBagian,
      lokal: formLokal,
      mustahiqId: formMustahiqId || null,
      munawwibIds: JSON.stringify(formMunawwibIds.filter(id => id.trim() !== ''))
    };

    try {
      if (editingItem) {
        await masterService.updateKelas(editingItem.id, payload);
        showToast('Berhasil memperbarui data kelas', 'success');
      } else {
        await masterService.createKelas(payload);
        showToast('Berhasil menambahkan kelas baru', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: KelasItem) => {
    showConfirm(
      'Hapus Kelas Rombel',
      `Apakah Anda yakin ingin menghapus Kelas ${item.tingkatName} ${item.bagian}?`,
      async () => {
        try {
          await masterService.deleteKelas(item.id);
          showToast('Kelas berhasil dihapus', 'success');
          loadData();
        } catch (err) {
          showToast('Gagal menghapus kelas', 'error');
        }
      }
    );
  };

  const handleDownloadTemplate = async () => {
    await generateExcelTemplate(KELAS_COLUMNS, 'Template_Kelas_Mubtadiat.xlsx');
  };

  const handleExportData = async () => {
    // Simplify export for now
    await exportToExcel(classList, KELAS_COLUMNS, 'Data_Kelas_Mubtadiat.xlsx');
  };

  const handleImportData = async (file: File) => {
    try {
      const parsedData = await parseExcel(file);
      if (parsedData.length === 0) throw new Error('Data kosong');
      
      let imported = 0;
      for (const row of parsedData) {
        if (row.tingkatName && row.bagian && row.lokal) {
          const matchedTingkat = tingkatList.find(t => t.romanName === row.tingkatName && t.jenjangName === row.jenjangName);
          if (!matchedTingkat) continue;

          await masterService.createKelas({
            tingkatId: matchedTingkat.id,
            bagian: String(row.bagian),
            lokal: String(row.lokal),
            mustahiqId: null,
            munawwibIds: JSON.stringify([])
          });
          imported++;
        }
      }
      showToast(`${imported} data kelas berhasil diimport!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengimport data', 'error');
    }
  };

  const getAsatidzName = (id: string) => {
    return asatidzList.find(a => a.id === id)?.name || 'Unknown';
  };

  const filteredData = classList.filter(c => {
    if (filterJenjangId !== 'ALL' && c.jenjangId !== filterJenjangId) return false;
    if (filterTingkatId !== 'ALL' && c.tingkatId !== filterTingkatId) return false;
    
    return (
      (c.jenjangName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.tingkatName || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.bagian || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.lokal || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.mustahiqName || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* 3D Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GlassCard className="relative overflow-hidden p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-emerald-500/20 to-teal-500/0 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-linear-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] border border-emerald-400/30">
                <School className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Master Kelas / Rombel</h1>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                  Manajemen Rombongan Belajar & Wali Kelas
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="relative w-full md:w-96">
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <SoftInput
                placeholder="Cari kelas, wali kelas, lokal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-emerald-400" />}
                className="w-full bg-white/50"
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end relative">
            <PremiumSelect
              value={filterJenjangId}
              onChange={(e) => {
                setFilterJenjangId(e.target.value);
                setFilterTingkatId('ALL');
              }}
              className="bg-white border-slate-200 text-slate-700 text-sm h-10 px-3 pr-8 rounded-xl"
            >
              <option value="ALL">Semua Jenjang</option>
              {jenjangList.map((j) => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </PremiumSelect>
            <PremiumSelect
              value={filterTingkatId}
              onChange={(e) => setFilterTingkatId(e.target.value)}
              className="bg-white border-slate-200 text-slate-700 text-sm h-10 px-3 pr-8 rounded-xl"
            >
              <option value="ALL">Semua Tingkat</option>
              {tingkatList
                .filter(t => filterJenjangId === 'ALL' || t.jenjangId === filterJenjangId)
                .map((t) => (
                <option key={t.id} value={t.id}>{t.romanName} ({t.jenjangName})</option>
              ))}
            </PremiumSelect>

            <DataExportImport 
              onDownloadTemplate={handleDownloadTemplate}
              onExportData={handleExportData}
              onImportData={handleImportData}
            />
            <PremiumButton 
              onClick={openAddModal} 
              variant="primary" 
              leftIcon={<Plus className="w-5 h-5" />}
              className="w-full md:w-auto shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_25px_rgba(79,70,229,0.4)] transition-all"
            >
              Tambah Kelas/Rombel
            </PremiumButton>
          </div>
        </GlassCard>
      </motion.div>

      {/* Data Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard className="overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat data...</span>
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr className="bg-slate-50/50">
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Nama Kelas / Bagian</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Informasi Gedung</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Mustahiq (Wali Kelas)</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Munawwib</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px] text-right">Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {filteredData.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group border-b border-slate-100 hover:bg-emerald-50/30 transition-colors"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                            <School className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-black text-slate-800 text-lg">
                              Kelas {item.tingkatName} - {item.bagian}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Layers className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-bold text-slate-500">{item.jenjangName}</span>
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <span className="font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm inline-block group-hover:border-emerald-200 transition-colors">
                          {item.lokal}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-bold text-slate-700">
                          {item.mustahiqName || <span className="text-slate-400 italic">Belum diatur</span>}
                        </span>
                      </Td>
                      <Td>
                        {item.munawwibIds && item.munawwibIds.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {item.munawwibIds.map((mId, i) => (
                              <span key={i} className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                {getAsatidzName(mId)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Kosong</span>
                        )}
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          <button
                          onClick={() => openEditModal(item)}
                          className="p-2 rounded-xl text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors focus:outline-hidden"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors focus:outline-hidden"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        </div>
                      </Td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {filteredData.length === 0 && (
                  <Tr>
                    <Td colSpan={5} className="text-center py-24 text-slate-400">
                      <School className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">Tidak ada data kelas ditemukan</p>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </GlassCard>
      </motion.div>

      {/* Form Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Kelas / Rombel' : 'Tambah Kelas Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Jenjang</label>
              <PremiumSelect
                value={formJenjangId}
                onChange={(e) => setFormJenjangId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              >
                {jenjangList.map(j => <option key={j.id} value={j.id}>{j.name}</option>)}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tingkat</label>
              <PremiumSelect
                value={formTingkatId}
                onChange={(e) => setFormTingkatId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-emerald-500 transition-colors"
                required
              >
                {tingkatList.filter(t => t.jenjangId === formJenjangId).map(t => (
                  <option key={t.id} value={t.id}>{t.romanName}</option>
                ))}
              </PremiumSelect>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Bagian Kelas</label>
              <SoftInput
                value={formBagian}
                onChange={(e) => setFormBagian(e.target.value)}
                placeholder="e.g. أ, ب, ج"
                required
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {['أ', 'ب', 'ج', 'د', 'هـ', 'و', 'ز', 'ح', 'ط', 'ي'].map(char => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => setFormBagian(char)}
                    className="w-6 h-6 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-700 rounded transition-colors"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Lokasi / Gedung</label>
              <SoftInput
                value={formLokal}
                onChange={(e) => setFormLokal(e.target.value)}
                placeholder="e.g. Gedung Utama Lt 1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mustahiq (Wali Kelas)</label>
            <PremiumSelect
              value={formMustahiqId}
              onChange={(e: any) => setFormMustahiqId(e.target.value)}
              disabled={asatidzList.filter(a => a.role === 'Mustahiq').length === 0}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-emerald-500 transition-colors"
            >
              {asatidzList.filter(a => a.role === 'Mustahiq').length === 0 ? (
                <option value="">Buat Master Mustahiq terlebih dahulu</option>
              ) : (
                <option value="">-- Pilih Mustahiq --</option>
              )}
              {asatidzList.filter(a => a.role === 'Mustahiq').map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </PremiumSelect>
          </div>

          <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest">Munawwib</h3>
              <button type="button" onClick={addMunawwibField} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg transition-colors">
                + Tambah Munawwib
              </button>
            </div>
            {formMunawwibIds.map((munawwib, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <PremiumSelect
                  value={munawwib}
                  onChange={(e: any) => handleMunawwibChange(idx, e.target.value)}
                  disabled={asatidzList.filter(a => a.role === 'Munawwib').length === 0}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-emerald-500 transition-colors"
                >
                  {asatidzList.filter(a => a.role === 'Munawwib').length === 0 ? (
                    <option value="">Buat Master Munawwib terlebih dahulu</option>
                  ) : (
                    <option value="">-- Pilih Munawwib --</option>
                  )}
                  {asatidzList.filter(a => a.role === 'Munawwib').map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </PremiumSelect>
                {formMunawwibIds.length > 1 && (
                  <button type="button" onClick={() => removeMunawwibField(idx)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <PremiumButton type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </PremiumButton>
            <PremiumButton type="submit" variant="primary" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting} leftIcon={isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
