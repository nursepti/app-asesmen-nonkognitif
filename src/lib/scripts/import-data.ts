// import-data.ts
import { Prisma, Pertanyaan } from '@prisma-client';
import 'dotenv/config';
import prisma from "@/lib/prisma";
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

console.log("Database URL terdeteksi:", process.env.DATABASE_URL ? "YA" : "TIDAK");
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

async function main() {
  const filePath = path.join(__dirname, 'pertanyaan.xlsx'); // Sesuaikan nama file

  if (!fs.existsSync(filePath)) {
    console.error(`File tidak ditemukan di: ${filePath}`);
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];

  // Array sementara untuk menampung data mentah dari Excel
  const rawData: any[] = [];
  // Set untuk menampung semua ID Indikator yang unik (supaya query database efisien)
  const allIndikatorIds = new Set<number>();

  console.log('Membaca Excel...');

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip Header

    const Urutan = row.getCell(1).value; 
    const Pertanyaan = row.getCell(2).value;
    const id_indikator = row.getCell(3).value;

    // Pastikan ID Indikator ada dan berupa angka
    if (id_indikator) {
      const fixedId = Number(id_indikator);
      
      // Simpan ke rawData
      rawData.push({
        urutan: Number(Urutan),
        teksPertanyaan: String(Pertanyaan),
        indikatorId: fixedId
      });

      // Kumpulkan ID untuk dicari dimensinya nanti
      allIndikatorIds.add(fixedId);
    }
  });

  console.log(`Mencari data Dimensi untuk ${allIndikatorIds.size} indikator...`);

  // --- LANGKAH KUNCI: LOOKUP DIMENSI ID ---
  // Kita cari semua Indikator yang dipakai, lalu ambil dimensiId-nya
  const indikatorList = await prisma.indikator.findMany({
    where: {
      id: { in: Array.from(allIndikatorIds) }
    },
    select: {
      id: true,
      dimensiId: true // Kita butuh ini!
    }
  });

  // Peta (Map) supaya gampang mencocokkan: { id_indikator: id_dimensi }
  const mapDimensi = new Map<number, number>();
  indikatorList.forEach(item => {
    mapDimensi.set(item.id, item.dimensiId);
  });

  // --- GABUNGKAN DATA ---
  const dataSiapInsert = rawData.map(item => {
    const dimensiIdFound = mapDimensi.get(item.indikatorId);

    if (!dimensiIdFound) {
      console.warn(`⚠️ Peringatan: Indikator ID ${item.indikatorId} tidak ditemukan di database! Data ini mungkin akan gagal.`);
    }

    return {
      urutan: item.urutan,
      teksPertanyaan: item.teksPertanyaan,
      indikatorId: item.indikatorId,
      dimensiId: dimensiIdFound // Masukkan Dimensi ID yang ditemukan otomatis
    };
  });

  // Filter data yang dimensiId-nya ketemu saja (supaya tidak error)
  const validData = dataSiapInsert.filter(item => item.dimensiId !== undefined);

  console.log(`Siap import ${validData.length} pertanyaan...`);

  if (validData.length > 0) {
    await prisma.pertanyaan.createMany({
      data: validData as any, // Cast any jika perlu
    });
    console.log('✅ Import Berhasil!');
  } else {
    console.log('❌ Tidak ada data yang bisa diimport. Cek apakah ID Indikator di Excel sudah ada di Database Indikator?');
  }
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });