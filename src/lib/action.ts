"use server";

import  prisma  from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * 1. MENGAMBIL DATA UNTUK HALAMAN PENGERJAAN KUIS
 * Digunakan di: src/app/(dashboard)/siswa/asesmen/[id]/page.tsx
 */
export async function getQuizData(jadwalId: string) {
  try {
    const jadwal = await prisma.jadwal.findUnique({
      where: { id: jadwalId },
    });

    if (!jadwal) return null;

    // Ambil semua pertanyaan beserta Dimensi & Indikatornya
    const questions = await prisma.pertanyaan.findMany({
      include: {
        dimensi: true,
        indikator: true,
      },
      orderBy: {
        urutan: "asc", // Atau 'id' jika tidak ada kolom urutan
      },
    });

    return { jadwal, questions };
  } catch (error) {
    console.error("Error getQuizData:", error);
    return null;
  }
}

/**
 * 2. MENGAMBIL DATA UNTUK DASHBOARD SISWA
 * Digunakan di: src/app/(dashboard)/siswa/page.tsx
 */
export async function getStudentDashboardData(username: string) {
  try {
    if (!username) return null;

    // A. Cari Siswa & Info Kelas
    const siswa = await prisma.siswa.findUnique({
      where: { username },
      include: {
        kelas: {
          include: {
            waliKelas: true,
          },
        },
      },
    });

    if (!siswa) return null;

    // B. Cari Jadwal Aktif (Asumsi mengambil yang terbaru)
    const jadwalAktif = await prisma.jadwal.findFirst({
      where: {
        kelasId: siswa.kelasId,
        status: "aktif", 
      },
      orderBy: { tglPelaksanaan: "desc" },
    });

    // C. Cek Status Pengerjaan (Apakah siswa sudah mengerjakan jadwal aktif?)
    let statusPengerjaanAktif = false;
    if (jadwalAktif) {
      const cek = await prisma.asesmenSiswa.findFirst({
        where: {
          jadwalId: jadwalAktif.id,
          siswaId: siswa.id,
        },
      });
      statusPengerjaanAktif = !!cek;
    }

    // D. Ambil Statistik Terakhir (Untuk ditampilkan di Card Statistik)
    const statistikTerbaru = await prisma.asesmenSiswa.findFirst({
      where: { siswaId: siswa.id },
      orderBy: { waktuSelesai: "desc" }, // Ambil yang paling baru
    });

    return {
      siswa,
      jadwalAktif,
      statusPengerjaanAktif,
      statistikTerbaru,
    };
  } catch (error) {
    console.error("Error getStudentDashboardData:", error);
    return null;
  }
}

/**
 * 3. SUBMIT JAWABAN ASESMEN (LOGIKA UTAMA)
 * Digunakan di: src/components/KuesionerAsesmen.tsx
 */
