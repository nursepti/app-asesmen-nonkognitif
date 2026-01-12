import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import  prisma from "@/lib/prisma";
import type { Pertanyaan, Dimensi, Indikator } from "@prisma-client";
import { getQuizData } from "@/lib/action"; 
import KuesionerAsesmen from "@/components/KuesionerAsesmen";

export default async function HalamanPengerjaanAsesmen({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // DEBUG 1: Cek apakah halaman dipanggil
  console.log("--- START HALAMAN ASESMEN ---");

  // AWAIT PARAMS (Wajib Next.js 15)
  const resolvedParams = await params;
  const jadwalId = resolvedParams.id;
  console.log("ID Jadwal:", jadwalId);

  // CEK AUTH
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // AMBIL SISWA
  const siswaLocal = await prisma.siswa.findUnique({
    where: { username: user.username || "" },
    select: { id: true }
  });

  if (!siswaLocal) {
    console.log("Error: Siswa tidak ditemukan");
    return <div>Akses Ditolak: User Clerk tidak terdaftar di database siswa.</div>;
  }

  // AMBIL DATA KUIS
  console.log("Fetching Quiz Data...");
  const data = await getQuizData(jadwalId);

  // HANDLER JIKA DATA NULL
  if (!data) {
    console.log("Error: Data Kuis NULL (Jadwal tidak ditemukan)");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
         <h1 className="text-2xl font-bold text-gray-800">Data Tidak Ditemukan</h1>
         <p className="text-gray-600 mt-2">Jadwal ID: {jadwalId} tidak valid.</p>
         <Link href="/siswa" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg">Kembali</Link>
      </div>
    );
  }

  const { jadwal, questions } = data;
  console.log("Jumlah Soal:", questions.length);

  return (
    <div className="p-4 md:p-6 min-h-screen flex flex-col gap-6 bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center sticky top-0 z-10">
        <div>
           <h1 className="text-lg font-bold text-gray-800 line-clamp-1">{jadwal.namaSesi}</h1>
           <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Sedang Mengerjakan</span>
              <span>• {questions.length} Soal</span>
           </div>
        </div>
        <Link href="/siswa" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg transition">
           Batal
        </Link>
      </div>

      {/* Komponen UI */}
      <div className="w-full max-w-3xl mx-auto pb-10">
         <KuesionerAsesmen 
            questions={questions} 
            jadwalId={jadwal.id}
            siswaId={siswaLocal.id} 
         />
      </div>
    </div>
  );
}