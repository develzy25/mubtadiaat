import { useState, useEffect } from 'react';
import { 
  Building2, 
  BedDouble, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Save
} from 'lucide-react';
import { GlassCard, 
  PremiumButton, 
  SoftInput,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal, PremiumSelect, DataExportImport } from '../components/ui';
import { useNotificationStore } from '../stores/notificationStore';
import { fetchSantri } from '../services/admin.service';
import type { SantriAdmin } from '../services/admin.service';
import * as masterService from '../services/master.service';
import { generateExcelTemplate, exportToExcel, parseExcel, type ExcelColumnConfig } from '../utils/excelService';

const BLOK_COLUMNS: ExcelColumnConfig[] = [
  { key: 'name', header: 'Nama Blok', width: 30, type: 'text', required: true, example: 'Blok A, Al-Ghozali' },
];

const KAMAR_COLUMNS: ExcelColumnConfig[] = [
  { key: 'name', header: 'Nama Kamar', width: 30, type: 'text', required: true, example: 'Kamar 01' },
  { key: 'blokName', header: 'Nama Blok', width: 30, type: 'text', required: true, example: 'Blok A' },
  { key: 'penasihat', header: 'Nama Penasihat Kamar', width: 30, type: 'text', required: false, example: 'Ust. Fulan' },
];

export interface BlokItem {
  id: string;
  name: string;
}

export interface KamarItem {
  id: string;
  blokId: string;
  name: string;
  penasihat: string;
}

