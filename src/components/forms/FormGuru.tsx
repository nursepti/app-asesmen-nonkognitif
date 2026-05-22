"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {  z } from "zod";
import { GuruSchema, guruSchema } from "@/lib/FormValidationSchemas";
import { createGuru, updateGuru} from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

// Definisikan tipe struktur objek Kelas yang diterima dari database
interface KelasItem {
  id: string;
  namaKelas: string;
  tahunAjaran: string;
}


type Inputs = z.infer<typeof guruSchema>;

const FormGuru = ({
  type,
  data,
  daftarKelas = [],
  setOpen,
}: {
  type: "create" | "update";
  data?: any;
  daftarKelas: KelasItem[];
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuruSchema>({
    resolver: zodResolver(guruSchema),
    defaultValues: {
      username: data?.username || "",
      password: type === "update" ? "BypassPassword123!" : "",
      nama: data?.namaGuru || "",
      email: data?.email || "",
      nip: data?.nip || "",
      telepon: data?.noTelepon || "",
      alamat: data?.alamat || "",
      mataPelajaran: Array.isArray(data?.mapel) 
    ? data?.mapel.join(", ") 
    : (data?.mapel || ""),
      kelasDiajar: data?.kelasAjar?.map((k: any) => k.id) || [],
      foto: data?.foto || "",
    },
  });

  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData);

    const res =
      type === "create"
        ? await createGuru(formData)
        : await updateGuru(data.id, formData);

    if (res.success) {
      toast.success(
        `Data Guru berhasil ${
          type === "create" ? "disimpan" : "diupdate"
        }!`
      );

      setSuccess(true);
      setOpen(false);
      router.refresh();

    } else {
      toast.error(res.message || "Gagal saat menyimpan data guru.");
    }
  });

   useEffect(() => {
      if(success) {
         router.push('/list/guru');
      };
    }, [success, router]);  

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Tambah Guru Baru" : "Edit Data Guru"}
      </h1>
      
      {/* --- Authentication Information --- */}
      <span className="text-xs text-gray-400 font-medium">
        Informasi Autentikasi
      </span>
      <div className="flex justify-start flex-wrap gap-16">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
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
      <div className="flex justify-between flex-wrap gap-8">
        <InputField
          label="Nama Lengkap"
          name="nama"
          defaultValue={data?.nama}
          register={register}
          error={errors.nama}
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
          label="Nomor Telepon"
          name="telepon"
          defaultValue={data?.telepon}
          register={register}
          error={errors.telepon}
        />
        <InputField
          label="NIP"
          name="nip"
          defaultValue={data?.nip}
          register={register}
          error={errors.nip}
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
          label="Mata Pelajaran"
          name="mataPelajaran"
          defaultValue={data?.mataPelajaran?.join(", ")} 
          register={register}
          error={errors.mataPelajaran}
        />

        {/* checkbox untuk kelas diajar */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm font-medium text-gray-700">
            Kelas Diajar (Bisa dikosongkan dulu & diisi nanti saat Edit)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50 max-h-40 overflow-y-auto">
            {daftarKelas.map((kelas) => (
              <label key={kelas.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  value={kelas.id}
                  {...register("kelasDiajar")} // Jika kosong, react-hook-form otomatis mengirim []
                  className="w-4 h-4 rounded text-blue-500 border-gray-300"
                />
                <span>{kelas.namaKelas} <span className="text-xs text-gray-400">({kelas.tahunAjaran})</span></span>
              </label>
            ))}
          </div>
        </div>

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