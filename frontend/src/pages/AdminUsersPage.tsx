import { useState, useEffect } from 'react';
import { 
  Shield, 
  Edit3, 
  Save, 
  Trash2,
  Plus,
  Key
} from 'lucide-react';
import { 
  fetchUsers, 
  saveUser, 
  updateUser, 
  deleteUser, 
  resetUserPassword,
  fetchSantri
} from '../services/admin.service';
import type { UserAdmin, SantriAdmin } from '../services/admin.service';
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
import { generateExcelTemplate, exportToExcel, parseExcel, type ExcelColumnConfig } from '../utils/excelService';

const USER_COLUMNS: ExcelColumnConfig[] = [
  { key: 'name', header: 'Nama Lengkap', width: 30, type: 'text', required: true, example: 'Ahmad Muzakki' },
  { key: 'username', header: 'Username', width: 25, type: 'text', required: true, example: 'ahmad' },
  { key: 'role', header: 'ID Role', width: 15, type: 'number', required: true, example: '1=Admin, 2=Mundzir, 3=Mufatish, 4=Mustahiq', note: 'Isi dengan angka 1 sampai 4' },
];

export const AdminUsersPage = () => {
  const { showToast, showConfirm } = useNotificationStore();
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [alumniList, setAlumniList] = useState<SantriAdmin[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<number | 'ALL'>('ALL');

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null); // null means "Add New User"
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formRole, setFormRole] = useState<number>(4);
  const [selectedAlumniId, setSelectedAlumniId] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchUsers();
      if (res.success && res.data) {
        setUsers(res.data.users);
      }

      // Load alumni for promotion
      const resAlumni = await fetchSantri({ status: 'ALUMNI' });
      if (resAlumni.success) {
        setAlumniList(resAlumni.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setSelectedUser(null);
    setFormName('');
    setFormUsername('');
    setFormRole(4);
    setSelectedAlumniId('');
    setError('');
    setEditModalOpen(true);
  };

  const openEditModal = (user: UserAdmin) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormUsername(user.username || '');
    setFormRole(user.role || 4);
    setSelectedAlumniId('');
    
    setError('');
    setEditModalOpen(true);
  };

  const handleSelectAlumni = (alumniId: string) => {
    setSelectedAlumniId(alumniId);
    if (!alumniId) return;

    const selected = alumniList.find(s => s.id === alumniId);
    if (selected) {
      setFormName(selected.name);
      // Generate clean username (first and middle name)
      const nameParts = selected.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
      const username = nameParts.length >= 2 
        ? `${nameParts[0]}.${nameParts[1]}`
        : (nameParts.length === 1 ? nameParts[0] : `user${Math.floor(Math.random() * 100)}`);
      setFormUsername(username);
    }
  };


  const handleDelete = (user: UserAdmin) => {
    showConfirm(
      'Hapus Pengguna',
      `Apakah Anda yakin ingin menghapus hak akses ${user.name}?`,
      async () => {
        try {
          const res = await deleteUser(user.id);
          if (res.success) {
            showToast('Pengguna berhasil dihapus.', 'success');
            loadData();
          } else {
            showToast(res.message || 'Gagal menghapus pengguna.', 'error');
          }
        } catch {
          showToast('Terjadi kesalahan sistem.', 'error');
        }
      }
    );
  };

  const handleResetPassword = (user: UserAdmin) => {
    showConfirm(
      'Reset Kata Sandi',
      `Apakah Anda yakin ingin mereset kata sandi ${user.name} menjadi "mubtadiaat123"?`,
      async () => {
        try {
          const res = await resetUserPassword(user.id);
          if (res.success) {
            showToast('Kata sandi berhasil direset ke "mubtadiaat123".', 'success');
          } else {
            showToast(res.message || 'Gagal mereset kata sandi.', 'error');
          }
        } catch {
          showToast('Terjadi kesalahan sistem.', 'error');
        }
      }
    );
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formName.trim() || !formUsername.trim()) {
      setError('Nama Lengkap dan Username wajib diisi.');
      return;
    }


    const payload: Partial<UserAdmin> = {
      name: formName.trim(),
      username: formUsername.trim(),
      role: formRole
    };

    try {
      let res;
      if (selectedUser) {
        res = await updateUser(selectedUser.id, payload);
      } else {
        res = await saveUser(payload);
      }

      if (res.success) {
        showToast(
          selectedUser 
            ? 'Profil & Otorisasi berhasil diperbarui.' 
            : 'Pengguna baru berhasil ditambahkan.', 
          'success'
        );
        setEditModalOpen(false);
        loadData();
      } else {
        setError(res.message || 'Gagal menyimpan data.');
      }
    } catch {
      setError('Terjadi kesalahan koneksi.');
    }
  };

  const handleDownloadTemplate = async () => {
    await generateExcelTemplate(USER_COLUMNS, 'Template_Pengguna_Mubtadiat.xlsx');
  };

  const handleExportData = async () => {
    await exportToExcel(users, USER_COLUMNS, 'Data_Pengguna_Mubtadiat.xlsx');
  };

  const handleImportData = async (file: File) => {
    try {
      setLoading(true);
      const data = await parseExcel(file);
      if (data.length === 0) throw new Error('Data kosong');
      
      let imported = 0;
      for (const row of data) {
        if (row.name && row.username) {
          await saveUser({
            name: row.name,
            username: row.username,
            role: Number(row.role) || 4,
          });
          imported++;
        }
      }
      showToast(`${imported} data pengguna berhasil diimport!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Gagal mengimport data', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Otorisasi & Pengurus
          </h1>
          <p className="text-slate-500 text-sm font-semibold mt-1">
            Manajemen akun dan hak akses.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="relative w-full md:w-80">
          <SoftInput
            placeholder="Cari pengguna..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end relative">
          <PremiumSelect
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-white border-slate-200 text-slate-700 text-sm h-10 px-3 pr-8 rounded-xl"
          >
            <option value="ALL">Semua Role</option>
            <option value={1}>Admin</option>
            <option value={2}>Mundzir</option>
            <option value={3}>Mufatish</option>
            <option value={4}>Mustahiq</option>
          </PremiumSelect>

          <DataExportImport 
            onDownloadTemplate={handleDownloadTemplate}
            onExportData={handleExportData}
            onImportData={handleImportData}
            isLoading={loading}
          />
          <PremiumButton  
            onClick={openAddModal}
            variant="primary"
            leftIcon={<Plus className="w-5 h-5" />}
          >
            Tambah Pengurus
          </PremiumButton>
        </div>
      </GlassCard>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-4">
          <GlassCard variant="neumorph" className="overflow-hidden border border-slate-200/50">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200">
              <h3 className="font-extrabold text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Daftar Tenaga Pendidik & Pengurus
              </h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-500 font-semibold text-[10px] uppercase">Memuat pengguna...</p>
              </div>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Pengguna</Th>
                    <Th>Peran Akses</Th>
                    <Th>Dibuat Pada</Th>
                    <Th className="text-right">Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.filter(u => {
                    if (filterRole !== 'ALL' && u.role !== filterRole) return false;
                    return u.name.toLowerCase().includes(search.toLowerCase()) || (u.username || '').toLowerCase().includes(search.toLowerCase());
                  }).map(user => (
                    <Tr key={user.id}>
                      <Td>
                        <div className="font-bold text-slate-800">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Username: <span className="font-bold text-slate-500">{user.username}</span>
                        </div>
                      </Td>
                      <Td>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          user.role === 1
                            ? 'bg-purple-100 text-purple-700' 
                            : user.role === 2 
                            ? 'bg-emerald-100 text-emerald-700'
                            : user.role === 3
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 1 ? 'Admin' : user.role === 2 ? 'Mundzir' : user.role === 3 ? 'Mufatish' : 'Mustahiq'}
                        </span>
                      </Td>
                      <Td>
                        <div className="text-[10px] font-semibold text-slate-500">{user.createdAt || '-'}</div>
                      </Td>
                      <Td>
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(user)}
                              title="Edit Pengurus"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleResetPassword(user)}
                              title="Reset Password ke Default"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors inline-flex items-center"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              title="Hapus Pengurus"
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Edit Access Rights Modal Dialog */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={selectedUser ? 'Atur Otorisasi Akun' : 'Tambah Pengurus Baru'}
        maxWidthClass="max-w-lg"
        onSubmit={handleSave}
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <PremiumButton
              type="submit"
              variant="primary"
              rightIcon={<Save className="w-4 h-4" />}
            >
              Simpan Pengurus
            </PremiumButton>
          </>
        }
      >
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-bold">
            {error}
          </div>
        )}

        {/* Optional Alumni Picker for New User */}
        {!selectedUser && alumniList.length > 0 && (
          <div className="border border-blue-100 bg-blue-50/20 p-3.5 rounded-2xl space-y-2">
            <label className="text-[10px] font-black text-blue-700 uppercase tracking-wide block">
              🎓 Ambil dari Data Alumni (Masa Khidmah / Mustahiqoh)
            </label>
            <PremiumSelect
              value={selectedAlumniId}
              onChange={(e) => handleSelectAlumni(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-hidden"
            >
              <option value="">-- Pilih Alumni (Opsional) --</option>
              {alumniList.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.noStambuk})</option>
              ))}
            </PremiumSelect>
            <p className="text-[9px] text-slate-400 font-medium">
              *Memilih alumni akan otomatis mengisi Nama Lengkap, Alamat, dan meng-generate Username.
            </p>
          </div>
        )}

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SoftInput
            label="Nama Lengkap"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="develzy"
            required
          />
          <SoftInput
            label="Username (Tanpa Spasi)"
            value={formUsername}
            onChange={(e) => setFormUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
            placeholder="muhammad"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Peran Sistem (Role)</label>
          <PremiumSelect
            value={formRole}
            onChange={(e: any) => setFormRole(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-hidden focus:border-blue-500 focus:bg-white neumorph-pressed"
          >
            <option value={4}>Mustahiq</option>
            <option value={3}>Mufatish</option>
            <option value={2}>Mundzir</option>
            <option value={1}>Admin</option>
          </PremiumSelect>
        </div>
      </Modal>
    </div>
  );
};
