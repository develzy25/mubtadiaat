import { CrudTable } from '../components/CrudTable';

export function SantriPage() {
  const dummyData = [
    { nama: 'Ahmad Faiz', nis: '12345', kelas: '3A', status: 'Aktif' },
    { nama: 'Budi Santoso', nis: '12346', kelas: '3A', status: 'Aktif' },
    { nama: 'Cahyo Guntur', nis: '12347', kelas: '3B', status: 'Aktif' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CrudTable 
        title="Data Santri"
        description="Kelola data induk santri dan status akademik mereka."
        columns={['Nama', 'NIS', 'Kelas', 'Status']}
        data={dummyData}
        onAdd={() => alert('Tambah data ditekan')}
        onEdit={(item) => alert(`Edit ${item.nama}`)}
        onDelete={(item) => alert(`Hapus ${item.nama}`)}
      />
    </div>
  );
}
