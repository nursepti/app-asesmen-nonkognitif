import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server"; // ✅ CLERK: Wajib untuk cek user login
import { StatusValiditas } from "@prisma-client";   // ✅ PRISMA: Import Enum dari Schema Anda
import { getHasilSiswaPerId } from "@/lib/action"; 
import HasilPerSiswa from "@/components/HasilPerSiswa";

// Helper untuk format durasi (Detik -> Menit)
const formatDurasi = (detik: number) => {
  if (!detik) return "-";
  const m = Math.floor(detik / 60);
  return `${m} Menit`;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const HalamanDetailSiswa = async ({ params }: PageProps) => {
  // 1. CEK AUTENTIKASI (CLERK)
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  // TODO: (Opsional) Jika Anda ingin membatasi Guru A tidak boleh lihat Siswa Guru B,
  // Anda bisa cek role user di sini menggunakan prisma.user.findUnique...

  const { id } = await params; 

  // 2. AMBIL DATA DARI DATABASE (Via Action)
  const result = await getHasilSiswaPerId(id);

  // Jika siswa tidak ditemukan
  if (!result || !result.profil) {
    return notFound();
  }

  const { profil, asesmen } = result;

  // 3. OLAH DATA UNTUK UI
  const data = asesmen ? {
      foto: profil.foto || "/noAvatar.png",
      nama: asesmen.snapNamaSiswa,
      nisn: asesmen.snapNisn,
      kelas: asesmen.snapNamaKelas,
      status: asesmen.statusValiditas, // Tipe datanya adalah Enum StatusValiditas
      durasi: asesmen.durasiDetik || 0,
      
      // Agregat Nilai
      skor_kesadaran_diri: asesmen.skorKesadaranDiri,
      skor_manajemen_diri: asesmen.skorManajemenDiri,
      skor_kesadaran_sosial: asesmen.skorKesadaranSosial,
      skor_relasi: asesmen.skorRelasi,
      skor_keputusan: asesmen.skorKeputusan,
      
      kategori_akhir: asesmen.kategoriAkhir,
      total_skor: asesmen.totalSkor,
      detail_jawaban: asesmen.detailJawaban // JSONB
  } : null;

  // UI: JIKA BELUM MENGERJAKAN
  if (!data) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100 text-center max-w-md">
                <h2 className="text-xl font-bold text-gray-700">Belum Ada Data Asesmen</h2>
                <p className="text-gray-500 mt-2">Siswa <strong>{profil.namaSiswa}</strong> belum mengerjakan asesmen non-kognitif.</p>
                <Link href="/list/siswa" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Kembali ke Daftar Siswa
                </Link>
            </div>
        </div>
     );
  }

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4 bg-gray-50 min-h-screen">
      
      {/* --- KIRI: Profil & Statistik --- */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        
        {/* KARTU PROFIL */}
        <div className="bg-biruBiasa p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-blue-500/10 to-transparent"></div>

            <div className="flex gap-4 items-start relative z-10">
               <div className="relative w-20 h-20 min-w-[80px]">
                 <Image 
                   src={data.foto} 
                   alt={data.nama} 
                   fill 
                   className="rounded-full object-cover border-2 border-white shadow-sm"
                 />
               </div>
               
               <div className="flex flex-col gap-1 w-full">
                  <h1 className="text-xl font-semibold text-gray-800 line-clamp-1">{data.nama}</h1>
                  <span className="text-sm text-gray-500 font-mono tracking-wide">{data.nisn}</span>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>Kelas {data.kelas}</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
               <div className="flex-1 bg-white p-2 rounded-lg border border-gray-100 text-center shadow-sm">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Validitas</span>
                  {/* MENGGUNAKAN ENUM PRISMA */}
                  {data.status === StatusValiditas.valid ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        VALID
                      </span>
                  ) : (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        SUSPECT
                      </span>
                  )}
               </div>
               <div className="flex-1 bg-white p-2 rounded-lg border border-gray-100 text-center shadow-sm">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Waktu</span>
                  <span className="text-xs font-bold text-gray-700">{formatDurasi(data.durasi)}</span>
               </div>
            </div>
        </div>

        {/* KARTU STATISTIK */}
        <div className="bg-biruBiasa p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-700">Statistik Dimensi</h2>
              {/* Optional: Icon Info */}
              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold">i</div>
           </div>
           
           <div className="space-y-5">
               <ScoreBar label="Kesadaran Diri" score={data.skor_kesadaran_diri} max={48} color="bg-blue-500" />
               <ScoreBar label="Manajemen Diri" score={data.skor_manajemen_diri} max={24} color="bg-emerald-500" />
               <ScoreBar label="Kesadaran Sosial" score={data.skor_kesadaran_sosial} max={16} color="bg-purple-500" />
               <ScoreBar label="Relasi" score={data.skor_relasi} max={20} color="bg-pink-500" />
               <ScoreBar label="Keputusan" score={data.skor_keputusan} max={40} color="bg-orange-500" />
           </div>

           <div className="mt-8 pt-6 border-t border-gray-100 text-center">
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kategori Akhir</span>
               <h1 className={`text-2xl font-bold mt-2 ${
                   data.kategori_akhir === 'Ideal' ? 'text-green-600' : 
                   data.kategori_akhir === 'Tidak Ideal' ? 'text-red-500' : 
                   data.kategori_akhir === 'Kurang Ideal' ? 'text-yellow-600' : 'text-blue-600'
               }`}>
                   {data.kategori_akhir}
               </h1>
           </div>
        </div>
      </div>

      {/* --- KANAN: Detail Jawaban --- */}
      <div className="w-full xl:w-2/3">
         <HasilPerSiswa
            data={data.detail_jawaban} 
         />
      </div>

    </div>
  )
}

// Komponen ScoreBar
const ScoreBar = ({label, score, max, color}:{label:string, score:number, max: number, color:string}) => {
    const percentage = max > 0 ? (score / max) * 100 : 0;
    
    return (
       <div>
          <div className="flex justify-between mb-1">
             <span className="text-xs font-medium text-gray-600">{label}</span>
             <span className="text-xs font-bold text-gray-800">{score} <span className="text-gray-300 font-normal">/ {max}</span></span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
             <div className={`h-2 rounded-full transition-all duration-700 ease-out ${color}`} style={{width: `${percentage}%`}}></div>
          </div>
       </div>
    )
}

export default HalamanDetailSiswa;