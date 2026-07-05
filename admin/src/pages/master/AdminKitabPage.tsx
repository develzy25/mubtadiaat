import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Trash2, Edit3, X, Save, RefreshCw, Layers, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, PremiumButton, SoftInput, Table, Thead, Tbody, Tr, Th, Td, Modal, PremiumSelect } from '../../components/ui';
import { useNotificationStore } from '../../stores/notificationStore';
import * as masterService from '../../services/master.service';

interface KitabItem {
  id: string;
  name: string;
  jenjangName: string;
  tingkatName: string;
  fanIlmu: string;
  pengajar: string;
  waktu: string;
}

interface JenjangItem {
  id: string;
  name: string;
}

interface TingkatItem {
  id: string;
  jenjangName: string;
  romanName: string;
}

const FAN_ILMU_OPTIONS = [
  'Fiqh',
  'Nahwu',
  'Shorof',
  'Tauhid',
  'Tafsir',
  'Hadits',
  'Akhlaq',
  'Tarikh',
  'Tajwid'
];

export const AdminKitabPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  
  const [kitabList, setKitabList] = useState<KitabItem[]>([]);
  const [jenjangList, setJenjangList] = useState<JenjangItem[]>([]);
  const [tingkatList, setTingkatList] = useState<TingkatItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KitabItem | null>(null);
  
  const [formName, setFormName] = useState('');
  const [formJenjang, setFormJenjang] = useState('');
  const [formTingkat, setFormTingkat] = useState('');
  const [formFan, setFormFan] = useState('Fiqh');
  const [formPengajar, setFormPengajar] = useState('');
  const [formWaktu, setFormWaktu] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [kRes, jRes, tRes] = await Promise.all([
        masterService.fetchKitab(),
        masterService.fetchJenjang(),
        masterService.fetchTingkat()
      ]);
      if (kRes.success) setKitabList(kRes.data);
      if (jRes.success) setJenjangList(jRes.data);
      if (tRes.success) setTingkatList(tRes.data);
    } catch (err) {
      showToast('Gagal memuat data Kitab', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (jenjangList.length > 0 && !formJenjang) {
      setFormJenjang(jenjangList[0].name);
    }
  }, [jenjangList]);

  useEffect(() => {
    const list = tingkatList.filter(t => t.jenjangName === formJenjang);
    if (list.length > 0) {
      if (!list.find(t => t.romanName === formTingkat)) {
        setFormTingkat(list[0].romanName);
      }
    } else {
      setFormTingkat('');
    }
  }, [formJenjang, tingkatList]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    if (jenjangList.length > 0) setFormJenjang(jenjangList[0].name);
    setFormFan('Fiqh');
    setFormPengajar('');
    setFormWaktu('');
    setModalOpen(true);
  };

  const openEditModal = (item: KitabItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormJenjang(item.jenjangName);
    setFormTingkat(item.tingkatName);
    setFormFan(item.fanIlmu);
    setFormPengajar(item.pengajar);
    setFormWaktu(item.waktu || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formJenjang || !formTingkat || !formFan || !formPengajar) {
      showToast('Mohon lengkapi semua field wajib', 'error');
      return;
    }
    
    setIsSubmitting(true);
    const payload = {
      name: formName,
      jenjangName: formJenjang,
      tingkatName: formTingkat,
      fanIlmu: formFan,
      pengajar: formPengajar,
      waktu: formWaktu
    };

    try {
      if (editingItem) {
        await masterService.updateKitab(editingItem.id, payload);
        showToast('Berhasil memperbarui data kitab', 'success');
      } else {
        await masterService.createKitab(payload);
        showToast('Berhasil menambahkan kitab baru', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: KitabItem) => {
    showConfirm(
      'Hapus Kitab',
      `Apakah Anda yakin ingin menghapus Kitab ${item.name}?`,
      async () => {
        try {
          await masterService.deleteKitab(item.id);
          showToast('Kitab berhasil dihapus', 'success');
          loadData();
        } catch (err) {
          showToast('Gagal menghapus kitab', 'error');
        }
      }
    );
  };

  const filteredData = kitabList.filter(k => 
    (k.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.jenjangName || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.tingkatName || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.fanIlmu || '').toLowerCase().includes(search.toLowerCase()) ||
    (k.pengajar || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 3D Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GlassCard className="relative overflow-hidden p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-white/50 backdrop-blur-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-amber-500/20 to-orange-500/0 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-linear-to-tr from-amber-500 to-orange-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] border border-amber-400/30">
                <BookOpen className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Master Kitab</h1>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                  Mata Pelajaran & Literatur
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
                placeholder="Cari nama kitab, fan ilmu, atau pengajar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-amber-500" />}
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
          
          <PremiumButton 
            onClick={openAddModal} 
            variant="primary" 
            leftIcon={<Plus className="w-5 h-5" />}
            className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 shadow-[0_4px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)] transition-all"
          >
            Tambah Kitab
          </PremiumButton>
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
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat data...</span>
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr className="bg-slate-50/50">
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Nama Kitab & Fan Ilmu</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Target Kelas</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Pengajar Khusus</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Waktu Mengaji</Th>
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
                      className="group border-b border-slate-100 hover:bg-amber-50/30 transition-colors"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-black text-slate-800 text-lg">
                              {item.name}
                            </span>
                            <div className="mt-0.5">
                              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                                {item.fanIlmu}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 font-bold text-slate-700">
                            <GraduationCap className="w-4 h-4 text-slate-400" />
                            Tingkat {item.tingkatName}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Layers className="w-3.5 h-3.5" />
                            {item.jenjangName}
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <span className="font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm inline-block group-hover:border-amber-200 transition-colors">
                          {item.pengajar}
                        </span>
                      </Td>
                      <Td>
                        {item.waktu ? (
                          <span className="font-medium text-slate-600">
                            {item.waktu}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Menyesuaikan</span>
                        )}
                      </Td>
                      <Td className="text-right space-x-2">
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
                      </Td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {filteredData.length === 0 && (
                  <Tr>
                    <Td colSpan={5} className="text-center py-24 text-slate-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">Tidak ada data kitab ditemukan</p>
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
        title={editingItem ? 'Edit Kitab' : 'Tambah Kitab Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 p-1">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Kitab</label>
            <SoftInput
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Fathul Qorib"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Jenjang</label>
              <PremiumSelect
                value={formJenjang}
                onChange={(e) => setFormJenjang(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-amber-500 transition-colors"
                required
              >
                {jenjangList.map(j => <option key={j.id} value={j.name}>{j.name}</option>)}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tingkat</label>
              <PremiumSelect
                value={formTingkat}
                onChange={(e) => setFormTingkat(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-amber-500 transition-colors"
                required
              >
                {tingkatList.filter(t => t.jenjangName === formJenjang).map(t => (
                  <option key={t.id} value={t.romanName}>{t.romanName}</option>
                ))}
              </PremiumSelect>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Fan Ilmu (Kategori)</label>
              <PremiumSelect
                value={formFan}
                onChange={(e) => setFormFan(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-amber-500 transition-colors"
                required
              >
                {FAN_ILMU_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Pengajar Kitab</label>
              <SoftInput
                value={formPengajar}
                onChange={(e) => setFormPengajar(e.target.value)}
                placeholder="e.g. K.H. Ahmad"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Waktu / Jadwal Khusus (Opsional)</label>
            <SoftInput
              value={formWaktu}
              onChange={(e) => setFormWaktu(e.target.value)}
              placeholder="e.g. Ba'da Maghrib"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <PremiumButton type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </PremiumButton>
            <PremiumButton type="submit" variant="primary" className="bg-amber-500 hover:bg-amber-600" disabled={isSubmitting} leftIcon={isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
