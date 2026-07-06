import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Search, Trash2, Edit3, X, Save, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, PremiumButton, SoftInput, Table, Thead, Tbody, Tr, Th, Td, Modal, PremiumSelect } from '../../components/ui';
import { useNotificationStore } from '../../stores/notificationStore';
import * as masterService from '../../services/master.service';



interface TingkatItem {
  id: string;
  jenjangName: string;
  romanName: string;
  mufatishName: string;
  targetNadzom: string;
  targetBait: number;
  hasPraktek: boolean;
  praktekSubjects: string[];
}

interface JenjangItem {
  id: string;
  name: string;
}

export const AdminTingkatPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  
  const [tingkatList, setTingkatList] = useState<TingkatItem[]>([]);
  const [jenjangList, setJenjangList] = useState<JenjangItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TingkatItem | null>(null);
  
  const [formJenjang, setFormJenjang] = useState('');
  const [formRoman, setFormRoman] = useState('I');
  const [formMufatish, setFormMufatish] = useState('');
  const [formTargetNadzom, setFormTargetNadzom] = useState('');
  const [formTargetBait, setFormTargetBait] = useState(0);
  const [formHasPraktek, setFormHasPraktek] = useState(false);
  const [formPraktekSubjects, setFormPraktekSubjects] = useState<string[]>(['']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tRes, jRes] = await Promise.all([
        masterService.fetchTingkat(),
        masterService.fetchJenjang()
      ]);
      if (tRes.success) {
        const parsedTingkat = tRes.data.map((t: any) => ({
          ...t,
          praktekSubjects: t.praktekSubjects ? JSON.parse(t.praktekSubjects) : []
        }));
        setTingkatList(parsedTingkat);
      }
      if (jRes.success) {
        setJenjangList(jRes.data);
        if (jRes.data.length > 0 && !formJenjang) {
          setFormJenjang(jRes.data[0].name);
        }
      }
    } catch (err) {
      showToast('Gagal memuat data Tingkat', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Rule exception checks
  const isIdadiyah = (levelName: string) => {
    return levelName.toLowerCase().includes("i'dadiyah") || levelName.toLowerCase() === 'idadiyah';
  };

  const isFinalTingkat = (jenjang: string, roman: string) => {
    if (isIdadiyah(jenjang)) return false; 
    if (jenjang.toLowerCase().includes("ibtida'iyyah")) return roman === 'VI';
    return roman === 'III'; 
  };

  useEffect(() => {
    if (formJenjang && formRoman) {
      if (isFinalTingkat(formJenjang, formRoman)) {
        setFormHasPraktek(true);
        if (formPraktekSubjects.length === 0 || (formPraktekSubjects.length === 1 && formPraktekSubjects[0] === '')) {
          setFormPraktekSubjects(['Ujian Praktek Al-Qur\'an', 'Ujian Praktek Ibadah']);
        }
      } else {
        setFormHasPraktek(false);
        setFormPraktekSubjects(['']);
      }
    }
  }, [formJenjang, formRoman]);

  const openAddModal = () => {
    setEditingItem(null);
    if (jenjangList.length > 0) setFormJenjang(jenjangList[0].name);
    setFormRoman('I');
    setFormMufatish('');
    setFormTargetNadzom('');
    setFormTargetBait(0);
    setModalOpen(true);
  };

  const openEditModal = (item: TingkatItem) => {
    setEditingItem(item);
    setFormJenjang(item.jenjangName);
    setFormRoman(item.romanName);
    setFormMufatish(item.mufatishName);
    setFormTargetNadzom(item.targetNadzom);
    setFormTargetBait(item.targetBait);
    setFormHasPraktek(item.hasPraktek);
    setFormPraktekSubjects(item.praktekSubjects.length > 0 ? item.praktekSubjects : ['']);
    setModalOpen(true);
  };

  const handlePraktekChange = (idx: number, value: string) => {
    const newArr = [...formPraktekSubjects];
    newArr[idx] = value;
    setFormPraktekSubjects(newArr);
  };

  const addPraktekField = () => {
    setFormPraktekSubjects([...formPraktekSubjects, '']);
  };

  const removePraktekField = (idx: number) => {
    const newArr = [...formPraktekSubjects];
    newArr.splice(idx, 1);
    setFormPraktekSubjects(newArr.length > 0 ? newArr : ['']);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJenjang || !formRoman) {
      showToast('Jenjang dan Nama Tingkat harus diisi', 'error');
      return;
    }
    
    setIsSubmitting(true);
    const payload = {
      jenjangName: formJenjang,
      romanName: formRoman,
      mufatishName: formMufatish,
      targetNadzom: formTargetNadzom,
      targetBait: formTargetBait,
      hasPraktek: formHasPraktek,
      praktekSubjects: JSON.stringify(formPraktekSubjects.filter(s => s.trim() !== ''))
    };

    try {
      if (editingItem) {
        await masterService.updateTingkat(editingItem.id, payload);
        showToast('Berhasil memperbarui data tingkat', 'success');
      } else {
        await masterService.createTingkat(payload);
        showToast('Berhasil menambahkan tingkat baru', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast('Gagal menyimpan data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: TingkatItem) => {
    showConfirm(
      'Hapus Tingkat',
      `Apakah Anda yakin ingin menghapus Tingkat ${item.romanName} (${item.jenjangName})?`,
      async () => {
        try {
          await masterService.deleteTingkat(item.id);
          showToast('Tingkat berhasil dihapus', 'success');
          loadData();
        } catch (err) {
          showToast('Gagal menghapus tingkat', 'error');
        }
      }
    );
  };

  const filteredData = tingkatList.filter(t => 
    (t.jenjangName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.romanName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.mufatishName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.targetNadzom || '').toLowerCase().includes(search.toLowerCase())
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
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-linear-to-br from-purple-500/20 to-pink-500/0 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-linear-to-tr from-purple-600 to-pink-500 rounded-2xl text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)] border border-purple-400/30">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">Master Tingkat</h1>
                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
                  Manajemen Tingkat Kelas & Kurikulum
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
                placeholder="Cari tingkat, jenjang, atau kurikulum..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-5 h-5 text-purple-400" />}
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
          
          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <PremiumButton 
            onClick={openAddModal} 
            variant="primary" 
            leftIcon={<Plus className="w-5 h-5" />}
            className="w-full md:w-auto shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_25px_rgba(79,70,229,0.4)] transition-all"
          >
            Tambah Tingkat
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
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat data...</span>
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr className="bg-slate-50/50">
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Tingkat (Roman)</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Induk Jenjang</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Mufatish / Pengawas</Th>
                  <Th className="font-black text-slate-500 uppercase tracking-widest text-[10px]">Target Kurikulum</Th>
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
                      className="group border-b border-slate-100 hover:bg-purple-50/30 transition-colors"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <span className="font-extrabold text-slate-800 text-lg">{item.romanName}</span>
                        </div>
                      </Td>
                      <Td>
                        <span className="font-bold text-slate-600 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" />
                          {item.jenjangName}
                        </span>
                      </Td>
                      <Td>
                        <span className="font-bold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm inline-block group-hover:border-purple-200 transition-colors">
                          {item.mufatishName || 'Belum Diatur'}
                        </span>
                      </Td>
                      <Td>
                        {item.targetNadzom ? (
                          <div>
                            <div className="font-black text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                              {item.targetNadzom}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                              Target: {item.targetBait} Bait
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Tidak ada nadzom</span>
                        )}
                        {item.hasPraktek && (
                          <div className="mt-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-100 text-rose-600 border border-rose-200">
                              Ada Ujian Praktek
                            </span>
                          </div>
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
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold text-sm">Tidak ada data tingkat ditemukan</p>
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
        title={editingItem ? 'Edit Tingkat' : 'Tambah Tingkat Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Jenjang</label>
              <PremiumSelect
                value={formJenjang}
                onChange={(e) => setFormJenjang(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-purple-500 transition-colors"
                required
              >
                {jenjangList.map(j => <option key={j.id} value={j.name}>{j.name}</option>)}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tingkat / Kelas</label>
              <PremiumSelect
                value={formRoman}
                onChange={(e) => setFormRoman(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 focus:outline-hidden focus:border-purple-500 transition-colors"
                required
              >
                <option value="I">Tingkat I (1)</option>
                <option value="II">Tingkat II (2)</option>
                <option value="III">Tingkat III (3)</option>
                <option value="IV">Tingkat IV (4)</option>
                <option value="V">Tingkat V (5)</option>
                <option value="VI">Tingkat VI (6)</option>
              </PremiumSelect>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Mufatish (Pengawas Tingkat)</label>
            <SoftInput
              value={formMufatish}
              onChange={(e) => setFormMufatish(e.target.value)}
              placeholder="e.g. Ustadz Abdullah"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 mt-2">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Kurikulum Nadzom</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Nadzom</label>
                <SoftInput
                  value={formTargetNadzom}
                  onChange={(e) => setFormTargetNadzom(e.target.value)}
                  placeholder="e.g. Aqidatul Awam"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Target Bait</label>
                <input
                  type="number"
                  value={formTargetBait}
                  onChange={(e) => setFormTargetBait(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {formHasPraktek && (
            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-rose-700 uppercase tracking-widest">Ujian Praktek (Tingkat Akhir)</h3>
                <button type="button" onClick={addPraktekField} className="text-[10px] font-bold text-rose-600 hover:text-rose-800 bg-rose-100 px-2 py-1 rounded-lg">
                  + Tambah Mapel
                </button>
              </div>
              {formPraktekSubjects.map((subject, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <SoftInput
                    value={subject}
                    onChange={(e) => handlePraktekChange(idx, e.target.value)}
                    placeholder="Mata pelajaran praktek..."
                  />
                  {formPraktekSubjects.length > 1 && (
                    <button type="button" onClick={() => removePraktekField(idx)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <PremiumButton type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </PremiumButton>
            <PremiumButton type="submit" variant="primary" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting} leftIcon={isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
