/*
  Warnings:

  - A unique constraint covering the columns `[clerk_id]` on the table `tbl_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerk_id` to the `tbl_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tbl_guru" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "no_telepon" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tbl_user" ADD COLUMN     "clerk_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_clerk_id_key" ON "tbl_user"("clerk_id");