export async function submitAssessment(
  jadwalId: string,
  siswaId: string,
  answers: { [key: number]: number }, // Key: ID Pertanyaan, Value: Skor (1-4)
  waktuMulaiClient: Date
) {
  try {
    // --- A. HITUNG WAKTU & VALIDITAS ---
    const waktuSelesai = new Date();
    const waktuMulai = new Date(waktuMulaiClient);
    
    // Hitung durasi dalam detik
    const durasiDetik = Math.floor((waktuSelesai.getTime() - waktuMulai.getTime()) / 1000);
    
    // Jika durasi < 60 detik (1 menit), tandai sebagai suspect (asal-asalan)
    const statusValiditas = durasiDetik < 60 ? "suspect" : "valid";

    // --- B. DATA SNAPSHOT SISWA ---
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaId },
      include: { kelas: true },
    });

    if (!siswa) return { success: false, error: "Data siswa tidak ditemukan" };

    // Cek apakah sudah pernah mengerjakan
    const existing = await prisma.asesmenSiswa.findFirst({
      where: { jadwalId, siswaId },
    });
    if (existing) return { success: false, error: "Anda sudah mengerjakan asesmen ini." };

    // --- C. HITUNG SKOR AGREGAT ---
    const questionIds = Object.keys(answers).map(Number);
    const dbQuestions = await prisma.pertanyaan.findMany({
      where: { id: { in: questionIds } },
      include: { dimensi: true },
    });

    let totalSkor = 0;
    // Variabel penampung per dimensi
    let skorKesadaranDiri = 0;   // D01
    let skorManajemenDiri = 0;   // D02
    let skorKesadaranSosial = 0; // D03
    let skorRelasi = 0;          // D04
    let skorKeputusan = 0;       // D05

    const detailJawabanToSave = [];

    for (const q of dbQuestions) {
      const nilai = answers[q.id] || 0;
      totalSkor += nilai;

      // Simpan detail untuk history
      detailJawabanToSave.push({
        id_pertanyaan: q.id,
        pertanyaan: q.teksPertanyaan,
        skor: nilai,
        dimensi: q.dimensi.namaDimensi,
      });

      // Grouping skor berdasarkan Kode Dimensi
      const kode = q.dimensi.kodeDimensi;
      if (kode === 'D1') skorKesadaranDiri += nilai;
      else if (kode === 'D2') skorManajemenDiri += nilai;
      else if (kode === 'D3') skorKesadaranSosial += nilai;
      else if (kode === 'D4') skorRelasi += nilai;
      else if (kode === 'D5') skorKeputusan += nilai;
    }

    // --- D. HITUNG KATEGORI (NORMALISASI MIN-MAX) ---
    // Rumus: ((Skor - Min) / (Max - Min)) * 100
    const jumlahSoal = dbQuestions.length;
    const skorMinimal = jumlahSoal * 1; 
    const skorMaksimal = jumlahSoal * 4;
    const rentang = skorMaksimal - skorMinimal;

    let persentase = 0;
    if (rentang > 0) {
      persentase = ((totalSkor - skorMinimal) / rentang) * 100;
    }

    let kategoriAkhir = "Ideal";
    if (persentase <= 25) kategoriAkhir = "Tidak Ideal";
    else if (persentase <= 50) kategoriAkhir = "Kurang Ideal";
    else if (persentase <= 75) kategoriAkhir = "Cukup Ideal";

    // --- E. SIMPAN KE DATABASE ---
    await prisma.asesmenSiswa.create({
      data: {
        jadwalId,
        siswaId,
        
        // Waktu
        waktuMulai,
        waktuSelesai,
        durasiDetik,
        statusValiditas: statusValiditas as any, // Cast tipe Enum jika perlu

        // Snapshot
        snapNamaSiswa: siswa.namaSiswa,
        snapNamaKelas: siswa.kelas?.namaKelas || "-",
        snapNisn: siswa.nisn,

        // Nilai
        totalSkor,
        kategoriAkhir,
        skorKesadaranDiri,
        skorManajemenDiri,
        skorKesadaranSosial,
        skorRelasi,
        skorKeputusan,

        // Detail
        detailJawaban: detailJawabanToSave,
      },
    });

    // Refresh halaman dashboard siswa agar data baru muncul
    revalidatePath("/siswa");
    return { success: true };

  } catch (error) {
    console.error("Gagal submit asesmen:", error);
    return { success: false, error: "Terjadi kesalahan server saat menyimpan." };
  }
}

// menampilkan lembar kerja siswa
export async function getHasilSiswaPerId(siswaId: string) {
  try {
    // 1. Ambil Data Siswa & Kelasnya
    const siswa = await prisma.siswa.findUnique({
      where: { id: siswaId },
      include: { kelas: true }
    });

    if (!siswa) return null;

    // 2. Ambil Asesmen Terakhir siswa ini
    // (Asumsi: kita ambil yang paling baru/latest)
    const asesmen = await prisma.asesmenSiswa.findFirst({
      where: { siswaId: siswaId },
      orderBy: { waktuSelesai: 'desc' }, // Ambil yang terbaru
    });

    // Return format gabungan agar mudah dipakai di frontend
    return {
      profil: siswa,
      asesmen: asesmen // Bisa null jika siswa belum mengerjakan
    };

  } catch (error) {
    console.error("Error getHasilSiswaPerId:", error);
    return null;
  }
}