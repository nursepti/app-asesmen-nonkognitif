import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import {Dimensi, dataDimensi, Indikator, dataIndikator, Pertanyaan, dataPertanyaan, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";


const columns =  [
  {
    header:"No", 
    accessor:"urutan"
  },
  {
    header:"Dimensi", 
    accessor:"nama_dimensi", 
    className:"hidden md:table-cell",
  },
  {
    header:"Indikator",
    accessor:"nama_indikator",
    className:"hidden md:table-cell",
  },
  {
    header:"Pertanyaan", 
    accessor:"teks_pertanyaan", 
  },
  {
    header:"Actions",
    accessor:"action",
  },
 
];

const ListAsesmen = () => {
  const renderRow = (item: Pertanyaan) => (     //custom cell yg berisi info tambahan
    <tr key={item.id_pertanyaan} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.urutan}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.id_dimensi}</td>
      <td className="hidden md:table-cell">{item.id_indikator}</td>
      <td className="hidden md:table-cell">{item.teks_pertanyaan}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/kelas/${item.id_pertanyaan}`}>
            {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button> */}
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="asessmen" type="delete" id={item.id_pertanyaan}/>
              <FormModal table="asessmen" type="update" data={item} id={item.id_pertanyaan}/>
            </>
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-300">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            
            
          )}
        </div>
      </td> 
    </tr>
  );
  



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
            {role === "admin" && (
              <FormModal table="asessmen" type="create" />
            )}
          </div>
        </div>

      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={dataPertanyaan}/>

      {/* PAGINATION */}
      <div className="">
        <Pagination/>

      </div>
    </div>
  )
}

export default ListAsesmen