-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'guru', 'siswa');

-- CreateEnum
CREATE TYPE "StatusJadwal" AS ENUM ('aktif', 'selesai');

-- CreateEnum
CREATE TYPE "StatusValiditas" AS ENUM ('valid', 'suspect');

-- CreateTable
CREATE TABLE "tbl_dimensi" (
    "id_dimensi" SERIAL NOT NULL,
    "kode_dimensi" VARCHAR(100) NOT NULL,
    "nama_dimensi" VARCHAR(255) NOT NULL,

    CONSTRAINT "tbl_dimensi_pkey" PRIMARY KEY ("id_dimensi")
);

-- CreateTable
CREATE TABLE "tbl_indikator" (
    "id_indikator" SERIAL NOT NULL,
    "id_dimensi" INTEGER NOT NULL,
    "nama_indikator" VARCHAR(255) NOT NULL,

    CONSTRAINT "tbl_indikator_pkey" PRIMARY KEY ("id_indikator")
);

-- CreateTable
CREATE TABLE "tbl_pertanyaan" (
    "id_pertanyaan" SERIAL NOT NULL,
    "id_dimensi" INTEGER NOT NULL,
    "id_indikator" INTEGER NOT NULL,
    "teks_pertanyaan" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_pertanyaan_pkey" PRIMARY KEY ("id_pertanyaan")
);

-- CreateTable
CREATE TABLE "tbl_kategori_nilai" (
    "id_kategori" SERIAL NOT NULL,
    "nama_kategori" VARCHAR(50) NOT NULL,
    "batas_bawah" INTEGER NOT NULL,
    "batas_atas" INTEGER NOT NULL,

    CONSTRAINT "tbl_kategori_nilai_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "tbl_user" (
    "id_user" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_user_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "tbl_guru" (
    "id_guru" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "nip" VARCHAR(20) NOT NULL,
    "nama_guru" VARCHAR(100) NOT NULL,
    "mata_pelajaran" VARCHAR(100) NOT NULL,
    "kelas_mengajar" VARCHAR(100) NOT NULL,
    "alamat" VARCHAR(255),
    "email" VARCHAR(100) NOT NULL,
    "no_telepon" VARCHAR(20) NOT NULL,
    "foto" VARCHAR(255),

    CONSTRAINT "tbl_guru_pkey" PRIMARY KEY ("id_guru")
);

-- CreateTable
CREATE TABLE "tbl_kelas" (
    "id_kelas" UUID NOT NULL,
    "id_guru" UUID NOT NULL,
    "nama_kelas" VARCHAR(50) NOT NULL,
    "tahun_ajaran" VARCHAR(20) NOT NULL,
    "jumlah_siswa" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tbl_kelas_pkey" PRIMARY KEY ("id_kelas")
);

-- CreateTable
CREATE TABLE "tbl_siswa" (
    "id_siswa" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_kelas" UUID NOT NULL,
    "nisn" VARCHAR(20) NOT NULL,
    "nama_siswa" VARCHAR(100) NOT NULL,
    "telepon" VARCHAR(20),
    "alamat" VARCHAR(255),
    "foto" VARCHAR(255),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tbl_siswa_pkey" PRIMARY KEY ("id_siswa")
);

-- CreateTable
CREATE TABLE "tbl_jadwal" (
    "id_jadwal" UUID NOT NULL,
    "id_kelas" UUID NOT NULL,
    "id_guru" UUID NOT NULL,
    "nama_sesi" VARCHAR(100) NOT NULL,
    "tgl_pelaksanaan" DATE NOT NULL,
    "jam_mulai" TIME NOT NULL,
    "jam_selesai" TIME NOT NULL,
    "status" "StatusJadwal" NOT NULL DEFAULT 'aktif',

    CONSTRAINT "tbl_jadwal_pkey" PRIMARY KEY ("id_jadwal")
);

-- CreateTable
CREATE TABLE "tbl_asesmen_siswa" (
    "id_asesmen" UUID NOT NULL,
    "id_jadwal" UUID NOT NULL,
    "id_siswa" UUID NOT NULL,
    "waktu_mulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu_selesai" TIMESTAMP(3),
    "durasi_detik" INTEGER,
    "status_validitas" "StatusValiditas" NOT NULL DEFAULT 'valid',
    "snap_nama_siswa" VARCHAR(100) NOT NULL,
    "snap_nama_kelas" VARCHAR(50) NOT NULL,
    "snap_nisn" VARCHAR(20) NOT NULL,
    "total_skor" INTEGER NOT NULL DEFAULT 0,
    "kategori_akhir" VARCHAR(50),
    "skor_kesadaran_diri" INTEGER NOT NULL DEFAULT 0,
    "skor_manajemen_diri" INTEGER NOT NULL DEFAULT 0,
    "skor_kesadaran_sosial" INTEGER NOT NULL DEFAULT 0,
    "skor_relasi" INTEGER NOT NULL DEFAULT 0,
    "skor_keputusan" INTEGER NOT NULL DEFAULT 0,
    "detail_jawaban" JSONB NOT NULL,

    CONSTRAINT "tbl_asesmen_siswa_pkey" PRIMARY KEY ("id_asesmen")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_username_key" ON "tbl_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_guru_id_user_key" ON "tbl_guru"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_guru_nip_key" ON "tbl_guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_siswa_id_user_key" ON "tbl_siswa"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_siswa_nisn_key" ON "tbl_siswa"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_asesmen_siswa_id_jadwal_key" ON "tbl_asesmen_siswa"("id_jadwal");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_asesmen_siswa_id_siswa_key" ON "tbl_asesmen_siswa"("id_siswa");

-- AddForeignKey
ALTER TABLE "tbl_indikator" ADD CONSTRAINT "tbl_indikator_id_dimensi_fkey" FOREIGN KEY ("id_dimensi") REFERENCES "tbl_dimensi"("id_dimensi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_pertanyaan" ADD CONSTRAINT "tbl_pertanyaan_id_indikator_fkey" FOREIGN KEY ("id_indikator") REFERENCES "tbl_indikator"("id_indikator") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_pertanyaan" ADD CONSTRAINT "tbl_pertanyaan_id_dimensi_fkey" FOREIGN KEY ("id_dimensi") REFERENCES "tbl_dimensi"("id_dimensi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_guru" ADD CONSTRAINT "tbl_guru_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tbl_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_kelas" ADD CONSTRAINT "tbl_kelas_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "tbl_guru"("id_guru") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_siswa" ADD CONSTRAINT "tbl_siswa_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tbl_user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_siswa" ADD CONSTRAINT "tbl_siswa_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "tbl_kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_jadwal" ADD CONSTRAINT "tbl_jadwal_id_kelas_fkey" FOREIGN KEY ("id_kelas") REFERENCES "tbl_kelas"("id_kelas") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_jadwal" ADD CONSTRAINT "tbl_jadwal_id_guru_fkey" FOREIGN KEY ("id_guru") REFERENCES "tbl_guru"("id_guru") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_asesmen_siswa" ADD CONSTRAINT "tbl_asesmen_siswa_id_jadwal_fkey" FOREIGN KEY ("id_jadwal") REFERENCES "tbl_jadwal"("id_jadwal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_asesmen_siswa" ADD CONSTRAINT "tbl_asesmen_siswa_id_siswa_fkey" FOREIGN KEY ("id_siswa") REFERENCES "tbl_siswa"("id_siswa") ON DELETE RESTRICT ON UPDATE CASCADE;
