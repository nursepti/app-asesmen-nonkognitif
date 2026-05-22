import 'dotenv/config';
import ExcelJS from 'exceljs';
import prisma from "../lib/prisma";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. FUNGSI HAPUS DETAIL GURU (DATABASE) ---
async function hapusDetailGuru(nipAsli: string) {
  try {
    const existingGuru = await prisma.guru.findUnique({
      where: { nip: nipAsli }
    });

    if (!existingGuru) {
      console.log(`⚠️ Guru NIP ${nipAsli} tidak ditemukan. Skip.`);
      return;
    }

    await prisma.guru.update({
      where: { nip: nipAsli },
      data: {
        email: null,
        noTelepon: null,
        foto: null
      }
    });

    console.log(`✅ Berhasil reset data: ${existingGuru.namaGuru} (NIP: ${nipAsli})`);
  } catch (err) {
    console.error(`❌ Gagal mereset NIP ${nipAsli}:`, (err as Error).message);
  }
}

// --- 2. FUNGSI PEMBACA EXCEL & EKSEKUSI ---
async function prosesHapusDariExcel(fileName: string) {
  try {
    const filePath = path.resolve(__dirname, fileName);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    console.log(`🚀 Memproses penghapusan data berdasarkan sheet: ${worksheet.name}`);

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const nipAsli = row.getCell(2).value?.toString()?.trim(); // Mengambil NIP dari kolom 2

      if (!nipAsli) continue;

      // Jalankan fungsi hapus
      await hapusDetailGuru(nipAsli);
    }

    console.log("✨ Semua data di Excel telah diproses.");
  } catch (err) {
    console.error("💀 Gagal fatal:", (err as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}

// Menjalankan fungsi secara langsung
prosesHapusDariExcel('dataGuru.xlsx');