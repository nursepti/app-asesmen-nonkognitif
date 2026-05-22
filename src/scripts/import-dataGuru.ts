import 'dotenv/config';
import ExcelJS from 'exceljs';
import { createClerkClient } from '@clerk/backend';
import prisma from "../lib/prisma";
import path from 'path';
import { fileURLToPath } from 'url';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. FUNGSI CEK EKSISTENSI USERNAME ---
async function checkUsernameExists(un: string) {
  const dbUser = await prisma.user.findUnique({ where: { username: un } });
  const clerkList = await clerkClient.users.getUserList({ username: [un] });
  return dbUser || clerkList.data.length > 0;
}

// --- 2. FUNGSI GENERATE USERNAME CERDAS ---
async function generateUsernameCerdas(namaAsli: string, nipAsli: string): Promise<string> {
  const partNama = namaAsli.toLowerCase().split(/\s+/);
  let username = partNama[partNama.length - 1]; // Opsi 1: Nama Belakang

  if (await checkUsernameExists(username)) {
    // Opsi 2: Nama Depan + Nama Belakang
    username = partNama.length > 1 ? `${partNama[0]}${username}` : username;
    
    if (await checkUsernameExists(username)) {
      // Opsi 3: Nama Belakang + 3 Digit NIP Terakhir
      username = `${partNama[partNama.length - 1]}${nipAsli.slice(-3)}`;
    }
  }
  return username;
}

// --- 3. FUNGSI CLERK HANDLING ---
async function handleClerkUser(username: string, nipAsli: string): Promise<string> {
  const clerkUserList = await clerkClient.users.getUserList({ username: [username] });

  if (clerkUserList.data.length > 0) {
    console.log(`ℹ️ User '${username}' ditemukan di Clerk, sinkronisasi...`);
    return clerkUserList.data[0].id;
  } else {
    const password = `${username}${nipAsli.substring(8, 14)}`;
    const newClerkUser = await clerkClient.users.createUser({
      username: username,
      password: password,
      publicMetadata: { role: 'guru' },
      skipPasswordChecks: true,
    });
    return newClerkUser.id;
  }
}

// --- 4. FUNGSI CREATE / UPDATE (UPSERT) PRISMA ---
async function upsertDataGuru(payload: any) {
  const { nipAsli, namaAsli, mapelDefault, alamatDefault, emailDefault, noTeleponDefault, fotoDefault } = payload;

  // --- CEK EKSISTENSI DI PRISMA (GURU) ---
  const existingGuru = await prisma.guru.findUnique({
    where: { nip: nipAsli },
    include: { user: true }
  });

  if (existingGuru) {
    console.log(`⏩ Update: Guru NIP ${nipAsli} sudah ada. Memperbarui data...`);
    return await prisma.guru.update({
      where: { nip: nipAsli },
      data: {
        namaGuru: namaAsli,
        mapel: mapelDefault,
        alamat: alamatDefault,
        foto: fotoDefault,
        email: emailDefault,
        noTelepon: noTeleponDefault,
      }
    });
  }

  // --- JIKA BARU: GENERATE USERNAME & CLERK ---
  const username = await generateUsernameCerdas(namaAsli, nipAsli);
  const clerkId = await handleClerkUser(username, nipAsli);

  // --- SIMPAN KE PRISMA (USER & GURU) ---
  return await prisma.user.create({
    data: {
      ClerkId: clerkId,
      username: username,
      password: "EXTERNAL_AUTH",
      role: "guru",
      guru: {
        create: {
          namaGuru: namaAsli,
          nip: nipAsli,
          mapel: mapelDefault,
          alamat: alamatDefault,
          email: emailDefault,
          noTelepon: noTeleponDefault,
          foto: fotoDefault,
        }
      }
    }
  });
}

// --- 5. FUNGSI IMPORT UTAMA ---
async function importGuruDariExcel(fileName: string) {
  try {
    const filePath = path.resolve(__dirname, fileName);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    console.log(`🚀 Memproses sheet: ${worksheet.name}`);

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      
      const payload = {
        namaAsli: row.getCell(1).value?.toString()?.trim(),
        nipAsli: row.getCell(2).value?.toString()?.trim(),
        mapelDefault: row.getCell(3).value?.toString() || "Umum",
        alamatDefault: row.getCell(4).value?.toString() || "-",
        emailDefault: row.getCell(6).value?.toString() || null,
        noTeleponDefault: row.getCell(5).value?.toString() || null,
        fotoDefault: row.getCell(7).value?.toString() || null,
      };

      if (!payload.namaAsli || !payload.nipAsli) continue;

      try {
        const result = await upsertDataGuru(payload);
        if (result && 'username' in result) {
            console.log(`✅ Berhasil: ${payload.namaAsli} (@${result.username})`);
        } else {
            console.log(`✅ Berhasil Update: ${payload.namaAsli}`);
        }
        
        await new Promise(res => setTimeout(res, 300)); // Rate limiting
      } catch (err) {
        console.error(`❌ Gagal di baris ${i} (${payload.namaAsli}):`, (err as Error).message);
      }
    }
  } catch (err) {
    console.error("💀 Gagal fatal:", (err as Error).message);
  }
}

importGuruDariExcel('dataGuru.xlsx');