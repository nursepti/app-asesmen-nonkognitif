"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import Image from "next/image";

const data = [
  { name: "Ideal", value: 15 },
  { name: "Cukup Ideal", value: 7 },
  { name: "Kurang Ideal", value: 5 },
  { name: "Tidak Ideal", value: 3 },
];

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartHasilPerKelas = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Hasil Asesmen Kelas 8A</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="h-72 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="95%"
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ LEGEND BAWAH FLEX 2-KOLOM */}
      <div className="flex justify-center gap-6 mt-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex flex-col items-center">
            <div
              className="w-5 h-5 rounded-full mb-1"
              style={{ backgroundColor: COLORS[index] }}
            />
            <h1 className="font-bold text-sm">{item.value}</h1>
            <h2 className="text-xs text-gray-400 text-center">{item.name}</h2>
            
          </div>
        ))}
      </div>
    </div>
  );
};


export default ChartHasilPerKelas;
