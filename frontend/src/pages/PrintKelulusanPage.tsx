import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { kelulusanService } from '../services/kelulusan.service';
import * as masterService from '../services/master.service';

export function PrintKelulusanPage() {
  const { type } = useParams<{ type: string }>(); // 'sertifikat' | 'ijazah'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [printData, setPrintData] = useState<any[]>([]);
  const [kelasName, setKelasName] = useState('');

  useEffect(() => {
    const loadPrintData = async () => {
      // Parse parameters from HashRouter hash
      const hashParts = window.location.hash.split('?');
      const queryStr = hashParts.length > 1 ? hashParts[1] : window.location.search;
      const searchParams = new URLSearchParams(queryStr);
      
      const santriId = searchParams.get('santriId');
      const kelasId = searchParams.get('kelasId');
      const year = searchParams.get('year') || '2026-2027';

      if (!kelasId) {
        setError('Parameter kelasId diperlukan untuk mencetak.');
        setLoading(false);
        return;
      }

      try {
        // Fetch class info
        const classRes = await masterService.fetchKelas();
        if (classRes?.success) {
          const currentClass = classRes.data.find((c: any) => c.id === kelasId);
          if (currentClass) {
            setKelasName(`Kelas ${currentClass.bagian} (${currentClass.lokal || 'Utama'})`);
          }
        }

        // Fetch students graduation list
        let students: any[] = [];
        if (type === 'sertifikat') {
          students = await kelulusanService.getSertifikat(kelasId, year);
        } else {
          students = await kelulusanService.getIjazah(kelasId, year);
        }

        // Filter for specific student if santriId is provided
        if (santriId) {
          students = students.filter(s => s.id === santriId);
        }

        if (students.length === 0) {
          setError('Tidak ada data kelulusan yang ditemukan.');
          setLoading(false);
          return;
        }

        // Fetch transcripts for each student
        const enrichedStudents = await Promise.all(
          students.map(async (student) => {
            try {
              const transcriptRes = await masterService.fetchRekap(student.id, year);
              return {
                ...student,
                transcript: transcriptRes?.success ? transcriptRes.data : null
              };
            } catch (err) {
              console.error(`Failed to fetch transcript for student ${student.id}:`, err);
              return { ...student, transcript: null };
            }
          })
        );

        setPrintData(enrichedStudents);
        
        // Trigger print dialog
        setTimeout(() => {
          window.print();
        }, 800);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal memuat data dokumen cetak.');
      } finally {
        setLoading(false);
      }
    };

    loadPrintData();
  }, [type]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-sky-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Menyiapkan dokumen cetak asli...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl border border-red-200 text-center max-w-md">
          <h2 className="font-extrabold text-lg mb-2">Gagal Mencetak</h2>
          <p className="text-sm font-semibold">{error}</p>
          <button 
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-white rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      
      {/* Floating Action Menu - Hidden during print */}
      <div className="fixed top-6 right-6 flex gap-3 print:hidden z-50">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 rounded-xl shadow-md text-white font-bold hover:bg-sky-700 transition-all text-sm"
        >
          <Printer className="w-4 h-4" />
          Cetak Sekarang
        </button>
      </div>

      <style>{`
        @media print {
          .page-break {
            break-after: page;
            page-break-after: always;
          }
          body {
            background: white !important;
          }
        }
      `}</style>

      {/* Printable Documents Loop */}
      {printData.map((student, index) => {
        const isLast = index === printData.length - 1;
        
        return (
          <div key={student.id} className={!isLast ? 'page-break' : ''}>
            {/* A4 Paper Container */}
            <div className="mx-auto bg-white shadow-xl print:shadow-none relative overflow-hidden my-4 print:my-0" 
                 style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
              
              {/* Background Decorative Pattern */}
              <div className="absolute inset-0 border-10 border-double border-slate-900/10 m-4 pointer-events-none print:border-black/20" />
              <div className="absolute inset-0 border border-slate-900/10 m-5 pointer-events-none print:border-black/20" />

              <div className="relative z-10 flex flex-col h-full text-center">
                {/* Header */}
                <div className="flex items-center justify-center gap-5 mb-8 border-b-2 border-black pb-5">
                  <img src="./logo.png" alt="Logo" className="w-20 h-20 object-contain" />
                  <div className="text-left">
                    <h1 className="text-xl font-black uppercase tracking-widest text-slate-900 print:text-black leading-tight">Madrasah Diniyah Putri</h1>
                    <h2 className="text-3xl font-black uppercase tracking-widest text-slate-900 mt-0.5 print:text-black">Mubtadi'aat</h2>
                    <p className="text-xs font-bold text-slate-500 mt-1 print:text-black">Pondok Pesantren Lirboyo HM Al-Mahrusiyah Asrama Putri Unit Al-Fatihah</p>
                  </div>
                </div>

                {/* Title */}
                <div className="my-6">
                  <h3 className="text-2xl font-black uppercase tracking-[0.15em] text-slate-950 print:text-black underline decoration-2 underline-offset-8">
                    {type === 'sertifikat' ? "Sertifikat Kelulusan" : "Ijazah Kelulusan"}
                  </h3>
                  <p className="text-sm font-bold text-slate-500 mt-4 tracking-widest print:text-black">
                    Nomor: {student.kelulusanId ? `0${student.kelulusanId.substring(4, 7)}` : '023'}/MDP-M/{new Date().getFullYear()}
                  </p>
                </div>

                {/* Body Text */}
                <div className="text-base leading-relaxed text-center px-8 mb-6 text-slate-800 font-medium print:text-black">
                  Kepala Madrasah Diniyah Putri Mubtadi'aat Pondok Pesantren Lirboyo menerangkan bahwa:
                </div>

                {/* Student Info */}
                <div className="mx-auto w-4/5 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 print:bg-transparent print:border-none">
                  <table className="w-full text-left text-sm font-bold text-slate-900 print:text-black">
                    <tbody>
                      <tr>
                        <td className="py-2.5 w-1/3 text-slate-500 print:text-black font-semibold">Nama Lengkap</td>
                        <td className="py-2.5 w-4">:</td>
                        <td className="py-2.5 uppercase tracking-wide">{student.name}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 text-slate-500 print:text-black font-semibold">No. Induk Santri (NIS)</td>
                        <td className="py-2.5">:</td>
                        <td className="py-2.5">{student.noStambuk || '-'}</td>
                      </tr>
                      {type === 'ijazah' && (
                        <tr>
                          <td className="py-2.5 text-slate-500 print:text-black font-semibold">Tempat, Tanggal Lahir</td>
                          <td className="py-2.5">:</td>
                          <td className="py-2.5">{student.tempatLahir || '-'}, {student.tanggalLahir || '-'}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2.5 text-slate-500 print:text-black font-semibold">Jenjang Kelulusan</td>
                        <td className="py-2.5">:</td>
                        <td className="py-2.5">{kelasName || (type === 'sertifikat' ? "I'dadiyah" : "Ibtidaiyyah")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-base leading-relaxed text-center px-8 mb-10 text-slate-800 font-bold print:text-black">
                  Telah memenuhi seluruh kriteria akademik dan administrasi akhir dan dinyatakan: <br/>
                  <span className="text-3xl font-black mt-3 inline-block text-emerald-600 print:text-black tracking-widest bg-emerald-50 print:bg-transparent px-6 py-1.5 rounded-xl border border-emerald-100/50 print:border-none">LULUS</span>
                  <br/>
                  {type === 'sertifikat' ? (
                    <span className="text-xs font-semibold text-slate-500 mt-4 inline-block print:text-black">Dan berhak untuk melanjutkan studi ke Tingkat/Jenjang yang lebih tinggi</span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 mt-4 inline-block print:text-black">beserta lembar transkrip nilai akademik resmi yang dilampirkan dibalik halaman ini.</span>
                  )}
                </div>

                {/* Signatures */}
                <div className="mt-auto flex justify-between px-10 pt-8 text-sm">
                  <div className="text-center">
                    <p className="mb-20 text-slate-600 font-semibold print:text-black">Wali Kelas,</p>
                    <p className="font-bold underline text-slate-900 print:text-black">Ustadzah Wali Kelas</p>
                  </div>
                  <div className="text-center">
                    <p className="mb-20 text-slate-600 font-semibold print:text-black">Kediri, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>Kepala Madrasah,</p>
                    <p className="font-bold underline text-slate-900 print:text-black">K.H. Ahmad Mahrus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Break for Transkrip (Only for Ijazah) */}
            {type === 'ijazah' && (
              <div className="mx-auto bg-white shadow-xl print:shadow-none relative overflow-hidden mt-8 print:mt-0 print:break-before-page" 
                   style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
                
                <div className="absolute inset-0 border border-slate-900/10 m-5 pointer-events-none print:border-black/20" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-xl font-black uppercase tracking-widest text-center text-slate-950 mb-6 print:text-black">Transkrip Nilai Akademik Resmi</h3>
                  
                  <div className="mb-6 text-sm font-bold text-slate-800 print:text-black">
                    <p>Nama Santri: <span className="uppercase">{student.name}</span></p>
                    <p className="mt-1">Nomor Induk: {student.noStambuk || '-'}</p>
                  </div>

                  <table className="w-full text-slate-900 border-collapse border border-slate-300 text-sm print:text-black print:border-black">
                    <thead>
                      <tr className="bg-slate-50 print:bg-transparent font-bold">
                        <th className="border border-slate-300 print:border-black py-2.5 px-4 w-12 text-center">No</th>
                        <th className="border border-slate-300 print:border-black py-2.5 px-4 text-left">Nama Kitab / Pelajaran</th>
                        <th className="border border-slate-300 print:border-black py-2.5 px-4 w-24 text-center">Nilai Semester I</th>
                        <th className="border border-slate-300 print:border-black py-2.5 px-4 w-24 text-center">Nilai Semester II</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.transcript && student.transcript.detailMapel && student.transcript.detailMapel.length > 0 ? (
                        student.transcript.detailMapel.map((mapel: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                            <td className="border border-slate-300 print:border-black py-2 px-4 text-center">{i + 1}</td>
                            <td className="border border-slate-300 print:border-black py-2 px-4 font-semibold">{mapel.kitabName}</td>
                            <td className="border border-slate-300 print:border-black py-2 px-4 text-center font-bold">{mapel.s1Khos || '-'}</td>
                            <td className="border border-slate-300 print:border-black py-2 px-4 text-center font-bold">{mapel.s2Khos || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="border border-slate-300 print:border-black py-4 px-4 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                            Nilai rapot belum di-input
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  <div className="mt-8 flex justify-end">
                     <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-100 print:bg-transparent print:border-none">
                      <table className="w-full text-slate-900 print:text-black text-sm">
                        <tbody>
                          <tr className="border-b border-slate-200/50 pb-2">
                            <td className="py-1.5 font-semibold text-slate-500 print:text-black">Rata-rata Akhir</td>
                            <td className="py-1.5 w-4">:</td>
                            <td className="py-1.5 font-black text-lg text-slate-900 print:text-black">{student.rataRataAkhir || '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-semibold text-slate-500 print:text-black">Ujian Praktek</td>
                            <td className="py-1.5">:</td>
                            <td className="py-1.5 font-black text-sm text-slate-900 print:text-black">
                              {student.lulusPraktik ? 'LULUS (MEMENUHI)' : 'TIDAK LULUS'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                     </div>
                  </div>
                  
                  <div className="mt-auto flex justify-end px-6 pt-16 text-sm">
                    <div className="text-center">
                      <p className="mb-20 text-slate-600 font-semibold print:text-black">Kepala Madrasah Diniyah,</p>
                      <p className="font-bold underline text-slate-900 print:text-black">K.H. Ahmad Mahrus</p>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
