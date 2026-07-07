import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Plus,
  MessageCircle,
  Phone,
  Trash2,
  Edit3,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, PremiumButton, SoftInput, Table, Thead, Tbody, Tr, Th, Td, Modal, PremiumSelect, DataExportImport } from '../../components/ui';
import { useNotificationStore } from '../../stores/notificationStore';
import * as masterService from '../../services/master.service';
import { generateExcelTemplate, exportToExcel, parseExcel, type ExcelColumnConfig } from '../../utils/excelService';

const ASATIDZ_COLUMNS: ExcelColumnConfig[] = [
  { key: 'name', header: 'Nama Asatidz', width: 30, type: 'text', required: true, example: 'Ust. Haris' },
  { key: 'role', header: 'Jabatan/Role', width: 25, type: 'text', required: true, example: 'Mustahiq, Mundzir, Mufatish, Munawwib' },
  { key: 'phone', header: 'No Telepon', width: 20, type: 'text', required: false, example: '081234567890' },
];

export const AdminAsatidzPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  const [data, setData] = useState<masterService.AsatidzItem[]>([]);
  const [search, setSearch] = useState('');
  
  // Filter Popover
  const [showFilter, setShowFilter] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<masterService.AsatidzItem | null>(null);
  
  // Form Fields
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState<'Mundzir' | 'Mufatish' | 'Mustahiq' | 'Munawwib'>('Mustahiq');
  const [formPhone, setFormPhone] = useState('');

  const loadData = async () => {
    try {
      const res = await masterService.fetchAsatidz();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
      showToast('Gagal memuat data Asatidz', 'error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormRole('Mustahiq');
    setFormPhone('');
    setModalOpen(true);
  };

  const openEditModal = (item: masterService.AsatidzItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormRole(item.role);
    setFormPhone(item.phone || '');
    setModalOpen(true);
  };

  const handleDelete = (item: masterService.AsatidzItem) => {
      showConfirm(
      'Hapus Data',
      `Apakah Anda yakin ingin menghapus data asatidz ${item.name}?`,
      async () => {
        try {
          const res = await masterService.deleteAsatidz(item.id);
          if (res.success) {
            showToast('Data berhasil dihapus', 'success');
            loadData();
          } else {
            showToast('Gagal menghapus data', 'error');
          }
        } catch (error) {
          console.error(error);
          showToast('Terjadi kesalahan saat menghapus data', 'error');
        }
      }
    );
  };

  const handleGenerateAccount = (item: masterService.AsatidzItem) => {
    showConfirm(
      'Generate Akun',
      `Apakah Anda yakin ingin membuat akun login otomatis untuk ${item.name}?`,
      async () => {
        try {
          const res = await masterService.generateAccountAsatidz(item.id);
          if (res.success) {
            showToast(`Berhasil! Username: ${res.username} - Sandi: ${res.password}`, 'success');
            loadData();
          } else {
            showToast(res.error || 'Gagal generate akun', 'error');
          }
        } catch (error) {
          console.error(error);
          showToast('Terjadi kesalahan sistem saat generate akun', 'error');
        }
      }
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formName,
      role: formRole,
      phone: formPhone
    };

    try {
      let res;
      if (editingItem) {
        res = await masterService.updateAsatidz(editingItem.id, payload);
      } else {
        res = await masterService.createAsatidz(payload);
      }
      
      if (res.success) {
        showToast(`Berhasil menyimpan data ${formName}`, 'success');
        setModalOpen(false);
        loadData();
      } else {
        showToast(res.message || 'Gagal menyimpan data', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan saat menyimpan data', 'error');
    }
  };

  const handleSendWA = (item: masterService.AsatidzItem) => {
    if (!item.phone) return showToast('Nomor WA belum diisi', 'warning');
    let formatted = item.phone.replace(/[^0-9]/g, '');
    if (formatted.startsWith('0')) formatted = '62' + formatted.slice(1);
    
    const msg = `Assalamu'alaikum Wr. Wb. Nyuwun sewu Ust./Ustdh. *${item.name}*...`;
    window.open(`https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDownloadTemplate = async () => {
    await generateExcelTemplate(ASATIDZ_COLUMNS, 'Template_Asatidz_Mubtadiat.xlsx');
  };

  const handleExportData = async () => {
    await exportToExcel(data, ASATIDZ_COLUMNS, 'Data_Asatidz_Mubtadiat.xlsx');
  };

  const handleImportData = async (file: File) => {
    try {
      const parsedData = await parseExcel(file);
      if (parsedData.length === 0) throw new Error('Data kosong');
      
      let imported = 0;
      for (const row of parsedData) {
        if (row.name && row.role) {
          await masterService.createAsatidz({
            name: row.name,
            role: row.role as any,
            phone: row.phone ? String(row.phone) : ''
          });
          imported++;
        }
      }
      showToast(`${imported} data asatidz berhasil diimport!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengimport data', 'error');
    }
  };

  const filteredData = data.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? d.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            Master Pengurus (Asatidz)
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Kelola data Mundzir, Mufatish, Mustahiq, dan Munawwib.
          </p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-0 overflow-hidden bg-white/70">
          <div className="p-4 border-b border-slate-200/60 flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50/50">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Cari nama pengurus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end relative" ref={filterRef}>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-sm font-bold ${
                  showFilter || roleFilter 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>

              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 p-4 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] rounded-2xl z-50 flex flex-col gap-3"
                  >
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Filter Jabatan / Role</label>
                    <PremiumSelect
                      value={roleFilter}
                      onChange={(e: any) => setRoleFilter(e.target.value)}
                      className="bg-slate-50"
                    >
                      <option value="">Semua Jabatan</option>
                      <option value="Mundzir">Mundzir</option>
                      <option value="Mufatish">Mufatish</option>
                      <option value="Mustahiq">Mustahiq</option>
                      <option value="Munawwib">Munawwib</option>
                    </PremiumSelect>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <DataExportImport 
                onDownloadTemplate={handleDownloadTemplate}
                onExportData={handleExportData}
                onImportData={handleImportData}
              />

              <PremiumButton onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />} className="py-2.5 px-4 shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2">Tambah Pengurus
              </PremiumButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th className="w-16">No</Th>
                  <Th>Nama Lengkap</Th>
                  <Th>Jabatan</Th>
                  <Th>WhatsApp</Th>
                  <Th className="text-right">Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="border-b border-slate-100/50 hover:bg-slate-50/50 transition-colors group"
                    >
                      <Td className="font-medium text-slate-500">{idx + 1}</Td>
                      <Td>
                        <div className="font-bold text-slate-800">{item.name}</div>
                      </Td>
                      <Td>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          item.role === 'Mundzir' ? 'bg-purple-100 text-purple-700' :
                          item.role === 'Mufatish' ? 'bg-amber-100 text-amber-700' :
                          item.role === 'Mustahiq' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {item.role}
                        </span>
                      </Td>
                      <Td>
                        {item.phone ? (
                          <button onClick={() => handleSendWA(item)} className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors group/wa">
                            <MessageCircle className="w-4 h-4 group-hover/wa:scale-110 transition-transform" />
                            {item.phone}
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm italic">Belum diset</span>
                        )}
                      </Td>
                        <Td>
                          <div className="flex items-center justify-end gap-2">
                            {!item.userId && (
                              <button onClick={() => handleGenerateAccount(item)} title="Generate Akun Login" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100">
                                <UserPlus className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border border-transparent hover:border-blue-100">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(item)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100">
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
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">Tidak ada data asatidz ditemukan</p>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        </GlassCard>
      </motion.div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 p-1">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
            <SoftInput
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Ustadz Haris"
              required
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Jabatan / Role</label>
            <PremiumSelect
              value={formRole}
              onChange={(e: any) => setFormRole(e.target.value)}
              className="w-full bg-slate-50"
              required
            >
              <option value="Mundzir">Mundzir</option>
              <option value="Mufatish">Mufatish</option>
              <option value="Mustahiq">Mustahiq</option>
              <option value="Munawwib">Munawwib</option>
            </PremiumSelect>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nomor WhatsApp</label>
            <SoftInput
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              placeholder="e.g. 081234567890"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <PremiumButton type="submit" className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200">
              Simpan Data
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
