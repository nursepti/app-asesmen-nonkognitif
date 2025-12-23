import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { dataGuru, Guru, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";




const columns =  [
  {
    header:"Info", 
    accessor:"info"
  },
  {
    header:"NUPTK", 
    accessor:"id_guru", 
    className:"hidden md:table-cell",
  },
  {
    header:"Mapel", 
    accessor:"mataPelajaran", 
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

const ListGuru = () => {
  const renderRow = (item: Guru) => (     //custom cell yg berisi info tambahan
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4">
        <Image src={item.foto} alt="" width={40} height={40} className="md: hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.nama}</h3>
          <p className="text-xs text-gray-500">{item?.surel}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.id_guru}</td>
      <td className="hidden md:table-cell">{item.mataPelajaran.join(",")}</td>
      <td className="hidden md:table-cell">{item.kelasDiajar.join(",")}</td>
      <td className="hidden md:table-cell">{item.telepon}</td>
      <td className="hidden md:table-cell">{item.alamat}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/guru/${item.id}`}>
            {/* <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button> */}
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="guru" type="delete" id={item.id} />
           
              <FormModal table="guru" type="update" data={item} id={item.id} />
            </>
            
          )}
        </div>
      </td> 
    </tr>
  );
  



  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between ">
        <h1 className="hidden md:block text-lg font-semibold"> Daftar Guru </h1>
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
              // <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              //  <Image src="/plus.png" alt="" width={14} height={14} />
              // </button> 
              <FormModal table="guru" type="create"/> 
            )}
          </div>
        </div>

      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={dataGuru}/>

      {/* PAGINATION */}
      <div className="">
        <Pagination/>

      </div>
    </div>
  )
}

export default ListGuru