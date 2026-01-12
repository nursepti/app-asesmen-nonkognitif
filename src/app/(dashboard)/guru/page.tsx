import Image from "next/image";
import Link from "next/link";
import UserCard from "@/components/UserCard";
import ChartHasilPerKelas from "@/components/ChartHasilPerKelas";
import ChartDimensi from "@/components/ChartDimensi";
import HasilAsesmenSiswa from "@/components/HasilAsesmenSiswa";
import EventKalendar from "@/components/EventKalendar";
import NotifikasiPengisian from "@/components/NotifikasiPengisian";

const GuruPage = () => {
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
            <ChartHasilPerKelas />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <ChartDimensi />
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