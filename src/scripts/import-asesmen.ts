import 'dotenv/config';
import prisma from '../lib/prisma';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Memulai seeding bersih...");

  // 1. Hapus isi tabel (Hapus dari yang paling bawah/anak dulu)
  await prisma.pertanyaan.deleteMany();
  await prisma.indikator.deleteMany();
  await prisma.dimensi.deleteMany();

  try {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE tbl_dimensi_id_dimensi_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE tbl_indikator_id_indikator_seq RESTART WITH 1`);
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE tbl_pertanyaan_id_pertanyaan_seq RESTART WITH 1`);
    console.log("✅ Auto-increment berhasil direset ke 1.");
  } catch (err) {
    // Jika nama sequence berbeda, gunakan perintah TRUNCATE (lebih ampuh)
    console.log("⚠️ Gagal reset sequence, mencoba metode TRUNCATE...");
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE tbl_pertanyaan, tbl_indikator, tbl_dimensi RESTART IDENTITY CASCADE`);
    console.log("✅ Data dihapus dan ID direset menggunakan TRUNCATE.");
  }

  const filePath = path.resolve(__dirname, 'kuesioner_DNK.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];

  const rows: any[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 3) {
      rows.push({
        urutan: Number(row.getCell(1).value),
        teksPertanyaan: row.getCell(2).value?.toString(),
        kodeDimensi: row.getCell(3).value?.toString(),
        namaDimensi: row.getCell(4).value?.toString(),
        namaIndikator: row.getCell(5).value?.toString(),
      });
    }
  });

  for (const item of rows) {
    try {
      // 2. Operasi pada Model Dimensi
      // Hanya menyentuh kolom: kodeDimensi dan namaDimensi
      let dimensi = await prisma.dimensi.findFirst({
        where: { kodeDimensi: item.kodeDimensi }
      });

      if (!dimensi) {
        dimensi = await prisma.dimensi.create({
          data: {
            kodeDimensi: item.kodeDimensi,
            namaDimensi: item.namaDimensi
          }
        });
      }

      // 3. Operasi pada Model Indikator
      // Kita masukkan ID Dimensi ke kolom dimensiId (id_dimensi) secara langsung
      let indikator = await prisma.indikator.findFirst({
        where: { 
          namaIndikator: item.namaIndikator,
          dimensiId: dimensi.id 
        }
      });

      if (!indikator) {
        indikator = await prisma.indikator.create({
          data: {
            namaIndikator: item.namaIndikator,
            dimensiId: dimensi.id 
          }
        });
      }

      // 4. Operasi pada Model Pertanyaan
      // Hanya mengisi kolom fisik: teksPertanyaan, urutan, dimensiId, indikatorId
      await prisma.pertanyaan.create({
        data: {
          teksPertanyaan: item.teksPertanyaan,
          urutan: item.urutan || 0,
          dimensiId: dimensi.id,
          indikatorId: indikator.id
        }
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Gagal pada: ${item.teksPertanyaan?.substring(0, 20)}...`, errorMessage)
    }
  }

  console.log("✨ Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });