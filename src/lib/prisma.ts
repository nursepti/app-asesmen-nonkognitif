import { Pool } from 'pg';
import { PrismaClient } from '@prisma-client';
import { PrismaPg } from '@prisma/adapter-pg'


const connectionString = process.env.DATABASE_URL;

// 2. Buat Pool koneksi Postgres dulu
const pool = new Pool({ connectionString });

// 3. Masukkan Pool ke dalam Adapter
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  // 4. Masukkan adapter ke PrismaClient
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
// const adapter = new PrismaPg({ 
//   connectionString: process.env.DATABASE_URL 
// })

// const prismaClientSingleton = () => {
//   return new PrismaClient({adapter});
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// export default prisma;
 
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;