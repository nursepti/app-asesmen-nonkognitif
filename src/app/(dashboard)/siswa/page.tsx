import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server"; 
import { getStudentDashboardData } from "@/lib/action"; // Import action baru
import EventKalendar from "@/components/EventKalendar"; 
import StatistikSiswa from "@/components/StatistikSiswa";

// --- KOMPONEN KECIL: KARTU ASESMEN (Diupdate dikit logic-nya) ---
const AssessmentCard = ({ jadwal, status, isDone }: { jadwal: any; status: string, isDone?: boolean }) => {
  // Tersedia jika status aktif DAN BELUM dikerjakan
  const isAvailable = status === "aktif" && !isDone; 
  
  return (
    <div className={`group relative p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-4 
      ${isAvailable 
        ? 'bg-white border-blue-100 hover:shadow-lg hover:border-blue-200' 
        : 'bg-gray-50 border-gray-200 opacity-90'
      }`}
    >
      {/* Header Kartu */}
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl transition-colors ${isAvailable ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 'bg-gray-200 text-gray-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        </div>
        {isDone ? (
           <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
             Selesai Dikerjakan
           </span>
        ) : isAvailable ? (
           <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
             Tersedia
           </span>
        ) : (
           <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
             Ditutup
           </span>
        )}
      </div>

      {/* Konten Kartu */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {jadwal.namaSesi || jadwal.nama_sesi}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
           {/* Format Tanggal Indonesia */}
           <span>{new Date(jadwal.tglPelaksanaan).toLocaleDateString("id-ID", { dateStyle: 'long' })}</span>
        </div>
      </div>

      {/* Footer / Action Button */}
      <div className="mt-auto pt-2">
        {isAvailable ? (
            <Link 
                href={`/siswa/${jadwal.id}`} 
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200 active:scale-[0.98]"
            >
                <span>Mulai Kerjakan</span>
            </Link>
        ) : isDone ? (
            <button disabled className="w-full py-3 bg-blue-50 text-blue-400 font-semibold rounded-xl cursor-not-allowed border border-blue-100">
                Sudah Disubmit
            </button>
        ) : (
            <button disabled className="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed border border-gray-200">
                Tidak Tersedia
            </button>
        )}
      </div>
    </div>
  )
}

// --- HALAMAN UTAMA (Server Component) ---
const SiswaPage = async () => {
  // 1. CEK AUTH
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // 2. AMBIL DATA REAL DARI DATABASE
  const data = await getStudentDashboardData(user.username || "");

  if (!data) {
    return <div className="p-10 text-center text-red-500">Data siswa belum terdaftar. Hubungi Admin.</div>;
  }

  const { siswa, jadwalAktif, statusPengerjaanAktif, statistikTerbaru } = data;
  const kelas = siswa.kelas;

  // 3. FORMAT DATA STATISTIK UNTUK GRAFIK
  // Jika belum pernah ujian, pakai nilai 0
  const defaultStats = {
      skor: 0,
      kategori: "Belum ada data",
      dimensi: [
          { label: "Kesadaran Diri", nilai: 0, maxNilai: 48 },
          { label: "Manajemen Diri", nilai: 0, maxNilai: 24 },
          { label: "Kesadaran Sosial", nilai: 0, maxNilai: 16 },
          { label: "Relasi", nilai: 0, maxNilai: 20 },
          { label: "Keputusan", nilai: 0, maxNilai: 40 },
      ]
  };
  const statsData = statistikTerbaru ? {
      skor: statistikTerbaru.totalSkor,
      kategori: statistikTerbaru.kategoriAkhir || "-",
      dimensi: [
          { label: "Kesadaran Diri", nilai: statistikTerbaru.skorKesadaranDiri, maxNilai: 48 }, // Sesuaikan maxNilai dgn jumlah soal per dimensi
          { label: "Manajemen Diri", nilai: statistikTerbaru.skorManajemenDiri, maxNilai: 24 },
          { label: "Kesadaran Sosial", nilai: statistikTerbaru.skorKesadaranSosial, maxNilai: 16 },
          { label: "Relasi", nilai: statistikTerbaru.skorRelasi, maxNilai: 20 },
          { label: "Keputusan", nilai: statistikTerbaru.skorKeputusan, maxNilai: 40 },
      ]
  } : defaultStats;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* HERO BANNER */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden shadow-lg">
             <div className="relative z-10 flex flex-col gap-3">
                 <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Halo, {siswa.namaSiswa.split(" ")[0]}! 👋
                 </h1>
                 <p className="text-blue-100 max-w-lg text-sm md:text-base leading-relaxed opacity-90">
                     Selamat datang kembali.
                 </p>
             </div>
          </div>

          {/* DAFTAR ASESMEN */}
          <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-gray-800">Asesmen Aktif</h2>
              
              <div className="grid grid-cols-1 gap-4">
                  {/* Kartu Asesmen Aktif */}
                  {jadwalAktif ? (
                      <AssessmentCard 
                        jadwal={jadwalAktif} 
                        status="aktif" 
                        isDone={statusPengerjaanAktif} // Kirim status sudah/belum
                      />
                  ) : (
                      <div className="col-span-full p-8 bg-white rounded-2xl text-center border border-dashed border-gray-300 text-gray-400">
                          Tidak ada jadwal asesmen aktif untuk kelas Anda saat ini.
                      </div>
                  )}
              </div>
          </div>

          {/* KOMPONEN STATISTIK (Real Data) */}
          {statistikTerbaru && (
            <StatistikSiswa 
                skorTotal={statsData.skor}
                kategori={statsData.kategori}
                dataDimensi={statsData.dimensi}
            />
          )}

        </div>

        {/* KOLOM KANAN (SIDEBAR) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-cyan-400 relative"></div>
              
              <div className="px-6 pb-6 text-center relative">
                  <div className="relative -mt-12 mb-3 inline-block">
                       <div className="relative w-24 h-24 p-1 bg-white rounded-full shadow-md">
                           {/* Fallback jika foto kosong */}
                           <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                                {siswa.foto ? (
                                    <Image src={siswa.foto} alt="profile" fill className="object-cover" />
                                ) : (
                                    <span className="text-2xl">👤</span>
                                )}
                           </div>
                       </div>
                  </div>
                  
                  <h2 className="font-bold text-gray-800 text-xl">{siswa.namaSiswa}</h2>
                  <p className="text-gray-400 text-sm mb-4 font-mono">{siswa.nisn}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                          Kelas {kelas?.namaKelas}
                      </span>
                  </div>
                  
                  <div className="w-full border-t border-gray-100 pt-4 space-y-3 text-left">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Wali Kelas</span>
                          <span className="font-semibold text-gray-800 text-xs md:text-sm">
                            {kelas?.waliKelas?.namaGuru || "-"}
                          </span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="sticky top-6">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <EventKalendar />
             </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default SiswaPage;