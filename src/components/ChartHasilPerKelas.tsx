"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import DropdownMenu from "./DropDownMenu";
import { getChartDataByKelas } from "@/lib/actions"; // 1. Import Action

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartHasilPerKelas = ({ initialClasses }: { initialClasses: string[] }) => {
  const [selectedClass, setSelectedClass] = useState(initialClasses[0] || "");
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Gunakan Server Action di dalam useEffect
  useEffect(() => {
    const loadData = async () => {
      if (!selectedClass) return;
      setIsLoading(true);
      
      // Memanggil fungsi dari actions.ts secara langsung
      const data = await getChartDataByKelas(selectedClass); 
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Hasil Asesmen Kelas {selectedClass}</h1>
        <DropdownMenu classes={initialClasses} onSelect={handleSelectClass} />
      </div>

      <div className="h-72 flex items-center justify-center">
        {isLoading ? (
          <p className="text-gray-400 animate-pulse text-sm">Memuat data...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius="95%"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-3">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full mb-1" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <h1 className="font-bold text-sm">{item.value}</h1>
            <h2 className="text-xs text-gray-400 text-center">{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartHasilPerKelas;