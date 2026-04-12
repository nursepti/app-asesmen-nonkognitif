import  prisma  from "@/lib/prisma";
async function checkConnection() {
  try {
    // Menjalankan query paling ringan (1 + 1)
    await prisma.$queryRaw`SELECT 1`
    console.log("Prisma Client masih hidup dan terhubung!")
  } catch (e) {
    console.error("Prisma Client terputus atau bermasalah:", e)
  }
}