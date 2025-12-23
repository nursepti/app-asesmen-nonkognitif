import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { dataJadwal, Jadwal, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";



const columns =  [
  {
    header:"Asesmen Kelas", 
    accessor:"nama_sesi", 
  },
  {
    header:"Tanggal Pelaksanaan", 
    accessor:"tgl_pelaksanaan", 
  },
  {
    header:"Jam Mulai", 
    accessor:"jam_mulai", 
    className:"hidden md:table-cell",
  },
  {
    header:"Jam Selesai", 
    accessor:"jam_selesai", 
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

const ListJadwal = () => {
  const renderRow = (item: Jadwal) => (     //custom cell yg berisi info tambahan
    <tr key={item.id_jadwal} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit">
      <td className="flex items-center gap-4 p-4"> 
        <h3 className="font-semibold">{item.nama_sesi}</h3>
      </td>
      <td className="hidden md:table-cell">{item.tgl_pelaksanaan}</td>
      <td className="hidden md:table-cell">{item.jam_mulai}</td>
      <td className="hidden md:table-cell">{item.jam_selesai}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/guru/${item.id_jadwal}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-biruBiasa">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" || role === "guru" && (
            <FormModal table="jadwal" type="delete" id={item.id_jadwal} />
          )}
        </div>
      </td> 
    </tr>
  );
  



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
            {role === "admin" || role === "guru" && (
              // <button className="w-8 h-8 items-center justify-items-center rounded-full bg-kuningBiasa">
              //  <Image src="/plus.png" alt="" width={14} height={14} />
              // </button> 
              <FormModal table="jadwal" type="create" />
            )}
          </div>
        </div>

      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={dataJadwal}/>

      {/* PAGINATION */}
      <div className="">
        <Pagination/>

      </div>
    </div>
  )
}

export default ListJadwal