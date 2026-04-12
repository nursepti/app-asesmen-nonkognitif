import 'dotenv/config';
import prisma from './prisma';
import { StatusValiditas } from '@prisma-client';

async function main() {
  // 1. Ambil Data Master Pertanyaan
  const pertanyaanList = await prisma.pertanyaan.findMany();
  if (pertanyaanList.length === 0) {
    console.error('❌ Data Pertanyaan kosong! Silakan isi tbl_pertanyaan dulu.');
    return;
  }

  // 2. Ambil Jadwal yang Aktif (untuk kelas 8A dan 8B)
  const jadwalAktif = await prisma.jadwal.findFirst({
    where: {
      status: 'aktif',
      kelas: {
        namaKelas: { in: ['8A', '8B'] }
      }
    },
    include: {
      kelas: true
    }
  });

  if (!jadwalAktif) {
    console.error('❌ Tidak ada Jadwal aktif untuk kelas 8A/8B ditemukan.');
    return;
  }

  // 3. Ambil Semua Siswa di kelas tersebut
  const daftarSiswa = await prisma.siswa.findMany({
    where: { kelasId: jadwalAktif.kelasId }
  });

  if (daftarSiswa.length === 0) {
    console.error(`❌ Tidak ada siswa ditemukan di kelas ${jadwalAktif.kelas.namaKelas}`);
    return;
  }

  console.log(`🚀 Men-generate jawaban untuk ${daftarSiswa.length} siswa pada ${jadwalAktif.namaSesi}...`);

  // 4. Proses Loop Jawaban
  for (const siswa of daftarSiswa) {
    // --- PERBAIKAN: Generate jawaban acak terlebih dahulu untuk siswa ini ---
    const detailJawaban = pertanyaanList.map((q) => ({
      id_pertanyaan: q.id,
      teks: q.teksPertanyaan,
      skor: Math.floor(Math.random() * 4) + 1, // 1-4
    }));

    // --- PERBAIKAN: Fungsi hitung skor berdasarkan DimensiID yang asli ---
    const getSkorByDimensi = (dimensiId: number) => {
      return detailJawaban
        .filter(j => {
          const soal = pertanyaanList.find(p => p.id === j.id_pertanyaan);
          return soal?.dimensiId === dimensiId;
        })
        .reduce((sum, item) => sum + item.skor, 0);
    };

    const skorKesadaranDiri = getSkorByDimensi(1);   // Dimensi 1
    const skorManajemenDiri = getSkorByDimensi(2);   // Dimensi 2
    const skorKesadaranSosial = getSkorByDimensi(3); // Dimensi 3
    const skorRelasi = getSkorByDimensi(4);          // Dimensi 4
    const skorKeputusan = getSkorByDimensi(5);       // Dimensi 5

    const totalSkor = skorKesadaranDiri + skorManajemenDiri + skorKesadaranSosial + skorRelasi + skorKeputusan;

    let kategori = 'Cukup';
    if (totalSkor > 110) kategori = 'Sangat Baik';
    else if (totalSkor > 80) kategori = 'Baik';

    // 5. Upsert ke AsesmenSiswa
    await prisma.asesmenSiswa.upsert({
      where: {
        jadwalId_siswaId: {
          jadwalId: jadwalAktif.id,
          siswaId: siswa.id,
        },
      },
      update: {
        totalSkor: totalSkor,
        detailJawaban: detailJawaban,
        kategoriAkhir: kategori,
        waktuSelesai: new Date(),
        // --- PERBAIKAN: Jangan gunakan Math.floor(totalSkor / 5) ---
        skorKesadaranDiri,
        skorManajemenDiri,
        skorKesadaranSosial,
        skorRelasi,
        skorKeputusan,
      },
      create: {
        jadwalId: jadwalAktif.id,
        siswaId: siswa.id,
        waktuMulai: new Date(),
        waktuSelesai: new Date(),
        durasiDetik: Math.floor(Math.random() * 600) + 300,
        statusValiditas: StatusValiditas.valid,
        snapNamaSiswa: siswa.namaSiswa,
        snapNamaKelas: jadwalAktif.kelas.namaKelas,
        snapNisn: siswa.nisn,
        totalSkor: totalSkor,
        kategoriAkhir: kategori,
        detailJawaban: detailJawaban,
        // --- PERBAIKAN: Simpan skor asli per dimensi ---
        skorKesadaranDiri,
        skorManajemenDiri,
        skorKesadaranSosial,
        skorRelasi,
        skorKeputusan,
      },
    });
  }

  console.log(`✅ Berhasil membuat data jawaban untuk ${daftarSiswa.length} siswa.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });