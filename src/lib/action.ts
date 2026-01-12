"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitAssessment(
  jadwalId: string, 
  siswaId: string, 
  answers: { [key: number]: number },
  waktuMulaiClient: Date // Parameter Baru
) {
  try {
    // A. HITUNG WAKTU & VALIDITAS
    const waktuSelesai = new Date();
    const waktuMulai = new Date(waktuMulaiClient);
    // Selisih waktu dalam detik
    const durasiDetik = Math.floor((waktuSelesai.getTime() - waktuMulai.getTime()) / 1000);
    // Jika < 60 detik (1 menit), anggap suspect
    const statusValiditas = durasiDetik < 60 ? "suspect" : "valid";

    // B. AMBIL DATA SNAPSHOT
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaId },
      include: { kelas: true }
    });
    if (!siswa) return { success: false, error: "Siswa tidak ditemukan" };

    // Cek Duplikasi
    const exist = await prisma.asesmenSiswa.findFirst({ where: { jadwalId, siswaId } });
    if (exist) return { success: false, error: "Sudah dikerjakan" };

    // C. AMBIL SOAL & HITUNG AGREGAT
    const questionIds = Object.keys(answers).map(Number);
    const dbQuestions = await prisma.pertanyaan.findMany({
        where: { id: { in: questionIds } },
        include: { dimensi: true }
    });

    let totalSkor = 0;
    // Variabel Penampung per Dimensi
    let d1=0, d2=0, d3=0, d4=0, d5=0; 
    const detailJawaban = [];

    for (const q of dbQuestions) {
        const val = answers[q.id] || 0;
        totalSkor += val;
        
        // Simpan Detail JSON
        detailJawaban.push({ 
           id: q.id, t: q.teksPertanyaan, j: val, d: q.dimensi.namaDimensi 
        });

        // Pilah Skor ke Dimensi masing-masing
        const k = q.dimensi.kodeDimensi;
        if (k === 'D01') d1 += val;
        else if (k === 'D02') d2 += val;
        else if (k === 'D03') d3 += val;
        else if (k === 'D04') d4 += val;
        else if (k === 'D05') d5 += val;
    }

    // D. HITUNG KATEGORI (NORMALISASI MIN-MAX)
    const jumlahSoal = dbQuestions.length;
    const min = jumlahSoal * 1; 
    const max = jumlahSoal * 4;
    const range = max - min;
    
    let persen = 0;
    if (range > 0) persen = ((totalSkor - min) / range) * 100;

    let kategori = "Ideal";
    if (persen <= 25) kategori = "Tidak Ideal";
    else if (persen <= 50) kategori = "Kurang Ideal";
    else if (persen <= 75) kategori = "Cukup Ideal";

    // E. SIMPAN KE DATABASE
    await prisma.asesmenSiswa.create({
        data: {
            jadwalId, siswaId,
            waktuMulai, waktuSelesai, durasiDetik,
            statusValiditas: statusValiditas as any, // Cast jika perlu
            
            snapNamaSiswa: siswa.namaSiswa,
            snapNamaKelas: siswa.kelas?.namaKelas || "-",
            snapNisn: siswa.nisn,

            totalSkor, kategoriAkhir: kategori,
            skorKesadaranDiri: d1,
            skorManajemenDiri: d2,
            skorKesadaranSosial: d3,
            skorRelasi: d4,
            skorKeputusan: d5,
            
            detailJawaban: detailJawaban
        }
    });

    revalidatePath('/siswa');
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Server Error" };
  }
}