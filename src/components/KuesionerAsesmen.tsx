"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitAssessment } from "@/lib/actions"; 
import type { Pertanyaan, Dimensi, Indikator } from "@prisma-client"; 

// 1. Definisikan tipe data gabungan
type PertanyaanLengkap = Pertanyaan & {
  dimensi: Dimensi;
  indikator: Indikator;
};

// 2. Definisikan Props
type Props = {
  questions: PertanyaanLengkap[];
  jadwalId: string;
  siswaId: string;
};

const KuesionerAsesmen: React.FC<Props> = ({ questions, jadwalId, siswaId }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [waktuMulai] = useState<Date>(new Date());

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  // --- PENGAMAN DATA KOSONG ---
  // Mencegah crash jika questions undefined/null
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p className="font-bold text-lg">Soal Belum Tersedia</p>
        <p className="text-sm">Silakan hubungi admin sekolah.</p>
      </div>
    );
  }

  // Ambil soal saat ini
  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  // --- HANDLERS ---
  const handleAnswer = (val: number) => {
    if (currentQ) {
        setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const result = await submitAssessment(jadwalId, siswaId, answers, waktuMulai);
        if (result.success) {
          router.push("/siswa"); 
        } else {
          alert("Gagal menyimpan jawaban: " + result.error);
        }
      } catch (error) {
        alert("Terjadi kesalahan jaringan.");
      }
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  // --- RENDER ---
  
  // Pengaman Index (Jaga-jaga error array)
  if (!currentQ) return <div className="p-6 text-center">Memuat soal...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
      {/* Header: Info Dimensi */}
      {/* <div className="mb-6 bg-blue-50 px-4 py-3 rounded-lg border-l-4 border-blue-500">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {currentQ.dimensi?.namaDimensi || "Dimensi"}
        </div> */}
        {/* <div className="text-sm font-semibold text-gray-800 mt-1">
          {currentQ.indikator?.namaIndikator || "Indikator"}
        </div> */}
      {/* </div> */}

      {/* Soal */}
      <div className="flex-grow flex items-center justify-center py-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center leading-relaxed">
          {currentQ.teksPertanyaan}
        </h2>
      </div>

      {/* Pilihan Jawaban */}
      <div className="space-y-3 mt-6 max-w-2xl mx-auto w-full">
        {[
          { val: 4, label: "Sangat Sesuai (SS)" },
          { val: 3, label: "Sesuai (S)" },
          { val: 2, label: "Kurang Sesuai (KS)" },
          { val: 1, label: "Tidak Sesuai (TS)" },
        ].map((opt) => {
          const isSelected = answers[currentQ.id] === opt.val;
          return (
            <button
              key={opt.val}
              onClick={() => handleAnswer(opt.val)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 group flex justify-between items-center ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.01]"
                  : "bg-white border-gray-200 hover:bg-slate-50 text-gray-700"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {isSelected && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Navigasi */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Kembali
        </button>

        <div className="text-sm font-medium text-gray-400">
          Soal <span className="text-blue-600 font-bold">{currentIdx + 1}</span> / {questions.length}
        </div>

        {isLast ? (
          <button
            onClick={handleSubmit}
            disabled={isPending || answers[currentQ.id] === undefined}
            className="px-8 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isPending ? "Menyimpan..." : "Selesai & Kirim"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            className="px-8 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            Lanjut
          </button>
        )}
      </div>
    </div>
  );
};

export default KuesionerAsesmen;