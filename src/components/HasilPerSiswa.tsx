
import React from 'react';

// Definisikan tipe struktur JSON yang disimpan di database
interface DetailItem {
  id_pertanyaan: number;
  pertanyaan: string; // teks pertanyaan
  skor: number;       // nilai 1-4
  dimensi: string;    // nama dimensi
}

const HasilPerSiswa = ({ data }: { data: any }) => {
  // Parsing data jika perlu, atau casting tipe
  const listJawaban = (data as DetailItem[]) || [];

  if (listJawaban.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
        <p className="text-gray-400 font-medium">Data detail jawaban tidak tersedia.</p>
      </div>
    );
  }

  // Helper Label & Warna
  const getLabel = (skor: number) => {
    if (skor === 4) return { text: "Sangat Sesuai", color: "bg-blue-100 text-blue-700 border-blue-200" };
    if (skor === 3) return { text: "Sesuai", color: "bg-green-100 text-green-700 border-green-200" };
    if (skor === 2) return { text: "Kurang Sesuai", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    return { text: "Tidak Sesuai", color: "bg-red-100 text-red-700 border-red-200" };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Lembar Jawaban Siswa</h3>
        <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
          Total: {listJawaban.length} Soal
        </span>
      </div>
      
      <div className="max-h-[800px] overflow-y-auto p-6 space-y-4">
        {listJawaban.map((item, idx) => {
          const style = getLabel(item.skor);
          
          return (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-100 hover:border-blue-300 transition-colors">
              {/* Nomor & Dimensi */}
              <div className="sm:w-12 flex flex-col items-center justify-start gap-1">
                <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>
              </div>

              {/* Teks Pertanyaan */}
              <div className="flex-1">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1 block">
                  {item.dimensi}
                </span>
                <p className="text-gray-800 font-medium leading-relaxed text-sm md:text-base">
                  {item.pertanyaan}
                </p>
              </div>

              {/* Jawaban Siswa */}
              <div className="sm:w-40 flex-shrink-0">
                <div className={`px-3 py-2 rounded-lg border text-center text-xs font-bold ${style.color}`}>
                  {style.text}
                  <div className="mt-1 text-[10px] opacity-70">Poin: {item.skor}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HasilPerSiswa;