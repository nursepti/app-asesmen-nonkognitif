import React from 'react';

// Tipe data props
interface DimensionData {
  label: string;
  nilai: number;    
  maxNilai: number; 
}

interface StudentStatisticsProps {
  skorTotal: number; 
  kategori: string;
  dataDimensi: DimensionData[];
}

const StatistikSiswa = ({ skorTotal, kategori, dataDimensi }: StudentStatisticsProps) => {
  
  // 1. HITUNG TOTAL MAKSIMAL DARI DATA DIMENSI
  // 48 + 24 + 16 + 20 + 40 = 148 (Otomatis)
  const totalMaxScore = dataDimensi.reduce((acc, cur) => acc + cur.maxNilai, 0);

  // --- FUNGSI NORMALISASI (SKALA 1-4) ---
  // Mengubah skor mentah menjadi 0-100% dengan memperhitungkan nilai minimum
  const calculateNormalizedPercent = (val: number, max: number) => {
      if (max === 0) return 0;
      const min = max / 4; // Min adalah 1/4 dari Max (karena skala 1-4)
      const range = max - min;
      
      if (range <= 0) return 0;
      
      const percent = ((val - min) / range) * 100;
      return Math.max(0, Math.min(100, percent)); // Penjagaan agar tetap 0-100
  };

  // --- HITUNG PERSENTASE TOTAL UNTUK DITAMPILKAN DI LINGKARAN ---
  // Ini yang akan muncul di tengah lingkaran (Misal: 75%)
  const totalPercentage = Math.round(calculateNormalizedPercent(skorTotal, totalMaxScore));

  // --- LOGIC WARNA ---
  const getProgressColor = (percent: number) => {
    if (percent >= 75) return "bg-green-500";  // Ideal
    if (percent >= 50) return "bg-blue-500";   // Cukup Ideal
    if (percent >= 25) return "bg-yellow-400"; // Kurang Ideal
    return "bg-red-400";                       // Tidak Ideal
  };

  const getBorderColor = (percent: number) => {
    if (percent >= 75) return "text-green-600";
    if (percent >= 50) return "text-blue-600";
    if (percent >= 25) return "text-yellow-500";
    return "text-red-500";
  };

  // Konfigurasi Lingkaran SVG
  const radius = 56;
  const circumference = 2 * Math.PI * radius; 
  const strokeDashoffset = circumference - (totalPercentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
            <h3 className="text-lg font-bold text-gray-800">Analisis Hasil Asesmen</h3>
            <p className="text-xs text-gray-500">Ringkasan performa non-kognitif terakhir</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        
        {/* BAGIAN 1: GRAFIK LINGKARAN (PERSENTASE) */}
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 text-center gap-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-100" />
                    <circle 
                        cx="64" cy="64" r={radius} 
                        stroke="currentColor" strokeWidth="10" 
                        fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round"
                        className={`transition-all duration-1000 ease-out ${getBorderColor(totalPercentage)}`}
                    />
                </svg>
                
                {/* TEKS TENGAH (Sekarang Menampilkan Persen) */}
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-gray-800">{totalPercentage}%</span>
                    <span className="text-[10px] text-gray-400 font-medium uppercase">Pencapaian</span>
                </div>
            </div>
            
            <div className="mt-2">
                {kategori === "Belum ada data" ? (
                   <span className="px-4 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-500 border border-gray-200">
                      Belum Ada Data
                   </span>
                ) : (
                   <span className={`px-4 py-1 rounded-full text-sm font-bold border ${
                       totalPercentage >= 75 ? 'bg-green-50 text-green-700 border-green-200' : 
                       totalPercentage >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                       'bg-yellow-50 text-yellow-700 border-yellow-200'
                   }`}>
                       {kategori}
                   </span>
                )}
            </div>
        </div>

        {/* BAGIAN 2: PROGRESS BARS (DIMENSI) */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
            {dataDimensi.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                    Belum ada data dimensi yang tersedia.
                </div>
            ) : (
                dataDimensi.map((dimensi, idx) => {
                    // Hitung Persen Per Baris
                    const dimensiPercent = calculateNormalizedPercent(dimensi.nilai, dimensi.maxNilai);
                    
                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                                    {dimensi.label}
                                </span>
                                <span className="text-xs font-bold text-gray-800">
                                    {dimensi.nilai} <span className="text-gray-400 font-normal">/ {dimensi.maxNilai}</span>
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-2.5 rounded-full transition-all duration-700 ease-out ${getProgressColor(dimensiPercent)}`} 
                                    style={{ width: `${dimensiPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>

      </div>
    </div>
  );
};

export default StatistikSiswa;