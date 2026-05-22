/*
  Warnings:

  - A unique constraint covering the columns `[nama_kelas]` on the table `tbl_kelas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tbl_kelas_nama_kelas_key" ON "tbl_kelas"("nama_kelas");
