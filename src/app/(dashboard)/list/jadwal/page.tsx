import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import FormModal from "@/components/FormModal";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Guru, Role, Kelas,StatusJadwal, Jadwal, Prisma } from "@prisma-client";
import Link from "next/link";
import Image from "next/image";

type JadwalList = Jadwal & {
  kelas: Kelas;
  guru: Guru;
};

const columns =  [
  {
    header:"Asesmen Kelas", 
    accessor:"namaSesi", 
  },
  {
    header: "Kelas",
    accessor: "namaKelas"
  },
  {
    header:"Tanggal Pelaksanaan", 
    accessor:"tglPelaksanaan", 
  },
  {
    header:"Jam Mulai", 
    accessor:"jamMulai", 
    className:"hidden md:table-cell",
  },
  {
    header:"Jam Selesai", 
    accessor:"jamSelesai", 
    className:"hidden md:table-cell",
  },
    {
    header:"Status", 
    accessor:"status", 
    className:"hidden md:table-cell",
  },
  {
    header:"Actions",
    accessor:"action",
  },
 
];

const renderRow = (item: JadwalList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
    <td className="flex items-center gap-4 p-4">
      <h3 className="font-semibold">{item.namaSesi}</h3>
    </td>

    <td className="hidden md:table-cell capitalize">{item.kelas.namaKelas}</td>
    
    <td className="hidden md:table-cell">
      {new Date(item.tglPelaksanaan).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      })}
    </td>

    
    <td className="hidden md:table-cell">
      {new Date(item.jamMulai).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </td>

    
    <td className="hidden md:table-cell">
      {new Date(item.jamSelesai).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </td>

    {/* Opsional: Capitalize Status (aktif -> Aktif) */}
    <td className="hidden md:table-cell capitalize">{item.status}</td>

    <td>
      <div className="flex items-center gap-2">
        
        {/* <Link href={`/list/jadwal/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
            <Image src="/edit.png" alt="" width={16} height={16} />
          </button>
        </Link> */}
        
        
        {(Role.admin === "admin" || Role.guru === "guru") && (
          <>
            <FormModal table="jadwal" type="delete" id={item.id} />
            <FormModal table="jadwal" type="update" data={item} id={item.id} />
          </>
          
        )}
      </div>
    </td>
  </tr>
);

const ListJadwal = async({
  searchParams
}: {
  searchParams:Promise<{[key:string]: string} | undefined>;
}) => {
  
  const {page, ...queryParams}    =  (await searchParams) || {};
  const p = page ? parseInt(page) : 1;


//URL PARAM CONDITION
  const query: Prisma.JadwalWhereInput = {};

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
             { namaSesi: { contains: value as string, mode: "insensitive" } },
          
          ];
      }
    }
  }
}

  

  // console.log("Parameter:", { page, queryParams });
  const [data,count] = await prisma.$transaction([
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
    }),
    prisma.jadwal.count({ where: query }),
  ]);
  

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
            {(Role.admin === "admin" || Role.guru === "guru") && (
              <>
              <FormModal table="jadwal" type="create" />
              </>
             
              
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

export default ListJadwal