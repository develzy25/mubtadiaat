import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Printer, ArrowLeft } from 'lucide-react';

export function PrintKelulusanPage() {
  const { type } = useParams<{ type: string }>(); // 'sertifikat' | 'ijazah'
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setReady(true);
      // Auto print after a small delay to ensure images/fonts are loaded
      setTimeout(() => window.print(), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-bold">Menyiapkan dokumen cetak...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 py-8 print:bg-white print:py-0">
      
      {/* Floating Action Menu - Hidden during print */}
      <div className="fixed top-6 right-6 flex gap-3 print:hidden z-50">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl shadow-[0_4px_10px_rgba(79,70,229,0.3)] text-white font-bold hover:bg-indigo-700 transition-all"
        >
          <Printer className="w-4 h-4" />
          Cetak Sekarang
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="mx-auto bg-white shadow-2xl print:shadow-none relative overflow-hidden" 
           style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
        
        {/* Background Decorative Pattern (Optional) */}
        <div className="absolute inset-0 border-15 border-double border-indigo-900/10 m-4 pointer-events-none print:border-black/20" />
        <div className="absolute inset-0 border border-indigo-900/10 m-5 pointer-events-none print:border-black/20" />

        <div className="relative z-10 flex flex-col h-full text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-6 mb-8 border-b-2 border-black pb-6">
            <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain filter grayscale print:grayscale-0" />
            <div>
              <h1 className="text-2xl font-black uppercase tracking-widest text-slate-900 print:text-black">Madrasah Diniyah Putri</h1>
              <h2 className="text-4xl font-black uppercase tracking-widest text-slate-900 mt-1 print:text-black">Mubtadi'aat</h2>
              <p className="text-sm font-bold text-slate-600 mt-2 print:text-black">Pondok Pesantren Lirboyo HM Al-Mahrusiyah Asrama Putri Unit Al-Fatihah</p>
            </div>
          </div>

          {/* Title */}
          <div className="my-8">
            <h3 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900 print:text-black underline decoration-4 underline-offset-8">
              {type === 'sertifikat' ? "Sertifikat Kelulusan" : "Ijazah & Transkrip"}
            </h3>
            <p className="text-lg font-bold text-slate-600 mt-6 tracking-widest print:text-black">Nomor: 123/MDP-M/2026</p>
          </div>

          {/* Body Text */}
          <div className="text-lg leading-relaxed text-justify px-8 mb-8 text-slate-800 font-medium print:text-black">
            Dengan ini Kepala Madrasah Diniyah Putri Mubtadi'aat menerangkan bahwa:
          </div>

          {/* Student Info */}
          <div className="mx-auto w-3/4 mb-12">
            <table className="w-full text-left text-lg font-bold text-slate-900 print:text-black">
              <tbody>
                <tr>
                  <td className="py-2 w-1/3">Nama Lengkap</td>
                  <td className="py-2 w-4">:</td>
                  <td className="py-2">SITI AMINAH</td>
                </tr>
                <tr>
                  <td className="py-2">Nomor Induk Santri</td>
                  <td className="py-2">:</td>
                  <td className="py-2">12345678</td>
                </tr>
                <tr>
                  <td className="py-2">Tempat, Tgl Lahir</td>
                  <td className="py-2">:</td>
                  <td className="py-2">Kediri, 12 Agustus 2005</td>
                </tr>
                <tr>
                  <td className="py-2">Tingkat Akhir</td>
                  <td className="py-2">:</td>
                  <td className="py-2">{type === 'sertifikat' ? "I'dadiyah Kelas III" : "Ibtidaiyyah Kelas VI"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-lg leading-relaxed text-center px-8 mb-16 text-slate-800 font-bold print:text-black">
            Telah memenuhi syarat kelulusan dan dinyatakan <br/>
            <span className="text-3xl font-black mt-4 inline-block">LULUS</span>
            <br/>
            {type === 'sertifikat' ? (
              <span className="text-base font-medium mt-4 inline-block">Dan berhak melanjutkan ke Kelas I Tsanawiyah</span>
            ) : (
              <span className="text-base font-medium mt-4 inline-block">beserta transkrip nilai akademik terlampir.</span>
            )}
          </div>

          {/* Signatures */}
          <div className="mt-auto flex justify-between px-12 pt-12">
            <div className="text-center">
              <p className="mb-20 text-slate-800 font-bold print:text-black">Wali Kelas,</p>
              <p className="font-bold underline text-slate-900 print:text-black">Ustadzah Fulanah</p>
            </div>
            <div className="text-center">
              <p className="mb-20 text-slate-800 font-bold print:text-black">Kediri, 08 Juli 2026<br/>Kepala Madrasah,</p>
              <p className="font-bold underline text-slate-900 print:text-black">K.H. Ahmad Mahrus</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Page Break for Transkrip (Only for Ijazah) */}
      {type === 'ijazah' && (
        <div className="mx-auto bg-white shadow-2xl print:shadow-none relative overflow-hidden mt-8 print:mt-0 print:break-before-page" 
             style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
          
          <div className="absolute inset-0 border border-indigo-900/10 m-5 pointer-events-none print:border-black/20" />
          
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-2xl font-black uppercase tracking-widest text-center text-slate-900 mb-8 print:text-black">Transkrip Nilai Akademik</h3>
            
            <table className="w-full text-slate-900 border-collapse border border-slate-300 print:text-black print:border-black">
              <thead>
                <tr className="bg-slate-100 print:bg-transparent">
                  <th className="border border-slate-300 print:border-black py-3 px-4 w-16 text-center">No</th>
                  <th className="border border-slate-300 print:border-black py-3 px-4">Mata Pelajaran</th>
                  <th className="border border-slate-300 print:border-black py-3 px-4 w-24 text-center">Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 print:border-black py-2 px-4 text-center">1</td>
                  <td className="border border-slate-300 print:border-black py-2 px-4">Al-Qur'an Hadits</td>
                  <td className="border border-slate-300 print:border-black py-2 px-4 text-center font-bold">8</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 print:border-black py-2 px-4 text-center">2</td>
                  <td className="border border-slate-300 print:border-black py-2 px-4">Aqidah Akhlaq</td>
                  <td className="border border-slate-300 print:border-black py-2 px-4 text-center font-bold">7</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 print:border-black py-2 px-4 text-center">3</td>
                  <td className="border border-slate-300 print:border-black py-2 px-4">Fikih</td>
                  <td className="border border-slate-300 print:border-black py-2 px-4 text-center font-bold">8</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-8 flex justify-end">
               <div className="w-64">
                <table className="w-full text-slate-900 print:text-black">
                  <tbody>
                    <tr>
                      <td className="py-1 font-bold">Rata-rata</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-black text-xl">7.6</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-bold">Nilai Akhlaq</td>
                      <td className="py-1">:</td>
                      <td className="py-1 font-black text-xl">8</td>
                    </tr>
                  </tbody>
                </table>
               </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