export const AdminBlokKamarPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<'BLOK' | 'KAMAR'>('BLOK');
  
  const [blokList, setBlokList] = useState<BlokItem[]>([]);
  const [kamarList, setKamarList] = useState<KamarItem[]>([]);
  const [santriList, setSantriList] = useState<SantriAdmin[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [blokModalOpen, setBlokModalOpen] = useState(false);
  const [editingBlok, setEditingBlok] = useState<BlokItem | null>(null);
  const [formBlokName, setFormBlokName] = useState('');

  const [kamarModalOpen, setKamarModalOpen] = useState(false);
  const [editingKamar, setEditingKamar] = useState<KamarItem | null>(null);
  const [formKamarBlokId, setFormKamarBlokId] = useState('');
  const [formKamarName, setFormKamarName] = useState('');
  const [formKamarPenasihat, setFormKamarPenasihat] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, kRes, sRes] = await Promise.all([
        masterService.fetchBlok(),
        masterService.fetchKamar(),
        fetchSantri({ status: 'ACTIVE' })
      ]);
      
      if (bRes.success) setBlokList(bRes.data);
      if (kRes.success) setKamarList(kRes.data);
      if (sRes.success) setSantriList(sRes.data);
    } catch (err) {
      console.error(err);
      showToast('Gagal memuat data Blok/Kamar', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  // Blok CRUD
  const handleSaveBlok = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBlokName.trim()) return;

    try {
      if (editingBlok) {
        await masterService.updateBlok(editingBlok.id, { name: formBlokName.trim() });
        showToast('Blok berhasil diperbarui', 'success');
      } else {
        await masterService.createBlok({ name: formBlokName.trim() });
        showToast('Blok berhasil ditambahkan', 'success');
      }
      setBlokModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem', 'error');
    }
  };

  const handleDeleteBlok = async (id: string) => {
    // Check if used
    const inUse = kamarList.some(k => k.blokId === id);
    if (inUse) {
      showToast('Tidak bisa menghapus Blok karena masih memiliki Kamar', 'error');
      return;
    }
    
    showConfirm(
      'Hapus Blok',
      'Apakah Anda yakin ingin menghapus Blok ini secara permanen?',
      'warning',
      async () => {
        try {
          await masterService.deleteBlok(id);
          showToast('Blok berhasil dihapus', 'success');
          loadData();
        } catch (err: any) {
          showToast(err.message || 'Terjadi kesalahan sistem', 'error');
        }
      }
    );
  };

  // Kamar CRUD
  const handleSaveKamar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formKamarName.trim() || !formKamarBlokId) return;

    const payload = {
      name: formKamarName.trim(),
      blokId: formKamarBlokId,
      penasihat: formKamarPenasihat.trim()
    };

    try {
      if (editingKamar) {
        await masterService.updateKamar(editingKamar.id, payload);
        showToast('Kamar berhasil diperbarui', 'success');
      } else {
        await masterService.createKamar(payload);
        showToast('Kamar berhasil ditambahkan', 'success');
      }
      setKamarModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan sistem', 'error');
    }
  };

  const handleDeleteKamar = async (id: string, name: string) => {
    // Prevent deletion if there are santri assigned
    const count = getKamarOccupants(name);
    if (count > 0) {
      showToast('Tidak bisa menghapus kamar yang memiliki penghuni', 'error');
      return;
    }

    showConfirm(
      'Hapus Kamar',
      'Apakah Anda yakin ingin menghapus Kamar ini secara permanen?',
      'warning',
      async () => {
        try {
          await masterService.deleteKamar(id);
          showToast('Kamar berhasil dihapus', 'success');
          loadData();
        } catch (err: any) {
          showToast(err.message || 'Terjadi kesalahan sistem', 'error');
        }
      }
    );
  };

  const handleDownloadTemplate = async () => {
    if (activeTab === 'BLOK') {
      await generateExcelTemplate(BLOK_COLUMNS, 'Template_Blok_Mubtadiat.xlsx');
    } else {
      await generateExcelTemplate(KAMAR_COLUMNS, 'Template_Kamar_Mubtadiat.xlsx');
    }
  };

  const handleExportData = async () => {
    if (activeTab === 'BLOK') {
      await exportToExcel(blokList, BLOK_COLUMNS, 'Data_Blok_Mubtadiat.xlsx');
    } else {
      const exportKamar = kamarList.map(k => {
        const b = blokList.find(b => b.id === k.blokId);
        return { ...k, blokName: b?.name || '' };
      });
      await exportToExcel(exportKamar, KAMAR_COLUMNS, 'Data_Kamar_Mubtadiat.xlsx');
    }
  };

  const handleImportData = async (file: File) => {
    try {
      const parsedData = await parseExcel(file);
      if (parsedData.length === 0) throw new Error('Data kosong');
      
      let imported = 0;
      if (activeTab === 'BLOK') {
        for (const row of parsedData) {
          if (row.name) {
            await masterService.createBlok({ name: row.name });
            imported++;
          }
        }
      } else {
        for (const row of parsedData) {
          if (row.name && row.blokName) {
            const blok = blokList.find(b => b.name.toLowerCase() === String(row.blokName).toLowerCase());
            if (blok) {
              await masterService.createKamar({
                name: row.name,
                blokId: blok.id,
                penasihat: row.penasihat || ''
              });
              imported++;
            }
          }
        }
      }
      showToast(`${imported} data berhasil diimport!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengimport data', 'error');
    }
  };

  // Derived counts
  const getBlokKamarCount = (blokId: string) => kamarList.filter(k => k.blokId === blokId).length;
  
  const getKamarOccupants = (id: string) => {
    return santriList.filter(s => s.kamarId === id).length;
  };

  const getKamarSiswiCount = (kamar: KamarItem) => {
    return santriList.filter(s => s.kamarId === kamar.id).length;
  };

  const filteredBlok = blokList.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
  const filteredKamar = kamarList.filter(k => {
    const blok = blokList.find(b => b.id === k.blokId);
    const text = `${k.name} ${k.penasihat} ${blok?.name || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Master Blok & Kamar
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Kelola data blok asrama, kamar, dan penasihat kamar.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('BLOK')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'BLOK' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Data Blok
        </button>
        <button
          onClick={() => setActiveTab('KAMAR')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'KAMAR' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          Data Kamar
        </button>
      </div>

      {/* Toolbar */}
      <GlassCard variant="neumorph" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <SoftInput
            placeholder={`Cari ${activeTab === 'BLOK' ? 'nama blok' : 'kamar atau penasihat'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-slate-400" />}
            className="w-full"
          />
        </div>
      </GlassCard>

      <div className="flex flex-col items-end gap-3 mb-6">
        <PremiumButton 
          onClick={() => {
            if (activeTab === 'BLOK') {
              setEditingBlok(null);
              setFormBlokName('');
              setBlokModalOpen(true);
            } else {
              setEditingKamar(null);
              setFormKamarName('');
              setFormKamarPenasihat('');
              setFormKamarBlokId(blokList.length > 0 ? blokList[0].id : '');
              setKamarModalOpen(true);
            }
          }}
          variant="primary"
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Tambah {activeTab === 'BLOK' ? 'Blok' : 'Kamar'}
        </PremiumButton>
        <DataExportImport 
          onDownloadTemplate={handleDownloadTemplate}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      </div>

      {/* Content */}
      <GlassCard variant="neumorph" className="overflow-hidden border border-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-slate-500 font-semibold text-xs uppercase tracking-wide">Memuat data...</p>
          </div>
        ) : activeTab === 'BLOK' ? (
            <Table>
              <Thead>
                <Tr>
                  <Th>No</Th>
                  <Th>Nama Blok</Th>
                  <Th className="text-center">Jumlah Kamar</Th>
                  <Th className="text-right">Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBlok.map((blok, i) => (
                  <Tr key={blok.id}>
                    <Td className="font-bold text-slate-400">{i + 1}</Td>
                    <Td className="font-extrabold text-slate-800">{blok.name}</Td>
                    <Td className="text-center">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-black text-[11px] border border-blue-100">
                        {getBlokKamarCount(blok.id)} Kamar
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingBlok(blok);
                            setFormBlokName(blok.name);
                            setBlokModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlok(blok.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
                {filteredBlok.length === 0 && (
                  <Tr>
                    <Td colSpan={4} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Belum ada data blok.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <Thead>
                <Tr>
                  <Th>Blok</Th>
                  <Th>Kamar</Th>
                  <Th>Penasihat</Th>
                  <Th className="text-center">Jumlah Siswi</Th>
                  <Th className="text-right">Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredKamar.map((kamar) => {
                  const blok = blokList.find(b => b.id === kamar.blokId);
                  const siswiCount = getKamarSiswiCount(kamar);
                  return (
                    <Tr key={kamar.id}>
                      <Td className="font-bold text-blue-600">{blok?.name || '-'}</Td>
                      <Td className="font-extrabold text-slate-800">{kamar.name}</Td>
                      <Td className="font-semibold text-slate-600">{kamar.penasihat || '-'}</Td>
                      <Td className="text-center">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-black text-[11px] border border-blue-100">
                          {siswiCount} Siswi
                        </span>
                      </Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingKamar(kamar);
                              setFormKamarBlokId(kamar.blokId);
                              setFormKamarName(kamar.name);
                              setFormKamarPenasihat(kamar.penasihat);
                              setKamarModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteKamar(kamar.id, blok ? `${blok.name} - ${kamar.name}` : kamar.name)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
                {filteredKamar.length === 0 && (
                  <Tr>
                    <Td colSpan={5} className="text-center py-12 text-slate-400 font-bold uppercase tracking-wider">
                      Belum ada data kamar.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </div>
        )}
      </GlassCard>

      {/* Blok Modal */}
      <Modal
        isOpen={blokModalOpen}
        onClose={() => setBlokModalOpen(false)}
        title={editingBlok ? 'Edit Blok Asrama' : 'Tambah Blok Baru'}
        maxWidthClass="max-w-md"
        onSubmit={handleSaveBlok}
        footer={
          <>
            <PremiumButton type="button" variant="secondary" onClick={() => setBlokModalOpen(false)}>Batal</PremiumButton>
            <PremiumButton type="submit" variant="primary" rightIcon={<Save className="w-4 h-4" />}>Simpan</PremiumButton>
          </>
        }
      >
        <SoftInput
          label="Nama Blok"
          value={formBlokName}
          onChange={(e) => setFormBlokName(e.target.value)}
          placeholder="Contoh: Blok A, Blok Khadijah..."
          required
        />
      </Modal>

      {/* Kamar Modal */}
      <Modal
        isOpen={kamarModalOpen}
        onClose={() => setKamarModalOpen(false)}
        title={editingKamar ? 'Edit Kamar Asrama' : 'Tambah Kamar Baru'}
        maxWidthClass="max-w-md"
        onSubmit={handleSaveKamar}
        footer={
          <>
            <PremiumButton type="button" variant="secondary" onClick={() => setKamarModalOpen(false)}>Batal</PremiumButton>
            <PremiumButton type="submit" variant="primary" rightIcon={<Save className="w-4 h-4" />}>Simpan</PremiumButton>
          </>
        }
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase">Pilih Blok</label>
          <PremiumSelect
            value={formKamarBlokId}
            onChange={(e) => setFormKamarBlokId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white transition-all neumorph-pressed"
            required
          >
            {blokList.length === 0 && <option value="">-- Buat Blok Terlebih Dahulu --</option>}
            {blokList.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </PremiumSelect>
        </div>
        <SoftInput
          label="Nama Kamar"
          value={formKamarName}
          onChange={(e) => setFormKamarName(e.target.value)}
          placeholder="Contoh: Kamar 01, Mawar 02..."
          required
        />
        <SoftInput
          label="Nama Penasihat"
          value={formKamarPenasihat}
          onChange={(e) => setFormKamarPenasihat(e.target.value)}
          placeholder="Nama Ustadzah/Penasihat kamar..."
        />
      </Modal>
    </div>
  );
};
