"use client"
import Image from "next/image";
import Table from "@/components/Table"; // Pastikan path ini sesuai
import Pagination from "@/components/Pagination"; // Pastikan path ini sesuai
import { DetailJawabanItem } from "@/lib/data";

// 1. Definisikan Kolom (Sama seperti gaya ListGuru)
const columns = [
  { 
    header: "No", 
    accessor: "no", 
    className: "w-12 text-center" 
  },
  { 
    header: "Pertanyaan", 
    accessor: "pertanyaan",
    className: "min-w-[200px]"
  },
  { 
    header: "Dimensi", 
    accessor: "dataDimensi", 
    className: "hidden md:table-cell" 
  },
  { 
    header: "Jawaban", 
    accessor: "jawaban_label", 
    className: "text-center"
  },
  { 
    header: "Skor", 
    accessor: "skor", 
    className: "text-center"
  },
];

const LembarKerjaSiswa = ({ 
    data, 
    totalSkor 
}: { 
    data: DetailJawabanItem[], 
    totalSkor: number 
}) => {

  // Helper warna badge (tetap kita butuhkan untuk logika warna)
  const getBadgeColor = (label: string) => {
    switch (label) {
      case 'SS': return 'bg-green-100 text-green-700 border-green-200';
      case 'S': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TS': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'STS': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100';
    }
  };

  // 2. Render Row (Persis gaya ListGuru)
  const renderRow = (item: DetailJawabanItem) => (
    <tr key={item.no} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-biruLangit transition-colors">
      <td className="p-4 text-center text-gray-500">{item.no}</td>
      <td className="p-4">
        <h3 className="font-medium text-gray-800">{item.pertanyaan}</h3>
        {/* Mobile only dimension */}
        <p className="md:hidden text-xs text-gray-400 mt-1">{item.dimensi}</p>
      </td>
      <td className="hidden md:table-cell p-4 text-gray-600 text-sm">{item.dimensi}</td>
      <td className="p-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold border ${getBadgeColor(item.jawaban_label)}`}>
          {item.jawaban_label}
        </span>
      </td>
      <td className="p-4 text-center font-bold text-gray-700">
        {item.skor}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
      
      {/* Header Bagian Kanan */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-700">Lembar Jawaban</h1>
        
        {/* Tombol Download gaya Next Image */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-biruBiasa text-white text-xs hover:opacity-90 transition-opacity">
           <Image src="/download.png" alt="download" width={14} height={14} />
           <span>Unduh PDF</span>
        </button>
      </div>

      {/* Panggil Table Reusable Anda */}
      <div className="flex-1 overflow-auto">
          <Table 
            columns={columns} 
            renderRow={renderRow} 
            data={data} 
          />
      </div>

      {/* Footer Total Skor */}
      <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-500">Total Skor Akhir:</span>
          <span className="text-xl font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded border border-indigo-100">
            {totalSkor}
          </span>
      </div>

      
    </div>
  );
};

export default LembarKerjaSiswa;