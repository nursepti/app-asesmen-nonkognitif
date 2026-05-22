import { z } from "zod";
// Schema Validasi
export const kelasSchema = z.object({
  namaKelas: z.string().min(2, "Nama Kelas harus diisi"),
  waliKelasId: z.string().min(1, "Wali Kelas harus dipilih").uuid("format ID tidak valid"),
  tahunAjaran: z.string().min(9, "Tahun Ajaran harus diisi dengan format YYYY/YYYY"),
  jumlahSiswa: z.coerce
  .number()
  .min(2, "Jumlah siswa tidak boleh negatif"),
});

export type KelasSchema = z.infer<typeof kelasSchema>;

export const guruSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter!" }),
  email: z.string().email({ message: "Alamat email tidak valid!" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter!" }),
  nama: z.string().min(3, { message: "Nama wajib diisi!" }),
  nip: z.string().min(1, { message: "NIP wajib diisi!" }).regex(/^[0-9]+$/),
  telepon: z.string().min(1, { message: "Nomor telepon wajib diisi!" }).regex(/^[0-9]+$/),
  alamat: z.string().min(2, { message: "Alamat wajib diisi!" }),
  mataPelajaran: z.string().min(3, { message: "Mata pelajaran wajib diisi!" }),
  kelasDiajar: z.array(z.string()),
  foto: z.any().optional(),
});

export type GuruSchema = z.infer<typeof guruSchema>;