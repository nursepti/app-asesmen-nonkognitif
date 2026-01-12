import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Siswa, Role, Kelas, Prisma } from "@prisma-client";
import Link from "next/link";
import Image from "next/image";


export type SiswaList = Siswa & { kelas: Kelas; };

const columns =  [
  {
    header:"Info", 
    accessor:"info"
  },
  {
    header:"NIS", 
    accessor:"nisn", 
    className:"hidden md:table-cell",
  },
    {
    header:"Kelas", 
    accessor:"kelas", 
    className:"hidden md:table-cell",
  },

  {
    header:"No. Telp", 
    accessor:"telepon", 
    className:"hidden md:table-cell",
  },
  {
    header:"Alamat", 
    accessor:"alamat", 
    className:"hidden md:table-cell",
  },
  {
    header:"Actions",
    accessor:"action",
  },
 
];

  const renderRow = (item:SiswaList) => (     //custom cell yg berisi info tambahan
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.foto || "/noAvatar.png"} alt="" width={40} height={40} className="md: hidden xl:block w-10 h-10 rounded-full object-cover"
         />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.namaSiswa}</h3>
          {/* <p className="text-xs text-gray-500">{item?.email}</p> */}
        </div>
      </td>
      <td className="hidden md:table-cell">{item.nisn}</td>
      <td className="hidden md:table-cell">{item.kelas.namaKelas}</td>
      <td className="hidden md:table-cell">{item.telepon}</td>
      <td className="hidden md:table-cell">{item.alamat}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/siswa/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {(Role.admin === "admin" || Role.guru === "guru") && (
            <>
              <FormModal table="siswa" type="update" data={item} id={item.id}/>
              <FormModal table="siswa" type="delete" id={item.id}/>
            
            </>
          )}
        </div>
      </td> 
    </tr>
  );
const ListSiswa = async({
  searchParams
}: {
  searchParams:Promise<{[key:string]: string} | undefined>;
}) => {
  
  const {page, ...queryParams}    =  (await searchParams) || {};
  const p = page ? parseInt(page) : 1;


//URL PARAM CONDITION
  const query: Prisma.SiswaWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          // KASUS 1: Filter berdasarkan Kelas
          case"kelasId":
          case "kelasAjar":
            const valueWithSpace = value.replace(/([a-zA-Z])(?=\d)/, '$1 ');
            query.kelas = { //berdasarkan field relasi di schema
                 namaKelas:{
                  contains: valueWithSpace,
                  mode: "insensitive",
                 }
              
            };
            break;
            

          // KASUS 2: Pencarian Nama
          case "search":
          console.log("SEARCH INPUT:", value);
          // const valueDenganSpsasi = value.replace(/([a-zA-Z])(?=\d)/, '$1 ');
            // Ganti 'name' menjadi 'nama' sesuai database Anda
            query.OR = [
              {
                namaSiswa: {
                  contains: value, mode: "insensitive"}
              },
              {
                nisn: {
                  contains: value, mode: "insensitive"}
              },
              {
                alamat: {
                  contains: value, mode: "insensitive"}
              },
              {
                kelas: {
                  namaKelas: {
                    contains: value, mode: "insensitive"}
                }
              }
            ]


            // query.nisn = {
            //   contains: value, mode: "insensitive"
            // };
          // case "filterKelas":
          //   query.kelas = {
          //     namaKelas: {
          //       contains: value, mode: "insensitive"
          //     }
          //   };
          //   break;
            
          default:
            break;
        }
      }
    }
  }
  

  // console.log("Parameter:", { page, queryParams });
  const [data,count] = await prisma.$transaction([
    prisma.siswa.findMany({
      where: {
        ...query,
      },
      include: {
        kelas: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.siswa.count({ where: query }),
  ]);
  

  // console.log(Guru);

  



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold"> Daftar Siswa </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flexitems-center justify-items-center rounded-full bg-kuningBiasa">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {Role.admin === "admin" && (
              //   <button className="w-8 h-8 flexitems-center justify-items-center rounded-full bg-kuningBiasa">
              //    <Image src="/plus.png" alt="" width={14} height={14} />
              //  </button>
              <FormModal table="siswa" type="create"/>
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

export default ListSiswa