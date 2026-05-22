import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Guru, Role, Kelas, Prisma } from "@prisma-client";
import Link from "next/link";
import Image from "next/image";

type KelasList = Kelas & {waliKelas: Guru};
const columns =  [
  {
    header:"Wali Kelas", 
    accessor:"waliKelas"
  },
  {
    header:"Kelas", 
    accessor:"namaKelas", 
    className:"hidden md:table-cell w-32 ",
  },
  {
    header:"Tahun Ajaran", 
    accessor:"tahunAjaran"
  },
  
  {
    header:"Jumlah", 
    accessor:"jumlahSiswa", 
    className:"hidden md:table-cell w-32 ",
  },
  {
    header:"Actions",
    accessor:"action",
  },
 
];



const renderRow = (item:KelasList, guru: any[]) => (     //custom cell yg berisi info tambahan
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.waliKelas.namaGuru}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell ">{item.namaKelas}</td>
      <td className="hidden md:table-cell ">{item.tahunAjaran}</td>
      <td className="hidden md:table-cell ">{item.jumlahSiswa}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/kelas/${item.id}`}>
            {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button> */}
          </Link>
          {Role.admin === "admin" && (
            <>
            {/* // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button> */}
            <FormModal table="kelas" type="delete" id={item.id}/>
            <FormModal table="kelas" type="update" data={item} id={item.id} relatedData={{ guru }} />
            </>
         
          )}
        </div>
      </td> 
    </tr>
  );
const ListKelas =  async({
  searchParams
}: {
  searchParams:Promise<{[key:string]: string} | undefined>;
}) => {
  
  const {page, ...queryParams}    =  (await searchParams) || {};
  const p = page ? parseInt(page) : 1;


//URL PARAM CONDITION
  const query: Prisma.KelasWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // KASUS 1: Filter berdasarkan Kelas
          case"waliKelasId":
          case "namaKelas":
            const valueWithSpace = value.replace(/([a-zA-Z])(?=\d)/, '$1 ');
            query.waliKelas = { //berdasarkan field relasi di schema
                 namaGuru:{
                  contains: valueWithSpace,
                  mode: "insensitive",
                 }
              
            };
            break;
            

          // KASUS 2: Pencarian Nama
          case "search":
          console.log("SEARCH INPUT:", value);
          const isAngka = !isNaN(parseInt(value));
          // const valueDenganSpsasi = value.replace(/([a-zA-Z])(?=\d)/, '$1 ');
            // Ganti 'name' menjadi 'nama' sesuai database Anda
            query.OR = [
              {
                namaKelas: {
                  contains: value, mode: "insensitive"}
              },
             { 
                waliKelas: { 
                  namaGuru: { contains: value, mode: "insensitive" } 
                } 
              },
              { 
                tahunAjaran: { 
                  contains: value, mode: "insensitive" } 
              }
            ]
            if (isAngka) {
              query.OR.push({
                jumlahSiswa: { equals: parseInt(value) }
              });
            }
            break;

          default:
            break;
        }
      }
    }
  }
  

  // console.log("Parameter:", { page, queryParams });
  const [data,count] = await prisma.$transaction([
    prisma.kelas.findMany({
      where: {
        ...query,
      },
      include: {
        waliKelas: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.kelas.count({ where: query }),
  ]);

  const daftarGuru = await prisma.guru.findMany({
      select: {
        id: true,
        namaGuru: true,
      },
  });
  

  



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold"> Daftar Kelas </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button> */}
            <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {Role.admin === "admin" && (
              // <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              //  <Image src="/plus.png" alt="" width={14} height={14} />
              // </button> 
              <FormModal table="kelas" type="create" relatedData={{guru:daftarGuru}} />
            )}
          </div>
        </div>

      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={(item) => renderRow(item, daftarGuru)} data={data}/>

      {/* PAGINATION */}
      <div className="">
        <Pagination page={p} count={count}/>

      </div>
    </div>
  )
}

export default ListKelas