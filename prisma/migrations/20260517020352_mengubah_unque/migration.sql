/*
  Warnings:

  - A unique constraint covering the columns `[nama_kelas,tahun_ajaran]` on the table `tbl_kelas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tbl_kelas_tahun_ajaran_key";

-- CreateIndex
CREATE UNIQUE INDEX "tbl_kelas_nama_kelas_tahun_ajaran_key" ON "tbl_kelas"("nama_kelas", "tahun_ajaran");
