"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {  z } from "zod";
import { kelasSchema } from "@/lib/FormValidationSchemas";
import { FieldError } from "react-hook-form";
import { createKelas, updateKelas } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const FormKelas = ({
  type,
  data,
  guru=[],
  setOpen, 
}: {
  type: "create" | "update";
  data?: any;
  guru: { id: string; namaGuru: string }[]; 
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
  z.input<typeof kelasSchema>,
  any,
  z.output<typeof kelasSchema>
>({
  resolver: zodResolver(kelasSchema),
  defaultValues: {
    namaKelas: data?.namaKelas || "",
    waliKelasId: data?.waliKelasId || "",
    tahunAjaran: data?.tahunAjaran || "",
    jumlahSiswa: data?.jumlahSiswa || 0,
  },
});

  
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async(formData) => {
    console.log(formData);
    const res = 
      type === "create"
      ? await createKelas(formData)
      : await updateKelas(data?.id, formData);
    console.log(res);
    if (res.success) {
      toast.success(
        `Data kelas berhasil ${
        type === "create" ? "disimpan" : "diupdate"
      }!`
    );
      setSuccess(true);
      setOpen(false);
    } else {
      toast.error(res.message || "gagal saat menyimpan data kelas.");
    }
  });

  useEffect(() => {
    if(success) {

       router.push('/list/kelas');
    }
  }, [success, router, type]);

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Tambah Data Kelas" : "Edit Data Kelas"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Informasi Kelas
      </span>
      
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nama Kelas"
          name="namaKelas"
          defaultValue={data?.namaKelas}
          register={register}
          error={errors?.namaKelas}
        />
        
        <InputField
          label="Tahun Ajaran"
          name="tahunAjaran"
          defaultValue={data?.tahunAjaran}
          register={register}
          error={errors?.tahunAjaran}
        />
         <InputField
          label="Jumlah Siswa"
          name="jumlahSiswa"
          defaultValue={data?.jumlahSiswa}
          register={register}
          error={errors.jumlahSiswa as FieldError}
        />
        

        {/* --- Dropdown Wali Kelas --- */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Wali Kelas</label>
          <select
            {...register("waliKelasId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full outline-blue-400"
            defaultValue={data?.waliKelasId || ""}
          >
            <option value="" disabled>Pilih Guru</option>
            {guru?.map((g) => (
              <option key={g.id} value={g.id}>
                {g.namaGuru}
              </option>
            ))}
          </select>
          {errors.waliKelasId?.message && (
            <p className="text-xs text-red-400">
              {errors.waliKelasId.message.toString()}
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

export default FormKelas;