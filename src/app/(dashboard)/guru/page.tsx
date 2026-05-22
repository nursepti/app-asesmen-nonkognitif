import Image from "next/image";
import UserCard from "@/components/UserCard";
import ChartHasilPerKelas from "@/components/ChartHasilPerKelas";
import ChartDimensi from "@/components/ChartDimensi";
import HasilAsesmenSiswa from "@/components/HasilAsesmenSiswa";
import EventKalendar from "@/components/EventKalendar";
import NotifikasiPengisian from "@/components/NotifikasiPengisian";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

const GuruPage = async () => {
  const dataKelas = await prisma.asesmenSiswa.findMany({
    distinct: ['snapNamaKelas'],
    select: {
      snapNamaKelas: true,
    },
    where: {
      waktuSelesai: { not: null } // Hanya ambil kelas yang siswanya sudah selesai
    },
    orderBy: {
      snapNamaKelas: 'asc'
    }
  });

  // menyederhanakan menjadi array string: ["8A", "8B", ...]
  const listKelas = dataKelas.map((item) => item.snapNamaKelas);
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">

        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Guru" />
          <UserCard type="Siswa" />
        
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <ChartHasilPerKelas initialClasses={listKelas} />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <ChartDimensi initialClasses={listKelas} />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full">
          <HasilAsesmenSiswa />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventKalendar />
        <NotifikasiPengisian />
        
      </div>
    </div>
  );
};

export default GuruPage;