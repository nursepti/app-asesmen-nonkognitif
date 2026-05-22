"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react"; 
import { deleteKelas, deleteGuru } from "@/lib/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";



const FormGurus = dynamic(() => import("./forms/FormGuru"), {
  loading: () => <h1>Loading...</h1>,
});
const FormKelas = dynamic(() => import("./forms/FormKelas"), {
  loading: () => <h1>Loading...</h1>,
});


const forms: {
  [key: string]: (setOpen:Dispatch<SetStateAction<boolean>>, type: "create" | "update", data?: any, relatedData?: any) => JSX.Element;
} = {
  guru: (setOpen, type, data, relatedData) => <FormGurus type={type} data={data} daftarKelas={relatedData?.kelas || []} setOpen={setOpen} />,
  kelas: (setOpen, type, data, relatedData) => <FormKelas   type={type} data={data} guru={relatedData?.guru} setOpen={setOpen} />,

};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: {
  table:
    | "guru"
    | "siswa"
    | "kelas"
    | "asesmen"
    | "jadwal"
    | "hasil";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  relatedData?: any; // Tambahkan prop ini untuk data terkait seperti daftar guru
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-kuningBiasa"
      : type === "update"
      ? "bg-biruBiasa"
      : "bg-red-300";

  const [open, setOpen] = useState(false);

  const Form = () => {
    
    const router = useRouter();
    const handleDelete = async () => {
      let res: { success: boolean; message?: string } = { success: false, message: "Aksi tidak dikenali." };
      if (table === "kelas") {
        res = await deleteKelas(id as string);
      } else if (table === "guru") {
        res = await deleteGuru(id as string);
      }
      if (res.success) {
        toast.success(`Data ${table} berhasil dihapus!`);
        setOpen(false);
        router.push(`/list/${table}`);
        router.refresh();
      }else{
        toast.error(res.message || "gagal saat menghapus data kelas.");
      }
  };

  
  


  return type === "delete" && id ? (
    <form
      className="p-4 flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleDelete();
      }}
    >
      <span className="text-center font-medium">
        Semua data akan dihapus. Yakin ingin menghapus data {table} ini?
      </span>

      <button
        type="submit"
        className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
      >
        Delete
      </button>
    </form>
  ) : type === "create" || type === "update" ? (
    forms[table](setOpen, type, data, relatedData)
  ) : (
    "Form not found!"
  );
};

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;