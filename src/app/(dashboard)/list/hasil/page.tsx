import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Jadwal,Kelas, Guru,  Role, Prisma } from "@prisma-client";
import Link from "next/link";
import Image from "next/image";

// 1. DEFINISI TIPE DATA
type HasilList = Jadwal & {
  kelas: Kelas; 
  guru: Guru;
  noUrut?: number;
};

// Definisi Kolom Tabel
const columns = [
  { header: "No", accessor: "no" },
  { header: "Kelas", accessor: "kelas.namaKelas" },
  { header: "Guru", accessor: "guru.namaGuru", className: "hidden md:table-cell" },
  { header: "Jumlah Siswa", accessor: "kelas.jumlahSiswa", className: "hidden md:table-cell" },
  { header: "Tanggal Pelaksanaan", accessor: "tgl.Pelaksanaan", className: "hidden md:table-cell" },
  { header: "Status", accessor: "status", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];



  const renderRow = (item: HasilList ) => (
    
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        {/* Disini 'item.no' sudah berisi 1, 2, 3 dst dari logika map diatas */}
        <h3 className="font-semibold">{item.noUrut}</h3>
      </td>
      <td className="">{item.kelas.namaKelas}</td>
      <td className="hidden md:table-cell">{item.guru.namaGuru}</td>
      <td className="hidden md:table-cell">{item.kelas.jumlahSiswa}</td>
      <td className="hidden md:table-cell">{new Date(item.tglPelaksanaan).toLocaleDateString("id-ID",{dateStyle:"long"})}</td>
      <td className="hidden md:table-cell">{item.status}</td>

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
          {Role.admin === "admin" || Role.guru === "guru" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="hasil" type="delete" id={item.id} />
          )}
        </div>
      </td> 
    </tr>
  );

const ListHasil = async({
  searchParams
}: {
  searchParams:Promise<{[key:string]: string} | undefined>;
}) => {
  
  const {page, ...queryParams}    =  (await searchParams) || {};
  const p = page ? parseInt(page) : 1;


//URL PARAM CONDITION
  const query: Prisma.JadwalWhereInput = {};
  query.status = "selesai";

if (queryParams) {
  for (const [key, value] of Object.entries(queryParams)) {
    // Pastikan value ada isinya
    if (value !== undefined && value !== "") {
      switch (key) {
        
        // --- KASUS 1: Filter Dropdown (Kelas & Guru) ---
        
        case "kelasId":
          // HAPUS parseInt() karena tipe di schema adalah String @db.Uuid
          query.kelasId = value as string;
          break;

        case "guruId":
          // HAPUS parseInt() karena tipe di schema adalah String @db.Uuid
          query.guruId = value as string;
          break;

        // --- KASUS 2: Pencarian (Search Bar) ---
        
    case "search":
          
          const searchConditions: any[] = [
             { namaKelas: { contains: value as string, mode: "insensitive" } },
          
          ];
      }
    }
  }
}

  // console.log("Parameter:", { page, queryParams });
  const [dataRaw,count] = await prisma.$transaction([
    prisma.jadwal.findMany({
      where: {
        ...query,
      },
      include: {
        kelas: true,
        guru:true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy:{tglPelaksanaan: 'desc'}
    }),
    prisma.jadwal.count({ where: query }),
  ]);

  const data = dataRaw.map((item, index) => ({
    ...item,
    noUrut: (p - 1) * ITEM_PER_PAGE + (index + 1)
  }));
 return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold"> Jadwal Pelaksanaan</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {Role.admin === "admin" || Role.guru === "guru" && (
              // <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              //  <Image src="/plus.png" alt="" width={14} height={14} />
              // </button> 
              <FormModal table="jadwal" type="create" />
            )}
          </div>
        </div>

      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data}/>

      {/* PAGINATION */}
      <div className="">
        <Pagination page={p} count={count}/>

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