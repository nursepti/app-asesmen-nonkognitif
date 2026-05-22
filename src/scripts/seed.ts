import  prisma  from '../lib/prisma';
import { Role, Jadwal, User, Guru, Kelas, Siswa, StatusJadwal} from '@prisma-client';
import * as bcrypt from 'bcryptjs';





async function main() {
  console.log('🔄 Memulai seeding 15 data jadwal...')
  //   console.log('🌱 Memulai seeding database...');

  // 1. CLEANUP / RESET DATABASE
  await prisma.asesmenSiswa.deleteMany(); 
  await prisma.jadwal.deleteMany();       
  await prisma.siswa.deleteMany();        
  await prisma.kelas.deleteMany();        
  await prisma.guru.deleteMany();         
  await prisma.user.deleteMany();         

  console.log('🧹 Database dibersihkan.');

  const hashedPassword = await bcrypt.hash('123456', 10);

 // --- 2. SEED GURU (Wajib bikin minimal 15 agar pas dengan jumlah kelas) ---
  const gurus = [];
  console.log('⏳ Sedang membuat data Guru...');

  for (let i = 1; i <= 10; i++) {
    const username = `guru${i}`;
    
    const guru = await prisma.guru.create({
      data: {
        nip: `198001012024${i.toString().padStart(4, '0')}`, 
        namaGuru: `Guru ${i} S.Pd`,
        mapel: i % 2 === 0 ? 'Matematika' : 'Bahasa Indonesia',
        email: `guru${i}@sekolah.id`,
        noTelepon: `08120000${i.toString().padStart(4, '0')}`,
        alamat: `Jl. Pendidikan No. ${i}`,
        user: {
          create: {
            username: username,
            password: hashedPassword, // Pastikan variabel ini sudah ada di atas
            role: 'guru', 
          },
        },
      },
    });
    gurus.push(guru);
  }
  console.log('✅ 15 Guru berhasil dibuat.');


  // --- 3. SEED KELAS (7A - 9E) ---
  const kelases = [];
  const tingkat = ['7', '8', '9'];     // Rentang Kelas
  const tipe    = ['A', 'B', 'C']; // Tipe Kelas
  
  let guruIndex = 0; // Counter untuk mengambil guru dari array

  console.log('⏳ Sedang membuat data Kelas 7-9 (A-E)...');

  for (const t of tingkat) {       // Loop 7, 8, 9
    for (const p of tipe) {        // Loop A, B, C, D, E
      
      const namaKelasBaru = `${t}${p}`; // Hasil: "7A", "7B", ... "9E"
      
      // Ambil guru satu per satu untuk jadi Wali Kelas
      // Pastikan jumlah guru cukup (minimal 15)
      const guruWali = gurus[guruIndex]; 

      const kelas = await prisma.kelas.create({
        data: {
          namaKelas: namaKelasBaru,
          tahunAjaran: '2024/2025',
          jumlahSiswa: 0,
          // Hubungkan Wali Kelas (Unique)
          waliKelas: {
            connect: { id: guruWali.id }
          },
        },
      });
      
      kelases.push(kelas);
      guruIndex++; // Pindah ke guru berikutnya untuk kelas selanjutnya
    }
  }
  console.log(`✅ ${kelases.length} Kelas berhasil dibuat (7A - 8C).`);


  // --- 4. UPDATE RELASI MENGAJAR (Many-to-Many) ---
  console.log('⏳ Sedang menyeting Jadwal Mengajar Guru...');

  for (let i = 0; i < gurus.length; i++) {
    const guru = gurus[i];
    
    // Logika Dummy: Guru mengajar 3 kelas secara pola berurutan
    const kelasA = kelases[i % kelases.length];
    const kelasB = kelases[(i + 1) % kelases.length];
    const kelasC = kelases[(i + 2) % kelases.length];

    await prisma.guru.update({
      where: { id: guru.id },
      data: {
        kelasAjar: {
          connect: [
            { id: kelasA.id },
            { id: kelasB.id },
            { id: kelasC.id },
          ]
        }
      }
    });
  }
  console.log('✅ Relasi Guru Mengajar berhasil diupdate.');
  // --- 4. SEED SISWA (15 Data) ---
  const targetKelas = ['8A', '8B']
  const kelasRecords = await prisma.kelas.findMany({
    where: {
      namaKelas: { in: targetKelas }
    }
  });
  const jumlahSiswa = 60;
  for (let i = 1; i <= jumlahSiswa; i++) {
    const username = `siswa${i}`;
    const indexKelas = i % 2; 
    const targetKelas = kelasRecords[indexKelas];

    await prisma.siswa.create({
      data: {
        nisn: `0054321${i.toString().padStart(3, '0')}`,
        namaSiswa: `Siswa Teladan ${i}`,
        telepon: `08570000${i.toString().padStart(4, '0')}`,
        alamat: `Jl. Mawar No. ${i}`,
        
        // --- PERBAIKAN DI SINI ---
        // Jangan pakai 'kelasId: targetKelas.id'
        // Gunakan 'kelas: { connect: ... }' agar konsisten dengan 'user: { create ... }'
        kelas: {
            connect: { id: targetKelas.id }
        },

        // Create User (Nested Write)
        user: {
          create: {
            username: username,
            password: hashedPassword,
            role: Role.siswa, 
          },
        },
      },
    });

    // Update Counter Jumlah Siswa
    await prisma.kelas.update({
      where: { id: targetKelas.id },
      data: { jumlahSiswa: { increment: 1 } }
    });
  }
  console.log('✅ 15 Siswa berhasil dibuat.');

  // --- 5. SEED JADWAL (15 Data) --

  // 1. Ambil semua data Guru dan Kelas yang tersedia
  const allGuru = await prisma.guru.findMany()
  const allKelas = await prisma.kelas.findMany()

  // Validasi: Pastikan ada data master
  if (allGuru.length === 0 || allKelas.length === 0) {
    console.error('❌ Gagal: Tabel Guru atau Kelas masih kosong. Isi dulu datanya.')
    return
  }

  // Array untuk menampung data yang akan di-insert
  const dataJadwal = []

  // 2. Loop untuk generate 15 data
  for (let i = 1; i <= 15; i++) {
    // Pilih guru dan kelas secara acak (random)
    const randomGuru = allGuru[Math.floor(Math.random() * allGuru.length)]
    const randomKelas = allKelas[Math.floor(Math.random() * allKelas.length)]

    // Generate Tanggal Pelaksanaan (Mulai dari besok + i hari)
    const tgl = new Date()
    tgl.setDate(tgl.getDate() + i) // Hari ini + 1, + 2, dst...

    // Generate Jam Mulai (Acak antara jam 07:00 s/d 14:00)
    const startHour = Math.floor(Math.random() * (14 - 7 + 1) + 7) 
    const jamMulai = new Date('1970-01-01')
    jamMulai.setHours(startHour, 0, 0) // Menit 00

    // Generate Jam Selesai (Jam Mulai + 2 Jam)
    const jamSelesai = new Date(jamMulai)
    jamSelesai.setHours(startHour + 2)

    // Tentukan Status secara acak (opsional, dominan 'aktif')
    // Logic: Jika i genap 'aktif', jika kelipatan 5 'selesai', sisanya 'aktif'
    let status: StatusJadwal = StatusJadwal.aktif
    if (i % 5 === 0) status = StatusJadwal.selesai
    
    // Push ke array
    dataJadwal.push({
      namaSesi: `Sesi Asesmen ${randomKelas.namaKelas || 'Kelas'} - Pertemuan ke-${i}`, // Sesuaikan field nama kelas jika beda
      tglPelaksanaan: tgl,
      jamMulai: jamMulai,
      jamSelesai: jamSelesai,
      status: status,
      guruId: randomGuru.id,
      kelasId: randomKelas.id,
    })
  }

  // 3. Eksekusi Create Many (Lebih efisien daripada loop create satu per satu)
  await prisma.jadwal.createMany({
    data: dataJadwal,
  })

  console.log('✅ Berhasil membuat 15 data jadwal dummy!')
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
