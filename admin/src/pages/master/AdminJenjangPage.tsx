import { useState, useEffect } from 'react';
import { Layers, Plus, Search, Trash2, Edit3, X, Save, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, PremiumButton, SoftInput, Table, Thead, Tbody, Tr, Th, Td, Modal } from '../../components/ui';
import { useNotificationStore } from '../../stores/notificationStore';
import * as masterService from '../../services/master.service';

interface JenjangItem {
  id: string;
  name: string;
  mundzirName: string;
}

export const AdminJenjangPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  const [jenjangList, setJenjangList] = useState<JenjangItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JenjangItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formMundzir, setFormMundzir] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await masterService.fetchJenjang();
      if (res.success) {
        setJenjangList(res.data);
      }
    } catch (err) {
      showToast('Gagal memuat data Jenjang', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormMundzir('');
    setModalOpen(true);
  };

  const openEditModal = (item: JenjangItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormMundzir(item.mundzirName);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMundzir.trim()) {
      showToast('Nama Jenjang dan Mundzir harus diisi', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await masterService.updateJenjang(editingItem.id, { name: formName, mundzirName: formMundzir });
        showToast('Berhasil memperbarui data jenjang', 'success');
      } else {
        await masterService.createJenjang({ name: formName, mundzirName: formMundzir });
        showToast('Berhasil menambahkan jenjang baru', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: JenjangItem) => {
    showConfirm(
      'Hapus Jenjang',
      `Apakah Anda yakin ingin menghapus jenjang ${item.name}? Tindakan ini tidak bisa dibatalkan.`,
      async () => {
        try {
          await masterService.deleteJenjang(item.id);
          showToast('Jenjang berhasil dihapus', 'success');
          loadData();
        } catch (err) {
          showToast('Gagal menghapus jenjang', 'error');
        }
      }
    );
  };

  const filteredData = jenjangList.filter(j => 
    (j.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (j.mundzirName || '').toLowerCase().includes(search.toLowerCase())
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
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-indigo-500/20 to-purple-500/0 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-linear-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] border border-indigo-400/30">
                <Layers className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Master Jenjang</h1>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                  Manajemen Tingkatan Utama & Mundzir
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
                placeholder="Cari jenjang atau mundzir..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-indigo-400" />}
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
            className="w-full md:w-auto shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_25px_rgba(79,70,229,0.4)] transition-all"
          >
            Tambah Jenjang
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
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat data...</span>
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr className="bg-slate-50/50">
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Nama Jenjang</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Mundzir / Kepala</Th>
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
                      className="group border-b border-slate-100 hover:bg-indigo-50/30 transition-colors"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <Layers className="w-4 h-4" />
                          </div>
                          <span className="font-extrabold text-slate-800">{item.name}</span>
                        </div>
                      </Td>
                      <Td>
                        <span className="font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm inline-block group-hover:border-indigo-200 transition-colors">
                          {item.mundzirName || 'Belum Diatur'}
                        </span>
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
                    <Td colSpan={3} className="text-center py-24 text-slate-400">
                      <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">Tidak ada data jenjang ditemukan</p>
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
        title={editingItem ? 'Edit Jenjang' : 'Tambah Jenjang Baru'}
      >
        <form onSubmit={handleSave} className="space-y-5 p-1">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Jenjang</label>
            <SoftInput
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Ibtida'iyyah"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Mundzir (Kepala Jenjang)</label>
            <SoftInput
              value={formMundzir}
              onChange={(e) => setFormMundzir(e.target.value)}
              placeholder="e.g. Agus H. Bahauddin"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <PremiumButton type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </PremiumButton>
            <PremiumButton type="submit" variant="primary" disabled={isSubmitting} leftIcon={isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
