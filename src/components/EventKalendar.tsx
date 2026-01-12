"use client"

import Image from "next/image";
import { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { acaraKalender } from "@/lib/data"; // Pastikan import ini ada

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventKalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // Menghindari Hydration Error pada Next.js saat menggunakan Date
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. FILTER ACARA BERDASARKAN TANGGAL YANG DIPILIH
  // Kita bandingkan tanggal kalender dengan tanggal di data.ts
  const eventsForSelectedDate = acaraKalender.filter((acara) => {
    if (value instanceof Date) {
      return (
        acara.mulai.getDate() === value.getDate() &&
        acara.mulai.getMonth() === value.getMonth() &&
        acara.mulai.getFullYear() === value.getFullYear()
      );
    }
    return false;
  });

  // Helper untuk format jam (misal: 08:00)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='bg-white p-4 rounded-md shadow-sm border border-gray-100'>
      
      {/* --- KALENDER --- */}
      <Calendar 
        onChange={onChange} 
        value={value} 
        locale="id-ID" // Opsional: Ubah bahasa ke Indonesia
      />

      {/* --- HEADER EVENT --- */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <h1 className="text-lg font-bold text-gray-800">Jadwal Harian</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} className="cursor-pointer opacity-60 hover:opacity-100"/>
      </div>

      {/* --- DAFTAR EVENT (DINAMIS) --- */}
      <div className="flex flex-col gap-4">
        
        {/* Tampilkan pesan jika tidak ada acara */}
        {isMounted && eventsForSelectedDate.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm italic bg-gray-50 rounded-md">
            Tidak ada jadwal di tanggal ini.
          </div>
        )}

        {/* Mapping Data */}
        {eventsForSelectedDate.map((event, index) => (
          <div
            className={`p-4 rounded-md border-2 border-gray-100 border-t-4 shadow-sm transition hover:shadow-md
              ${index % 2 === 0 ? "border-t-blue-400" : "border-t-purple-400"}
            `}
            key={index}
          >
            <div className="flex items-center justify-between mb-1">
              <h1 className="font-bold text-gray-700">{event.judul}</h1>
              <span className="text-gray-400 text-xs font-semibold">
                {formatTime(event.mulai)} - {formatTime(event.selesai)}
              </span>
            </div>
            <p className="mt-1 text-gray-500 text-sm">
                {/* Deskripsi dummy jika di data.ts tidak ada deskripsi */}
                Materi pelajaran dan latihan soal.
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventKalendar