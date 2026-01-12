import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma-client';
import 'dotenv/config'; 



const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});
const prisma = new PrismaClient({ adapter });



async function main() {

console.log("⏳ Sedang menghubungkan ke database...")
  
  // Cek koneksi dulu
  try {
    await prisma.$connect()
    console.log("✅ Berhasil konek ke database!")
  } catch (err) {
    console.error("❌ Gagal konek database:", err)
    return // Stop jika gagal konek
  }
  console.log('--- Mulai Mengisi Data ---')

  // 1. BUAT DIMENSI (Master Data)
  const dimensi = await prisma.dimensi.create({
    data: {
      kodeDimensi: 'D4',
      namaDimensi: 'Latar belakang pergaulan siswa',
    }
  })
  console.log('✅ Dimensi dibuat:', dimensi.namaDimensi)

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })