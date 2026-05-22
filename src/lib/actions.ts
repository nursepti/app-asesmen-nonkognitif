"use server";

import  prisma  from "./prisma";
import { revalidatePath } from "next/cache";
import { KelasSchema,  GuruSchema } from "./FormValidationSchemas";
import { success } from "zod";
import { createClerkClient } from "@clerk/nextjs/server";
import { Role } from "../../prisma/generated/prisma/browser";


/**
 * mengambil data chart statistik berdasarkan kelas
 * Digunakan di: src/
 */
export const getChartDataByKelas = async (kelas: string) => {
  try {
    const stats = await prisma.asesmenSiswa.groupBy({
      by: ['kategoriAkhir'],
      where: {
        snapNamaKelas: kelas,
        waktuSelesai: { not: null }
      },
      _count: {
        kategoriAkhir: true
      }
    });

    //mengurutkan tampilan kategorinya sesuai urutan ideal, cukup ideal, kurang ideal, tidak ideal
    const urutanKategori = ["Ideal", "Cukup Ideal", "Kurang Ideal", "Tidak Ideal"];
    const formattedData = stats.map(item => ({
      name: item.kategoriAkhir || "Lainnya",
      value: item._count.kategoriAkhir
    }));

    return formattedData.sort((a, b) => {
      return urutanKategori.indexOf(a.name) - urutanKategori.indexOf(b.name);
    });
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
};

/**
 * mengambil data chart statistik berdasarkan dimensi per kelas
 * digunakan di: src/app/(dashboard) guru dan admin  
 */
export const getChartDimensiByKelas = async (kelas: string) => {
  try {
    const aggregate = await prisma.asesmenSiswa.aggregate({
      where: {
        snapNamaKelas: kelas,
        waktuSelesai: { not: null } // Hanya hitung yang sudah selesai
      },
      _avg: {
        skorD1: true,
        skorD2 : true,
        skorD3: true,
        skorD4: true,
        skorD5: true,
      }
    });

    // Mapping hasil rata-rata ke format data chart (D1 - D5)
    return [
      { name: 'D1', skor: parseFloat(aggregate._avg.skorD1?.toFixed(1) || "0") },
      { name: 'D2', skor: parseFloat(aggregate._avg.skorD2?.toFixed(1) || "0") },
      { name: 'D3', skor: parseFloat(aggregate._avg.skorD3?.toFixed(1) || "0") },
      { name: 'D4', skor: parseFloat(aggregate._avg.skorD4?.toFixed(1) || "0") },
      { name: 'D5', skor: parseFloat(aggregate._avg.skorD5?.toFixed(1) || "0") },
    ];
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
};


/**
 * MENGAMBIL DATA UNTUK HALAMAN PENGERJAAN KUIS
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
    let skorD1 = 0;   // D01
    let skorD2 = 0;   // D02
    let skorD3 = 0;   // D03
    let skorD4 = 0;   // D04
    let skorD5 = 0;   // D05

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
      if (kode === 'D1') skorD1 += nilai;
      else if (kode === 'D2') skorD2 += nilai;
      else if (kode === 'D3') skorD3 += nilai;
      else if (kode === 'D4') skorD4 += nilai;
      else if (kode === 'D5') skorD5 += nilai;
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
        skorD1,
        skorD2,
        skorD3,
        skorD4,
        skorD5,

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

// Fungsi untuk membuat kelas baru dengan validasi duplikasi
export const createKelas = async (
  data: KelasSchema) => {
  try {
    await prisma.kelas.create({
      data: {
        namaKelas: data.namaKelas,
        waliKelasId: data.waliKelasId,
        tahunAjaran: data.tahunAjaran,
        jumlahSiswa: data.jumlahSiswa,
      },
    });

    revalidatePath("/list/kelas");

    return {
      success: true,
      error: false,
    };

 } catch (err: any) {
  console.error("Error dari database:", err);

  if (err.code === "P2002") {

    const originalMessage =
      err.meta?.driverAdapterError?.cause?.originalMessage || "";

    console.log("ORIGINAL MESSAGE:", originalMessage);

    // duplicate kelas + tahun ajaran
    if (
      originalMessage.includes("nama_kelas") &&
      originalMessage.includes("tahun_ajaran")
    ) {
      return {
        success: false,
        error: true,
        message: `Kelas ${data.namaKelas} pada Tahun Ajaran ${data.tahunAjaran} sudah ada.`,
      };
    }

    // duplicate wali kelas
    if (
      originalMessage.includes("wali") ||
      originalMessage.includes("guru") ||
      originalMessage.includes("id_guru")
    ) {
      return {
        success: false,
        error: true,
        message: "Guru tersebut sudah menjadi wali kelas di kelas lain.",
      };
    }
  }

  return {
    success: false,
    error: true,
    message: "Terjadi kesalahan internal pada server.",
  };
}
}

//fungsi mengupdate kelas berdasarkan id
export const updateKelas = async (id: string, data: KelasSchema) => {
  try {
    await prisma.$transaction(async (tx) => {
      const kelasSaatIni = await tx.kelas.findUnique({
        where: { id },
        select: {
          id: true,
          namaKelas: true,
          tahunAjaran: true,
          waliKelasId: true,
        },
      });

      if (!kelasSaatIni) {
        throw new Error("KELAS_TIDAK_DITEMUKAN");
      }

      const kelasDuplikat = await tx.kelas.findFirst({
        where: {
          namaKelas: data.namaKelas,
          tahunAjaran: data.tahunAjaran,
          NOT: { id },
        },
      });

      if (kelasDuplikat) {
        throw new Error("DUPLICATE_KELAS_TAHUN");
      }

      const waliLama = kelasSaatIni.waliKelasId;
      const waliBaru = data.waliKelasId;

      const kelasPemilikWaliBaru = await tx.kelas.findFirst({
        where: {
          waliKelasId: waliBaru,
          tahunAjaran: data.tahunAjaran,
          NOT: { id },
        },
      });

      if (kelasPemilikWaliBaru) {
        await tx.kelas.update({
          where: { id },
          data: {
            waliKelasId: null,
          },
        });

        if (waliLama) {
          await tx.kelas.update({
            where: { id: kelasPemilikWaliBaru.id },
            data: {
              waliKelasId: waliLama,
            },
          });
        }
      }

      await tx.kelas.update({
        where: { id },
        data: {
          namaKelas: data.namaKelas,
          tahunAjaran: data.tahunAjaran,
          jumlahSiswa: data.jumlahSiswa,
          waliKelasId: waliBaru,
        },
      });
    });

    revalidatePath("/list/kelas");

    return {
      success: true,
      error: false,
      message: "Data kelas berhasil diperbarui.",
    };
  } catch (err: any) {
    console.error("Error update kelas:", err);

    return {
      success: false,
      error: true,
      message: "Gagal memperbarui data kelas.",
    };
  }
};

//fungsi hapus kelas berdasarkan id
export const deleteKelas = async (id: string) => {
  try {
    // cek apakah kelas ada
    const kelas = await prisma.kelas.findUnique({
      where: { id },
      select: {
        id: true,
        namaKelas: true,
        tahunAjaran: true,
      },
    });

    if (!kelas) {
      return {
        success: false,
        error: true,
        message: "Data kelas tidak ditemukan.",
      };
    }

    // hapus kelas
    await prisma.kelas.delete({
      where: { id },
    });

    revalidatePath("/list/kelas");

    return {
      success: true,
      error: false,
      message: `Kelas ${kelas.namaKelas} Tahun Ajaran ${kelas.tahunAjaran} berhasil dihapus.`,
    };
  } catch (err: any) {
    console.error("Error delete kelas:", err);

    // foreign key constraint
    if (err.code === "P2003") {
      return {
        success: false,
        error: true,
        message:
          "Kelas tidak dapat dihapus karena masih digunakan pada data lain.",
      };
    }

    return {
      success: false,
      error: true,
      message: "Terjadi kesalahan saat menghapus data kelas.",
    };
  }
};

/** 
 * FUNGSI CRUD GURU DAN PENANGAN DUPLIKASI DAN ERROR
*/

// Fungsi Create Guru
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
export const createGuru = async (data:GuruSchema) => {
  const existingGuru = await prisma.guru.findUnique({
    where: {
      nip: data.nip,
    },
  });

  if (existingGuru) {
    return {
      success: false,
      error: true,
      message: `Gagal! NIP [${data.nip}] sudah terdaftar di sistem.`,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (existingUser) {
    return {
      success: false,
      error: true,
      message: `Gagal! Username @${data.username} sudah digunakan.`,
    };
  }
  try {
    // 1. Daftarkan User langsung ke Clerk dengan password dari Admin
    const clerkUser = await clerkClient.users.createUser({
      username: data.username,
      password: data.password, 
      publicMetadata: {
        role: "GURU", 
      },
    });

    if (!clerkUser) {
      throw new Error("Gagal membuat akun di Clerk.");
    }


    // 2. Jalankan Prisma Transaction untuk menyimpan ke database lokal
    await prisma.$transaction(async (tx) => {
      
      // a. Simpan data user ke tbl_user
      const newUser = await tx.user.create({
        data: {
          ClerkId: clerkUser.id, 
          username: data.username,
          password: "PROTECTED_BY_CLERK", 
          role: Role.guru
        },
      });

      // b. Simpan detail profil ke tbl_guru
      await tx.guru.create({
        data: {
          nip: data.nip,
          namaGuru: data.nama,
          mapel: data.mataPelajaran, 
          alamat: data.alamat,
          email: data.email,
          noTelepon: data.telepon,
          username: newUser.username, 
          kelasAjar: {
            // data.kelasDiajar berisi array ID: ["uuid-1", "uuid-2"]
            connect: data.kelasDiajar.map((idKelas) => ({ id: idKelas })),
          },
        },
      });
    });

    // Revalidasi halaman list guru agar data terbaru langsung muncul
    revalidatePath("/list/guru");

    return { 
      success: true, 
      error: false, 
      message: "Data Guru dan Akun berhasil dibuat!" 
    };

  } catch (err: any) {
    console.error("Error dari database/Clerk:", err);

    // --- PENANGANAN ERROR DUPLIKASI (PRISMA P2002) ---
    if (err.code === "P2002") {
      const originalMessage = (
        err.meta?.driverAdapterError?.cause?.originalMessage || 
        err.message || 
        ""
      ).toLowerCase();

      const targetFields = err.meta?.target ? JSON.stringify(err.meta.target).toLowerCase() : "";

      if (originalMessage.includes("nip") || targetFields.includes("nip")) {
        return {
          success: false,
          error: true,
          message: `Gagal! NIP [${data.nip}] sudah terdaftar di sistem.`,
        };
      }

      if (originalMessage.includes("username") || targetFields.includes("username")) {
        return {
          success: false,
          error: true,
          message: `Gagal! Username @${data.username} sudah digunakan.`,
        };
      }

    }

    // --- PENANGANAN ERROR SPESIFIK DARI CLERK SDK ---
    if (err.errors && err.errors[0]) {
      const clerkErrorMessage = err.errors[0].longMessage || "";
      
      if (clerkErrorMessage.includes("username") && clerkErrorMessage.includes("already exists")) {
        return { success: false, error: true, message: "Username sudah terdaftar di sistem Clerk." };
      }
      
      return { 
        success: false, 
        error: true, 
        message: `Clerk: ${err.errors[0].message}` 
      };
    }

    return {
      success: false,
      error: true,
      message: err.message || "Terjadi kesalahan internal pada server.",
    };
  }
};

// Fungsi Update Guru
export const updateGuru = async (id: string, data: GuruSchema) => {
  try {
    // Jalankan update data ke database menggunakan Prisma
    await prisma.guru.update({
      where: {
        id: id, // ID Guru (UUID) yang sedang di-edit
      },
      data: {
        nip: data.nip,
        namaGuru: data.nama,
        mapel: data.mataPelajaran,
        alamat: data.alamat,
        email: data.email,
        noTelepon: data.telepon,
        foto: data.foto || undefined,
        
        // SINKRONISASI RELASI MANY-TO-MANY KELAS DIAJAR
        kelasAjar: {
          // Fitur 'set' milik Prisma otomatis menghapus relasi lama yang batal dicentang,
          // dan langsung menambahkan relasi baru yang baru dicentang oleh Admin.
          set: data.kelasDiajar.map((idKelas) => ({ id: idKelas })),
        },
      },
    });

    // Revalidasi cache halaman list guru agar data di browser langsung terupdate
    revalidatePath("/list/guru");

    return {
      success: true,
      error: false,
      message: "Data Guru berhasil diperbarui!",
    };

  } catch (err: any) {
    console.error("Error saat updateGuru:", err);

    if (err.code === "P2002") {
      const originalMessage = (
        err.meta?.driverAdapterError?.cause?.originalMessage ||
        err.message ||
        ""
      ).toLowerCase();

      const targetFields = err.meta?.target
        ? JSON.stringify(err.meta.target).toLowerCase()
        : "";

      if (originalMessage.includes("nip") || targetFields.includes("nip")) {
        return {
          success: false,
          error: true,
          message: `Gagal memperbarui! NIP [${data.nip}] sudah digunakan oleh guru lain.`,
        };
      }

      return {
        success: false,
        error: true,
        message: "Data yang dimasukkan sudah digunakan oleh data lain.",
      };
    }

    return {
      success: false,
      error: true,
      message: "Terjadi kesalahan saat memperbarui data guru.",
    };
  }
};

//FUNGSI DELETE GURU
export const deleteGuru = async (id: string) => {
  try {
    // a. Cari data guru terlebih dahulu untuk mendapatkan username dan ClerkId melalui relasi user
    const guru = await prisma.guru.findUnique({
      where: { id: id },
      include: { user: true },
    });

    if (!guru) {
      return { success: false, error: true, message: "Data guru tidak ditemukan." };
    }

    const clerkId = guru.user?.ClerkId;

    // b. Jalankan Prisma Transaction untuk menghapus relasi Many-to-Many dan baris data lokal
    await prisma.$transaction(async (tx) => {
      // 1. Putuskan semua relasi mengajar di kelas (Many-to-Many) terlebih dahulu
      await tx.guru.update({
        where: { id: id },
        data: {
          kelasAjar: {
            disconnect: [], // Kosongkan/putuskan seluruh hubungan relasi kelas
          },
        },
      });

      // 2. Hapus data dari profil tbl_guru
      await tx.guru.delete({
        where: { id: id },
      });

      // 3. Hapus akun di tbl_user jika terikat relasi
      if (guru.username) {
        await tx.user.delete({
          where: { username: guru.username },
        });
      }
    });

    // c. Hapus akun user di Clerk secara permanen setelah database lokal sukses dibersihkan
    if (clerkId) {
      await clerkClient.users.deleteUser(clerkId);
    }

    // Revalidasi cache halaman list guru agar data langsung hilang dari tabel di browser
    revalidatePath("/list/guru");

    return {
      success: true,
      error: false,
      message: `Data guru ${guru.namaGuru} beserta akun autentikasinya berhasil dihapus permanen!`,
    };

  } catch (err: any) {
    console.error("Error saat deleteGuru:", err);
    return {
      success: false,
      error: true,
      message: err.message || "Gagal menghapus data guru dari server.",
    };
  }
};
