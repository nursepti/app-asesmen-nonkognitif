"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Image from "next/image";
import DropdownMenu from "./DropDownMenu";
import { getChartDimensiByKelas } from "@/lib/actions";

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1'];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#8dd1e1"];

const DESKRIPSI = {
  D1: "Kesejahteraan Psikologis dan Sosial Emosional",
  D2: "Aktivitas Belajar Mandiri",
  D3: "Kondisi Keluarga",
  D4: "Latar Belakang Pergaulan",
  D5: "Gaya Belajar, Karakteristik, dan Minat",
};

interface ChartDimensiProps {
  initialClasses: string[];
}

const ChartDimensi = ({ initialClasses }: ChartDimensiProps) => {
  const [selectedClass, setSelectedClass] = useState(initialClasses[0] || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedClass) return;
      setIsLoading(true);
      
      // Memanggil Server Action untuk mendapatkan data persentase rata-rata
      const data = await getChartDimensiByKelas(selectedClass);
      setChartData(data);
      
      setIsLoading(false);
    };
    loadData();
  }, [selectedClass]);

  const handleSelectClass = (kelas: string) => {
    setSelectedClass(kelas);
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">
          Rata-rata Persentase Dimensi Kelas {selectedClass}
        </h1>
        {/* Dropdown yang menerima data list kelas dari Server Component*/}
        <DropdownMenu classes={initialClasses} onSelect={handleSelectClass} />
      </div>

      {/* CHART */}
      <div className="h-64 flex items-center justify-center relative">
        {isLoading ? (
          <p className="text-gray-400 animate-pulse text-sm">Memuat data...</p>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={chartData}
              barSize={30}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tick={{ fill: "#d1d5db" }} 
                tickLine={false} 
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#d1d5db" }}
                tickLine={false}
                domain={[0, 100]} // Mengunci skala maksimal 100%
                ticks={[20, 40, 60, 80, 100]} // Menampilkan 5 poin skala persentase
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
                // Perbaikan: Tambahkan pengecekan atau definisikan tipe parameter secara opsional
                formatter={(value: number | string | undefined) => {
                  const numericValue = typeof value === 'number' ? value : 0;
                  return [`${numericValue}%`, "Ketercapaian"];
                }}
              />
              <Legend
                align="left"
                verticalAlign="top"
                wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
              />
              <Bar dataKey="skor" legendType="circle" radius={[5, 5, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm italic">Data tidak tersedia</p>
        )}
      </div>

      {/* LEGEND BAWAH (DESKRIPSI DIMENSI) */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-8">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 max-w-full w-full min-w-0 sm:w-auto"
          >
            <div
              className="w-5 h-5 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <h2 className="text-xs text-gray-500 font-bold leading-tight whitespace-normal break-words">
              {DESKRIPSI[item.name as keyof typeof DESKRIPSI]}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartDimensi;