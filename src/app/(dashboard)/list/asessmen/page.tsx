import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Dimensi,Indikator,Pertanyaan, Role, Prisma } from "@prisma-client";
import Link from "next/link";
import Image from "next/image";

type PertanyaanList = Pertanyaan & {
  dimensi: Dimensi;
  indikator: Indikator;
};
const columns =  [
  {
    header:"No", 
    accessor:"urutan"
  },
  {
    header:"Pertanyaan", 
    accessor:"teksPertanyaan", 
  },
  {
    header:"Dimensi", 
    accessor:"dimensi.namaDimensi", 
    className:"hidden md:table-cell",
  },
  {
    header:"Indikator",
    accessor:"indikator.namaIndikator",
    className:"hidden md:table-cell",
  },
  
  {
    header:"Actions",
    accessor:"action",
  },
 
];

const renderRow = (item: PertanyaanList) => (     //custom cell yg berisi info tambahan
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.urutan}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teksPertanyaan}</td>
      <td className="hidden md:table-cell">{item.dimensi.namaDimensi}</td>
      <td className="hidden md:table-cell">{item.indikator.namaIndikator}</td>
      

      <td>
        <div className="flex items-center gap-2">
          {/* <Link href={`/list/kelas/${item.id_pertanyaan}`}> */}
            {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button> */}
          {/* </Link> */}
          {Role.admin === "admin" && (
            <>
              <FormModal table="asesmen" type="delete" id={item.id}/>
              <FormModal table="asesmen" type="update" data={item} id={item.id}/>
            </>
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            
            
          )}
        </div>
      </td> 
    </tr>
  );

const ListAsesmen =  async({
  searchParams
}: {
  searchParams:Promise<{[key:string]: string} | undefined>;
}) => {
  
  const {page, ...queryParams}    =  (await searchParams) || {};
  const p = page ? parseInt(page) : 1;


//URL PARAM CONDITION
  const query: Prisma.PertanyaanWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // KASUS 1: Filter berdasarkan Kelas
          case"dimensiId":
          // value ny int
          if (!isNaN(parseInt(value))) {
             query.dimensiId = parseInt(value);
          }
          break;

          case "indikatorId":
           if (!isNaN(parseInt(value))) {
             query.indikatorId = parseInt(value);
           }
           break;
            
            

          // KASUS 2: Pencarian Nama
          case "search":
          console.log("SEARCH INPUT:", value);
          query.OR = [
            {
              teksPertanyaan: {contains: value, mode: "insensitive"}
            },
            {
              dimensi: { namaDimensi: { contains: value, mode: "insensitive" }}
            },
            {
              indikator: { namaIndikator: { contains: value, mode: "insensitive" } }
            },
          ]
  
        }
      }
    }
  }

  

  // console.log("Parameter:", { page, queryParams });
  const [data,count] = await prisma.$transaction([
    prisma.pertanyaan.findMany({
      where: {
        ...query,
      },
      include: {
        dimensi: true,
        indikator:true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.pertanyaan.count({ where: query }),
  ]);
  
  



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold"> Daftar Pertanyaan Asesmen Non Kognitif </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {Role.admin === "admin" && (
              <FormModal table="asesmen" type="create" />
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

export default ListAsesmen