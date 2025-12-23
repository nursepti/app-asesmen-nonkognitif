// src/app/(dashboard)/list/siswa/[id]/page.tsx

import Image from "next/image";
import { getStudentAssessmentData } from "@/lib/data"; 
import LembarKerjaSiswa from "@/components/LembarKerjaSiswa";
import { notFound } from "next/navigation";

// 1. Definisikan tipe Props untuk Next.js 15 (params adalah Promise)
interface PageProps {
  params: Promise<{ id: string }>;
}

// 2. Tambahkan 'async' pada fungsi komponen
const HalamanDetailSiswa = async ({ params }: PageProps) => {
  
  // 3. WAJIB: Await params sebelum mengakses propertinya
  const { id } = await params; 

  // 4. Konversi ke number
  const idSiswa = parseInt(id);

  // DEBUGGING: Cek di terminal (bukan browser console) apakah ID masuk
  console.log("ID dari URL:", id); 
  console.log("ID setelah parse:", idSiswa);

  // 5. Ambil data
  const data = getStudentAssessmentData(idSiswa);

  // DEBUGGING: Cek apakah data ditemukan
  console.log("Data ditemukan?", data ? "YA" : "TIDAK");

  if (!data) {
    return notFound();
  }

  return (
    <div className="p-4 flex flex-col xl:flex-row gap-4 bg-gray-50 min-h-screen">
      
      {/* --- KIRI: Profil --- */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-biruBiasa p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex gap-4 items-start">
               <div className="relative w-20 h-20 min-w-[80px]">
                 <Image 
                   src={data.foto_profil_snap} 
                   alt={data.snap_nama_siswa} 
                   fill 
                   className="rounded-full object-cover border border-gray-100"
                 />
               </div>
               
               <div className="flex flex-col gap-1 w-full">
                  <h1 className="text-xl font-semibold text-gray-800">{data.snap_nama_siswa}</h1>
                  <span className="text-sm text-gray-500">{data.snap_nisn}</span>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>📧 {data.snap_nama_siswa.toLowerCase().replace(/ /g,"")}@sekolah.sch.id</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
               <div className="flex-1 bg-slate-50 p-2 rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">STATUS</span>
                  {data.status_validitas === 'valid' ? (
                     <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">VALID</span>
                  ) : (
                     <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">SUSPECT</span>
                  )}
               </div>
               <div className="flex-1 bg-slate-50 p-2 rounded-md text-center">
                  <span className="text-[10px] text-gray-400 font-bold block mb-1">DURASI</span>
                  <span className="text-xs font-bold text-gray-700">25 Menit</span>
               </div>
            </div>
        </div>

        {/* Agregat Nilai */}
        <div className="bg-biruBiasa p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Statistik</h2>
              <Image src="/more.png" alt="" width={16} height={16} className="cursor-pointer opacity-60"/>
           </div>
           <div className="space-y-4">
               <ScoreBar label="Kesadaran Diri" score={data.skor_kesadaran_diri} color="bg-blue-400" />
               <ScoreBar label="Manajemen Diri" score={data.skor_manajemen_diri} color="bg-emerald-400" />
               <ScoreBar label="Kesadaran Sosial" score={data.skor_kesadaran_sosial} color="bg-purple-400" />
               <ScoreBar label="Relasi" score={data.skor_relasi} color="bg-pink-400" />
               <ScoreBar label="Keputusan" score={data.skor_keputusan} color="bg-orange-400" />
           </div>
           <div className="mt-8 pt-4 border-t border-gray-100 text-center">
               <span className="text-xs text-gray-400">Predikat</span>
               <h1 className="text-2xl font-bold text-green-800 mt-1">{data.kategori_akhir}</h1>
           </div>
        </div>
      </div>

      {/* --- KANAN: Detail Jawaban --- */}
      <div className="w-full xl:w-2/3">
         <LembarKerjaSiswa
            data={data.detail_jawaban} 
            totalSkor={data.total_skor}
         />
      </div>

    </div>
  )
}

const ScoreBar = ({label, score, color}:{label:string, score:number, color:string}) => (
   <div>
      <div className="flex justify-between mb-1">
         <span className="text-xs font-medium text-gray-600">{label}</span>
         <span className="text-xs font-bold text-gray-800">{score}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
         <div className={`h-2 rounded-full ${color}`} style={{width: `${(score/30)*100}%`}}></div>
      </div>
   </div>
)

export default HalamanDetailSiswa;