import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
// Import data sesuai export di data.ts kamu
import { 
  dataJadwal, 
  dataKelas, 
  dataGuru, 
  role 
} from "@/lib/data"; 
import Image from "next/image";
import Link from "next/link";

// Definisi Kolom Tabel
const columns = [
  { header: "No", accessor: "no" },
  { header: "Kelas", accessor: "nama_kelas" },
  { header: "Guru", accessor: "nama_guru", className: "hidden md:table-cell" },
  { header: "Jumlah Siswa", accessor: "jumlah_siswa", className: "hidden md:table-cell" },
  { header: "Tanggal Pelaksanaan", accessor: "tgl_pelaksanaan", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ListHasil = () => {

  // --- LOGIKA UTAMA: MENGGABUNGKAN DATA & NOMOR URUT ---
  // Parameter 'index' di sini dimulai dari 0 (0, 1, 2, dst)
  const dataGabungan = dataJadwal.map((jadwal, index) => {
    
    // 1. Cari Data Kelas (cocokkan id di jadwal dengan id di kelas)
    const kelas = dataKelas.find((k) => k.id === jadwal.id_kelas);
    
    // 2. Cari Data Guru (cocokkan id di jadwal dengan id di guru)
    // CATATAN: Di data.ts kamu, value 'id_guru' di const dataJadwal masih kosong/tidak ada. 
    // Pastikan kamu menambahkannya nanti agar nama guru muncul.
    const guru = dataGuru.find((g) => g.id === jadwal.id_guru);

    return {
      id: jadwal.id_jadwal,
      no: index + 1, 
      tgl_pelaksanaan: jadwal.tgl_pelaksanaan,
      nama_kelas: kelas?.namaKelas || "Kelas Tidak Ditemukan",
      jumlah_siswa: kelas?.jumlahMurid || 0,
      nama_guru: guru?.nama || kelas?.waliKelas || "-",
    };
  });

  // --- RENDER ROW ---
  const renderRow = (item: any) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        {/* Disini 'item.no' sudah berisi 1, 2, 3 dst dari logika map diatas */}
        <h3 className="font-semibold">{item.no}</h3>
      </td>
      <td className="">{item.nama_kelas}</td>
      <td className="hidden md:table-cell">{item.nama_guru}</td>
      <td className="hidden md:table-cell">{item.jumlah_siswa}</td>
      <td className="hidden md:table-cell">{item.tgl_pelaksanaan}</td>

      <td>
        <div className="flex items-center gap-2">
          {/* Link Detail */}
          <Link href={`/list/hasil/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {/* Tombol Download */}
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/download.png" alt="" width={16} height={16} />
          </button>
          {/* Tombol Delete (Hanya Admin) */}
          {role === "admin" || role === "guru" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="hasil" type="delete" id={item.id} />
          )}
        </div>
      </td> 
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold"> Daftar Hasil Asesmen Non Kognitif </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kuningBiasa">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-kuningBiasa">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" || role === "guru" && (
              <FormModal table="hasil" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Tabel */}
      <Table columns={columns} renderRow={renderRow} data={dataGabungan}/>

      {/* Pagination */}
      <div className="">
        <Pagination/>
      </div>
    </div>
  )
}

export default ListHasil

// export default ListHasil

// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import TableSearch from "@/components/TableSearch";
// import {dataJadwal, dataKelas, Kelas, Jadwal, dataGuru, Guru, role, hasil, dataHasil } from "@/lib/data";
// import Image from "next/image";
// import Link from "next/link";


// const columns =  [
//   {
//     header:"No", 
//     accessor:"no"
//   },
//   {
//     header:"Kelas", 
//     accessor:"nama_kelas", 

//   },
//   {
//     header:"Guru Pengawas", 
//     accessor:"nama_guru", 
//     className:"hidden md:table-cell",
//   },
//   {
//     header:"Jumlah Siswa", 
//     accessor:"jumlah_siswa", 
//     className:"hidden md:table-cell",
//   },
//     {
//     header:"Tanggal Pelaksanaan", 
//     accessor:"tgl_pelaksanaan", 
//     className:"hidden md:table-cell",
//   },
//   {
//     header:"Actions",
//     accessor:"action",
//   },
 
// ];

// const ListHasil = () => {
//   const renderRow = (item : hasil ) => (     //custom cell yg berisi info tambahan
//     <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
//       <td className="flex items-center gap-4 p-4">
//         <div className="flex flex-col">
//           <h3 className="font-semibold">{item.id}</h3>
//         </div>
//       </td>
//       <td className="hidden md:table-cell">{item.nama_kelas}</td>
//       <td className="hidden md:table-cell">{item.nama_guru}</td>
//       <td className="hidden md:table-cell">{item.jumlah_siswa}</td>
//       <td className="hidden md:table-cell">{item.tgl_pelaksanaan}</td>

//       <td>
//         <div className="flex items-center gap-2">
//           <Link href={`/list/kelas/${item.id}`}>
//             <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
//               <Image src="/view.png" alt="" width={16} height={16} />
//             </button>
//           </Link>
//           <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
//               <Image src="/download.png" alt="" width={16} height={16} />
//           </button>
//           {role === "admin" && (
//             <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300">
//               <Image src="/delete.png" alt="" width={16} height={16} />
//             </button>
            
//           )}
//         </div>
//       </td> 
//     </tr>
//   );
  



//   return (
//     <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//       {/* TOP */}
//       <div className="flex items-center justify-between ">
//         <h1 className="hidden md:block text-lg font-semibold"> Daftar Hasil Asesmen Non Kognitif </h1>
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <TableSearch />
//           <div className="flex items-center gap-4 self-end">
//             <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
//               <Image src="/filter.png" alt="" width={14} height={14} />
//             </button>
//             <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
//               <Image src="/sort.png" alt="" width={14} height={14} />
//             </button>
//             {role === "admin" && (
//               <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
//                <Image src="/plus.png" alt="" width={14} height={14} />
//               </button> 
//             )}
//           </div>
//         </div>

//       </div>
//       {/* LIST */}
//       <Table columns={columns} renderRow={renderRow} data={dataHasil}/>

//       {/* PAGINATION */}
//       <div className="">
//         <Pagination/>

//       </div>
//     </div>
//   )
// }

// export default ListHasil