"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Image from "next/image";

const data = [
  { name: 'D1', skor: 3.1 },
  { name: 'D2', skor: 4 },
  { name: 'D3', skor: 2.3 },
  { name: 'D4', skor: 3.5 },
  { name: 'D5', skor: 2.1 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1'];

const DESKRIPSI = {
  D1: 'Kesejahteraan Psikologis dan Sosial Emosional',
  D2: 'Aktivitas Belajar Mandiri',
  D3: 'Kondisi Keluarga',
  D4: 'Latar Belakang Pergaulan',
  D5: 'Gaya Belajar, Karakteristik, dan Minat',
};

const ChartDimensi = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md">
      {/* HEADER */}
      <div className="flex  justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Skor Rata-rata Dimensi di Kelas 8A</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height={270}>
        <BarChart
          data={data}
          barSize={30}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend align="left" verticalAlign="top" wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }} />
          <Bar dataKey="skor" legendType="circle">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      </div>


      {/* LEGEND BAWAH */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-8">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 max-w-full w-full min-w-0 sm:w-auto">
            <div
              className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index] }}
            />
            <h2 className="text-xs text-gray-500 font-bold leading-tight whitespace-normal break-words">{DESKRIPSI[item.name as keyof typeof DESKRIPSI]}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartDimensi;
