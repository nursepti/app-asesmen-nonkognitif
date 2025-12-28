"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField"; // Pastikan path ini benar
import Image from "next/image";

// Schema Validasi
const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username minimal 3 karakter!" })
    .max(20, { message: "Username maksimal 20 karakter!" }),
  email: z.string().email({ message: "Alamat email tidak valid!" }),
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter!" }),
  nama: z.string().min(3, { message: "Nama wajib diisi!" }),
  telepon: z.string().min(9, { message: "Nomor telepon wajib diisi!" }),
  alamat: z.string().min(10, { message: "Alamat wajib diisi!" }),
  // Menerima string dari input, nanti bisa di-split menjadi array saat dikirim ke API
  mataPelajaran: z.string().min(3, { message: "Mata pelajaran wajib diisi!" }),
  kelasDiajar: z.string().min(2, { message: "Kelas wajib diisi!" }),
  // Foto wajib jika create, opsional jika update (tergantung logika backend Anda)
  foto: z.any().optional(), 
});

type Inputs = z.infer<typeof schema>;

const FormGuru = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((formData) => {
    // KONVERSI STRING KE ARRAY SEBELUM DIKIRIM KE BACKEND/API
    // Contoh: "Matematika, Fisika" -> ["Matematika", "Fisika"]
    const finalData = {
      ...formData,
      mataPelajaran: formData.mataPelajaran.split(",").map((item) => item.trim()),
      kelasDiajar: formData.kelasDiajar.split(",").map((item) => item.trim()),
      // Handle file foto sesuai kebutuhan (misal upload ke cloud dulu)
    };

    console.log("Data siap kirim:", finalData);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Tambah Guru Baru" : "Edit Data Guru"}
      </h1>
      
      {/* --- Authentication Information --- */}
      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentikasi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>

      {/* --- Personal Information --- */}
      <span className="text-xs text-gray-400 font-medium">
        Informasi Pribadi
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nama Lengkap"
          name="nama"
          defaultValue={data?.nama}
          register={register}
          error={errors.nama}
        />
        <InputField
          label="Nomor Telepon"
          name="telepon"
          defaultValue={data?.telepon}
          register={register}
          error={errors.telepon}
        />
        <InputField
          label="Alamat"
          name="alamat"
          defaultValue={data?.alamat}
          register={register}
          error={errors.alamat}
        />
        
        {/* Mata Pelajaran (Input String -> Array) */}
        <InputField
          label="Mata Pelajaran (Pisahkan koma)"
          name="mataPelajaran"
          // Jika data.mataPelajaran adalah Array, gabung jadi string dulu untuk ditampilkan di input
          defaultValue={data?.mataPelajaran?.join(", ")} 
          register={register}
          error={errors.mataPelajaran}
        />

        {/* Kelas Diajar (Input String -> Array) */}
        <InputField
          label="Kelas Diajar (Pisahkan koma)"
          name="kelasDiajar"
          // Jika data.kelasDiajar adalah Array, gabung jadi string dulu
          defaultValue={data?.kelasDiajar?.join(", ")}
          register={register}
          error={errors.kelasDiajar}
        />

        {/* Upload Foto */}
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="foto"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload Foto</span>
          </label>
          <input 
            type="file" 
            id="foto" 
            {...register("foto")} 
            className="hidden" 
            accept="image/*"
          />
          {errors.foto?.message && (
            <p className="text-xs text-red-400">
              {errors.foto.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition-all">
        {type === "create" ? "Simpan" : "Perbarui"}
      </button>
    </form>
  );
};

export default FormGuru;