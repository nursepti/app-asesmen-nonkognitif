/*
  Warnings:

  - A unique constraint covering the columns `[id_guru,tahun_ajaran]` on the table `tbl_kelas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tbl_kelas" DROP CONSTRAINT "tbl_kelas_id_guru_fkey";

-- AlterTable
ALTER TABLE "tbl_kelas" ALTER COLUMN "id_guru" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_kelas_id_guru_tahun_ajaran_key" ON "tbl_kelas"("id_guru", "tahun_ajaran");

-- AddForeignKey
ALTER TABLE "tbl_kelas" ADD CONSTRAINT "tbl_kelas_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "tbl_guru"("id_guru") ON DELETE SET NULL ON UPDATE CASCADE;
