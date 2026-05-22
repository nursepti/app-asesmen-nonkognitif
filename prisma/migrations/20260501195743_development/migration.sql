/*
  Warnings:

  - You are about to drop the column `skor_keputusan` on the `tbl_asesmen_siswa` table. All the data in the column will be lost.
  - You are about to drop the column `skor_kesadaran_diri` on the `tbl_asesmen_siswa` table. All the data in the column will be lost.
  - You are about to drop the column `skor_kesadaran_sosial` on the `tbl_asesmen_siswa` table. All the data in the column will be lost.
  - You are about to drop the column `skor_manajemen_diri` on the `tbl_asesmen_siswa` table. All the data in the column will be lost.
  - You are about to drop the column `skor_relasi` on the `tbl_asesmen_siswa` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `tbl_guru` table. All the data in the column will be lost.
  - You are about to drop the column `kelas_mengajar` on the `tbl_guru` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `tbl_siswa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_jadwal,id_siswa]` on the table `tbl_asesmen_siswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `tbl_guru` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_guru]` on the table `tbl_kelas` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `tbl_siswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `tbl_guru` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `tbl_siswa` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tbl_guru" DROP CONSTRAINT "tbl_guru_id_user_fkey";

-- DropForeignKey
ALTER TABLE "tbl_siswa" DROP CONSTRAINT "tbl_siswa_id_user_fkey";

-- DropIndex
DROP INDEX "tbl_asesmen_siswa_id_jadwal_key";

-- DropIndex
DROP INDEX "tbl_asesmen_siswa_id_siswa_key";

-- DropIndex
DROP INDEX "tbl_guru_id_user_key";

-- DropIndex
DROP INDEX "tbl_siswa_id_user_key";

-- AlterTable
ALTER TABLE "tbl_asesmen_siswa" DROP COLUMN "skor_keputusan",
DROP COLUMN "skor_kesadaran_diri",
DROP COLUMN "skor_kesadaran_sosial",
DROP COLUMN "skor_manajemen_diri",
DROP COLUMN "skor_relasi",
ADD COLUMN     "skor_aktivitas_belajar_mandiri" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skor_gaya_belajar" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skor_kesejahteraan_psikologis" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skor_kondisi_keluarga" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skor_latar_belakang_pergaulan" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tbl_guru" DROP COLUMN "id_user",
DROP COLUMN "kelas_mengajar",
ADD COLUMN     "username" VARCHAR(50) NOT NULL,
ALTER COLUMN "id_guru" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "tbl_siswa" DROP COLUMN "id_user",
ADD COLUMN     "username" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "tbl_user" ALTER COLUMN "id_user" SET DEFAULT gen_random_uuid();

-- CreateTable
CREATE TABLE "_GuruMengajar" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_GuruMengajar_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GuruMengajar_B_index" ON "_GuruMengajar"("B");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_asesmen_siswa_id_jadwal_id_siswa_key" ON "tbl_asesmen_siswa"("id_jadwal", "id_siswa");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_guru_username_key" ON "tbl_guru"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_kelas_id_guru_key" ON "tbl_kelas"("id_guru");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_siswa_username_key" ON "tbl_siswa"("username");

-- AddForeignKey
ALTER TABLE "tbl_guru" ADD CONSTRAINT "tbl_guru_username_fkey" FOREIGN KEY ("username") REFERENCES "tbl_user"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_siswa" ADD CONSTRAINT "tbl_siswa_username_fkey" FOREIGN KEY ("username") REFERENCES "tbl_user"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuruMengajar" ADD CONSTRAINT "_GuruMengajar_A_fkey" FOREIGN KEY ("A") REFERENCES "tbl_guru"("id_guru") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuruMengajar" ADD CONSTRAINT "_GuruMengajar_B_fkey" FOREIGN KEY ("B") REFERENCES "tbl_kelas"("id_kelas") ON DELETE CASCADE ON UPDATE CASCADE;
