import 'dotenv/config';
import prisma from '../lib/prisma';
import { StatusValiditas } from '@prisma-client';

async function main() {
  const pertanyaanList = await prisma.pertanyaan.findMany();
  if (pertanyaanList.length === 0) return console.error('❌ Isi tbl_pertanyaan dulu.');

  const daftarJadwal = await prisma.jadwal.findMany({
    where: { status: 'aktif', kelas: { namaKelas: { in: ['8A', '8B'] } } },
    include: { kelas: true }
  });

  const jumlahSoal = pertanyaanList.length;
  const skorMinimal = jumlahSoal * 1; 
  const skorMaksimal = jumlahSoal * 4;
  const rentang = skorMaksimal - skorMinimal;

  for (const jadwal of daftarJadwal) {
    const daftarSiswa = await prisma.siswa.findMany({ where: { kelasId: jadwal.kelasId } });

    for (let i = 0; i < daftarSiswa.length; i++) {
      const siswa = daftarSiswa[i];
      
      /**
       * STRATEGI DISTRIBUSI:
       * Kita bagi siswa ke dalam 4 grup berdasarkan index agar hasilnya variatif
       */
      let maxRandom = 4;
      let minRandom = 1;

      if (i % 4 === 0) { [minRandom, maxRandom] = [1, 2]; }      // Grup Tidak Ideal (Skor 1-2)
      else if (i % 4 === 1) { [minRandom, maxRandom] = [2, 3]; } // Grup Kurang Ideal
      else if (i % 4 === 2) { [minRandom, maxRandom] = [2, 4]; } // Grup Cukup Ideal
      else { [minRandom, maxRandom] = [3, 4]; }                 // Grup Ideal (Skor 3-4)

      const detailJawaban = pertanyaanList.map((q) => ({
        id_pertanyaan: q.id,
        pertanyaan: q.teksPertanyaan,
        skor: Math.floor(Math.random() * (maxRandom - minRandom + 1)) + minRandom,
        dimensiId: q.dimensiId,
      }));

      const getSkorDimensi = (id: number) => 
        detailJawaban.filter(j => j.dimensiId === id).reduce((s, c) => s + c.skor, 0);

      const s1 = getSkorDimensi(1);
      const s2 = getSkorDimensi(2);
      const s3 = getSkorDimensi(3);
      const s4 = getSkorDimensi(4);
      const s5 = getSkorDimensi(5);
      const totalSkor = s1 + s2 + s3 + s4 + s5;

      // Kalkulasi Kategori
      const persentase = ((totalSkor - skorMinimal) / rentang) * 100;
      let kategoriAkhir = "Ideal";
      if (persentase <= 25) kategoriAkhir = "Tidak Ideal";
      else if (persentase <= 50) kategoriAkhir = "Kurang Ideal";
      else if (persentase <= 75) kategoriAkhir = "Cukup Ideal";

      await prisma.asesmenSiswa.upsert({
        where: { jadwalId_siswaId: { jadwalId: jadwal.id, siswaId: siswa.id } },
        update: {
          totalSkor, kategoriAkhir, detailJawaban: detailJawaban as any,
          skorKesadaranDiri: s1, skorManajemenDiri: s2, skorKesadaranSosial: s3, skorRelasi: s4, skorKeputusan: s5,
        },
        create: {
          jadwalId: jadwal.id,
          siswaId: siswa.id,
          waktuMulai: new Date(Date.now() - 1000 * 60 * 15),
          waktuSelesai: new Date(),
          durasiDetik: Math.floor(Math.random() * 600) + 300,
          statusValiditas: StatusValiditas.valid,
          snapNamaSiswa: siswa.namaSiswa,
          snapNamaKelas: jadwal.kelas.namaKelas,
          snapNisn: siswa.nisn,
          totalSkor, kategoriAkhir, detailJawaban: detailJawaban as any,
          skorKesadaranDiri: s1, skorManajemenDiri: s2, skorKesadaranSosial: s3, skorRelasi: s4, skorKeputusan: s5,
        },
      });
    }
  }
  console.log('✅ Seed berhasil dengan variasi kategori.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());