import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Trash2,
  Edit3,
  X,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSantri, saveSantri, updateSantri, deleteSantri, fetchProvinces, fetchRegencies, fetchDistricts, fetchVillages } from '../../services/admin.service';
import type { SantriAdmin } from '../../services/admin.service';
import * as masterService from '../../services/master.service';
import { GlassCard, 
  PremiumButton, 
  SoftInput,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal, 
  PremiumSelect,
  DataExportImport } from '../../components/ui';
import { useNotificationStore } from '../../stores/notificationStore';
import { generateExcelTemplate, exportToExcel, parseExcel, type ExcelColumnConfig } from '../../utils/excelService';

const SANTRI_COLUMNS: ExcelColumnConfig[] = [
  { key: 'name', header: 'Nama Lengkap', width: 30, type: 'text', required: true },
  { key: 'nik', header: 'NIK', width: 20, type: 'text', required: true },
  { key: 'noStambuk', header: 'No Stambuk', width: 20, type: 'text', required: true },
  { key: 'tempatLahir', header: 'Tempat Lahir', width: 20, type: 'text', required: true },
  { key: 'tanggalLahir', header: 'Tanggal Lahir', width: 15, type: 'date', required: true, example: '2010-01-01' },
  { key: 'noKk', header: 'No KK', width: 20, type: 'text', required: true },
  { key: 'namaAyah', header: 'Nama Ayah', width: 25, type: 'text', required: true },
  { key: 'namaIbu', header: 'Nama Ibu', width: 25, type: 'text', required: true },
  { key: 'tahunMasuk', header: 'Tahun Masuk', width: 15, type: 'number', required: true, example: '2025' },
  { key: 'alamatLengkap', header: 'Alamat Lengkap', width: 40, type: 'text', required: true },
  { key: 'status', header: 'Status', width: 15, type: 'text', required: true, example: 'ACTIVE, CUTI, BOYONG, ALUMNI', note: 'Isi dengan ACTIVE' }
];

export const SantriTab = () => {
  const { showToast, showConfirm } = useNotificationStore();
  const [santriList, setSantriList] = useState<SantriAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filters
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [kamarList, setKamarList] = useState<any[]>([]);
  const [classFilter, setClassFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  
  // Popover State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SantriAdmin | null>(null);
  
  const [formName, setFormName] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formNoStambuk, setFormNoStambuk] = useState('');
  const [formTempatLahir, setFormTempatLahir] = useState('');
  const [formTanggalLahir, setFormTanggalLahir] = useState('');
  const [formNoKk, setFormNoKk] = useState('');
  const [formNamaAyah, setFormNamaAyah] = useState('');
  const [formNamaIbu, setFormNamaIbu] = useState('');
  const [formTahunMasuk, setFormTahunMasuk] = useState('');
  const [formProvinsi, setFormProvinsi] = useState('');
  const [formKabupaten, setFormKabupaten] = useState('');
  const [formKecamatan, setFormKecamatan] = useState('');
  const [formKelurahan, setFormKelurahan] = useState('');
  const [formKodePos, setFormKodePos] = useState('');
  const [formAlamat, setFormAlamat] = useState('');
  const [formKamar, setFormKamar] = useState('');
  const [formKelas, setFormKelas] = useState('');

  // Region Lists
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, kRes] = await Promise.all([
        fetchSantri({ status: 'ACTIVE', search: search || undefined }),
        masterService.fetchKelas(),
        masterService.fetchKamar()
      ]);
      
      if (sRes.success) {
        let data: SantriAdmin[] = sRes.data;
        if (classFilter) data = data.filter(s => s.kelasId === classFilter);
        if (roomFilter) data = data.filter(s => s.kamarId === roomFilter);
        setSantriList(data);
      }
      
      if (cRes.success) setKelasList(cRes.data);
      if (kRes.success) setKamarList(kRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Load provinces once on mount
    fetchProvinces().then(res => {
      if(res.success) setProvinces(res.data);
    });
  }, [classFilter, roomFilter]);

  // Handle region cascading
  useEffect(() => {
    if (formProvinsi) {
      // API expects ID. Wait, formProvinsi could be the name if we save the name to DB.
      // But we need the ID to fetch regencies. Let's assume formProvinsi stores the ID for dropdown.
      // Actually we should store the ID in the form state so we can fetch regencies.
      fetchRegencies(formProvinsi).then(res => setRegencies(res.success ? res.data : []));
    } else {
      setRegencies([]);
    }
    setFormKabupaten('');
  }, [formProvinsi]);

  useEffect(() => {
    if (formKabupaten) {
      fetchDistricts(formKabupaten).then(res => setDistricts(res.success ? res.data : []));
    } else {
      setDistricts([]);
    }
    setFormKecamatan('');
  }, [formKabupaten]);

  useEffect(() => {
    if (formKecamatan) {
      fetchVillages(formKecamatan).then(res => setVillages(res.success ? res.data : []));
    } else {
      setVillages([]);
    }
    setFormKelurahan('');
  }, [formKecamatan]);

  useEffect(() => {
    if (formKelurahan && !formKodePos) {
      const selectedVillage = villages.find(v => v.id === formKelurahan);
      if (selectedVillage) {
        // Fetch real postal code using external API
        fetch(`https://kodepos.vercel.app/search?q=${encodeURIComponent(selectedVillage.name)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.data && data.data.length > 0) {
              setFormKodePos(data.data[0].code.toString());
            }
          })
          .catch(err => console.error('Failed to fetch kode pos', err));
      }
    }
  }, [formKelurahan, villages, formKodePos]);

  // Click outside to close filter popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormNik('');
    setFormNoStambuk('');
    setFormTempatLahir('');
    setFormTanggalLahir('');
    setFormNoKk('');
    setFormNamaAyah('');
    setFormNamaIbu('');
    setFormTahunMasuk('');
    setFormProvinsi('');
    setFormKabupaten('');
    setFormKecamatan('');
    setFormKelurahan('');
    setFormKodePos('');
    setFormAlamat('');
    setFormKamar('');
    setFormKelas('');
    setModalOpen(true);
  };

  const openEditModal = (item: SantriAdmin) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormNik(item.nik || '');
    setFormNoStambuk(item.noStambuk || '');
    setFormTempatLahir(item.tempatLahir || '');
    setFormTanggalLahir(item.tanggalLahir || '');
    setFormNoKk(item.noKk || '');
    setFormNamaAyah(item.namaAyah || '');
    setFormNamaIbu(item.namaIbu || '');
    setFormTahunMasuk(item.tahunMasuk || '');
    setFormProvinsi(item.provinsi || '');
    setFormKabupaten(item.kabupaten || '');
    setFormKecamatan(item.kecamatan || '');
    setFormKelurahan(item.kelurahan || '');
    setFormKodePos(item.kodePos || '');
    setFormAlamat(item.alamatLengkap || '');
    setFormKamar(item.kamarId || '');
    setFormKelas(item.kelasId || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload: Partial<SantriAdmin> = {
      name: formName,
      nik: formNik,
      noStambuk: formNoStambuk,
      tempatLahir: formTempatLahir,
      tanggalLahir: formTanggalLahir,
      noKk: formNoKk,
      namaAyah: formNamaAyah,
      namaIbu: formNamaIbu,
      tahunMasuk: formTahunMasuk,
      provinsi: formProvinsi,
      kabupaten: formKabupaten,
      kecamatan: formKecamatan,
      kelurahan: formKelurahan,
      kodePos: formKodePos,
      alamatLengkap: formAlamat,
      kamarId: formKamar,
      kelasId: formKelas,
      status: 'ACTIVE'
    };

    try {
      if (editingItem) {
        await updateSantri(editingItem.id, payload);
        showToast('Berhasil mengupdate data santri', 'success');
      } else {
        await saveSantri(payload);
        showToast('Berhasil menambahkan santri', 'success');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Gagal menyimpan data santri', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (santri: SantriAdmin, newStatus: string) => {
    if (newStatus !== 'ACTIVE' && newStatus !== 'ALUMNI' && newStatus !== 'BOYONG' && newStatus !== 'CUTI') return;
    
    showConfirm(
      'Ubah Status Santri',
      `Ubah status ${santri.name} menjadi ${newStatus}?`,
      async () => {
        try {
          const currentYear = new Date().getFullYear().toString();
          await updateSantri(santri.id, {
            status: newStatus as any,
            tahunKeluar: currentYear
          });
          showToast(`Status santri diubah menjadi ${newStatus}`, 'success');
          loadData();
        } catch (err) {
          showToast('Gagal mengubah status', 'error');
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    showConfirm(
      'Hapus Data',
      'Yakin ingin menghapus data santri ini permanen?',
      async () => {
        try {
          await deleteSantri(id);
          showToast('Data berhasil dihapus', 'success');
          loadData();
        } catch (err) {
          showToast('Gagal menghapus data', 'error');
        }
      }
    );
  };

  const handleDownloadTemplate = async () => {
    await generateExcelTemplate(SANTRI_COLUMNS, 'Template_Santri_Mubtadiat.xlsx');
  };

  const handleExportData = async () => {
    await exportToExcel(santriList, SANTRI_COLUMNS, 'Data_Santri_Mubtadiat.xlsx');
  };

  const handleImportData = async (file: File) => {
    try {
      setLoading(true);
      const data = await parseExcel(file);
      if (data.length === 0) throw new Error('Data kosong');
      
      let imported = 0;
      for (const row of data) {
        if (row.name && row.nik) {
          await saveSantri({
            name: row.name,
            nik: String(row.nik),
            noStambuk: String(row.noStambuk || ''),
            tempatLahir: row.tempatLahir || '',
            tanggalLahir: row.tanggalLahir || '',
            noKk: String(row.noKk || ''),
            namaAyah: row.namaAyah || '',
            namaIbu: row.namaIbu || '',
            tahunMasuk: String(row.tahunMasuk || new Date().getFullYear()),
            provinsi: '',
            kabupaten: '',
            kecamatan: '',
            kelurahan: '',
            kodePos: '',
            alamatLengkap: row.alamatLengkap || '',
            status: row.status || 'ACTIVE',
            kelasId: '',
            kamarId: ''
          });
          imported++;
        }
      }
      showToast(`${imported} data santri berhasil diimport!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengimport data', 'error');
      setLoading(false);
    }
  };

  const isFilterActive = classFilter !== '' || roomFilter !== '';

  return (
    <div className="space-y-6 relative">
      {/* Top Bar with Search, Actions, and Filter Popover */}
      <GlassCard variant="neumorph" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <SoftInput
            placeholder="Cari nama, stambuk, NIK santri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-slate-400" />}
            className="w-full"
          />
          {search && (
            <button 
              onClick={() => { setSearch(''); setTimeout(() => loadData(), 50); }}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end relative" ref={filterRef}>
          {/* Popover Filter Trigger */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all shadow-sm ${
              isFilterActive 
                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className={`w-4 h-4 ${isFilterActive ? 'text-blue-600' : 'text-slate-400'}`} />
            Filter Tabel
            {isFilterActive && (
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 right-2 animate-ping" />
            )}
          </button>

          {/* Premium Popover for Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
                className="absolute top-14 right-0 w-80 bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] p-5 rounded-2xl z-50 flex flex-col gap-4"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Filter Kelas</label>
                  <PremiumSelect
                    value={classFilter}
                    onChange={(e: any) => setClassFilter(e.target.value)}
                    disabled={kelasList.length === 0}
                    className="w-full bg-slate-50"
                  >
                    {kelasList.length === 0 ? (
                      <option value="">Buat Master Kelas terlebih dahulu</option>
                    ) : (
                      <option value="">Semua Kelas</option>
                    )}
                    {kelasList.map(c => (
                      <option key={c.id} value={c.id}>{c.jenjangName} - {c.tingkatName} {c.bagian}</option>
                    ))}
                  </PremiumSelect>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Filter Kamar</label>
                  <PremiumSelect
                    value={roomFilter}
                    onChange={(e: any) => setRoomFilter(e.target.value)}
                    disabled={kamarList.length === 0}
                    className="w-full bg-slate-50"
                  >
                    {kamarList.length === 0 ? (
                      <option value="">Buat Master Kamar terlebih dahulu</option>
                    ) : (
                      <option value="">Semua Kamar</option>
                    )}
                    {kamarList.map(k => (
                      <option key={k.id} value={k.id}>{k.blok} - {k.name}</option>
                    ))}
                  </PremiumSelect>
                </div>

                {(classFilter || roomFilter) && (
                  <button 
                    onClick={() => { setClassFilter(''); setRoomFilter(''); setIsFilterOpen(false); }}
                    className="mt-2 w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-colors border border-rose-100"
                  >
                    Reset Filter
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <DataExportImport 
            onDownloadTemplate={handleDownloadTemplate}
            onExportData={handleExportData}
            onImportData={handleImportData}
            isLoading={loading}
          />

          <PremiumButton onClick={openAddModal} leftIcon={<Plus className="w-5 h-5" />} className="bg-blue-600 hover:bg-blue-700 shadow-[0_4px_15px_rgba(37,99,235,0.3)]">
            Tambah Santri
          </PremiumButton>
        </div>
      </GlassCard>

      {/* Datatable */}
      <GlassCard variant="neumorph" className="overflow-hidden border border-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide">Memuat data...</p>
          </div>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Identitas (No. Stambuk / NIK)</Th>
                <Th>Nama & Alamat</Th>
                <Th>Ruang Kelas</Th>
                <Th>Ruang Kamar</Th>
                <Th>Status Aktif</Th>
                <Th className="text-right">Aksi & Mutasi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {santriList.map(santri => (
                <Tr key={santri.id}>
                  <Td>
                    <div className="font-extrabold text-slate-800">{santri.noStambuk || '-'}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{santri.nik || '-'}</div>
                  </Td>
                  <Td>
                    <div className="font-extrabold text-slate-900">{santri.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{santri.alamatLengkap || '-'}</div>
                  </Td>
                  <Td>
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                      {kelasList.find(k => k.id === santri.kelasId) ? `${kelasList.find(k => k.id === santri.kelasId).jenjangName} ${kelasList.find(k => k.id === santri.kelasId).tingkatName} ${kelasList.find(k => k.id === santri.kelasId).bagian}` : (santri.kelasId || '-')}
                    </span>
                  </Td>
                  <Td>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold">
                      {kamarList.find(k => k.id === santri.kamarId) ? `${kamarList.find(k => k.id === santri.kamarId).blok} - ${kamarList.find(k => k.id === santri.kamarId).name}` : (santri.kamarId || '-')}
                    </span>
                  </Td>
                  <Td>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 border border-blue-200">
                      Aktif
                    </span>
                  </Td>
                  <Td className="text-right space-x-1.5">
                    <PremiumSelect
                      value=""
                      onChange={(e: any) => { if(e.target.value) handleStatusChange(santri, e.target.value); }}
                      className="inline-block w-28 bg-white border border-slate-200 px-2 py-1.5 text-[9px] text-slate-600"
                    >
                      <option value="">Mutasi...</option>
                      <option value="ALUMNI">Jadikan Alumni</option>
                      <option value="CUTI">Mutasi Cuti</option>
                      <option value="BOYONG">Mutasi Boyong</option>
                    </PremiumSelect>
                    
                    <button
                      onClick={() => openEditModal(santri)}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(santri.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Td>
                </Tr>
              ))}
              {santriList.length === 0 && (
                <Tr>
                  <Td colSpan={6} className="text-center py-20 text-slate-400 italic">
                    Tidak ada data santri aktif ditemukan
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </GlassCard>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Data Santri' : 'Tambah Santri Baru'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
              <SoftInput
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tahun Masuk</label>
              <SoftInput
                value={formTahunMasuk}
                onChange={(e) => setFormTahunMasuk(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">NIK</label>
              <SoftInput
                value={formNik}
                onChange={(e) => setFormNik(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">No. Stambuk</label>
              <SoftInput
                value={formNoStambuk}
                onChange={(e) => setFormNoStambuk(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tempat Lahir</label>
              <SoftInput
                value={formTempatLahir}
                onChange={(e) => setFormTempatLahir(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tanggal Lahir</label>
              <SoftInput
                type="date"
                value={formTanggalLahir}
                onChange={(e) => setFormTanggalLahir(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Ayah</label>
              <SoftInput
                value={formNamaAyah}
                onChange={(e) => setFormNamaAyah(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Ibu</label>
              <SoftInput
                value={formNamaIbu}
                onChange={(e) => setFormNamaIbu(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">No. KK</label>
              <SoftInput
                value={formNoKk}
                onChange={(e) => setFormNoKk(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Alamat Jalan / Lengkap</label>
              <SoftInput
                value={formAlamat}
                onChange={(e) => setFormAlamat(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Provinsi</label>
              <PremiumSelect
                value={formProvinsi}
                onChange={(e: any) => setFormProvinsi(e.target.value)}
                className="w-full bg-slate-50"
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kabupaten / Kota</label>
              <PremiumSelect
                value={formKabupaten}
                onChange={(e: any) => setFormKabupaten(e.target.value)}
                disabled={!formProvinsi}
                className="w-full bg-slate-50"
              >
                <option value="">Pilih Kabupaten</option>
                {regencies.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </PremiumSelect>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kecamatan</label>
              <PremiumSelect
                value={formKecamatan}
                onChange={(e: any) => setFormKecamatan(e.target.value)}
                disabled={!formKabupaten}
                className="w-full bg-slate-50"
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kelurahan</label>
              <PremiumSelect
                value={formKelurahan}
                onChange={(e: any) => setFormKelurahan(e.target.value)}
                disabled={!formKecamatan}
                className="w-full bg-slate-50"
              >
                <option value="">Pilih Kelurahan</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Kode Pos</label>
              <SoftInput
                value={formKodePos}
                onChange={(e) => setFormKodePos(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Pilih Kamar</label>
              <PremiumSelect
                value={formKamar}
                onChange={(e: any) => setFormKamar(e.target.value)}
                disabled={kamarList.length === 0}
                className="w-full bg-slate-50"
              >
                {kamarList.length === 0 ? (
                  <option value="">Buat Master Kamar terlebih dahulu</option>
                ) : (
                  <option value="">Pilih Kamar</option>
                )}
                {kamarList.map(k => (
                  <option key={k.id} value={k.id}>{k.blok} - {k.name}</option>
                ))}
              </PremiumSelect>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Pilih Kelas</label>
              <PremiumSelect
                value={formKelas}
                onChange={(e: any) => setFormKelas(e.target.value)}
                disabled={kelasList.length === 0}
                className="w-full bg-slate-50"
              >
                {kelasList.length === 0 ? (
                  <option value="">Buat Master Kelas terlebih dahulu</option>
                ) : (
                  <option value="">Pilih Kelas</option>
                )}
                {kelasList.map(c => (
                  <option key={c.id} value={c.id}>{c.jenjangName} - {c.tingkatName} {c.bagian}</option>
                ))}
              </PremiumSelect>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <PremiumButton type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Batal
            </PremiumButton>
            <PremiumButton type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
