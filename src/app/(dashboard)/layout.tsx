import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as string;
  const isSiswa = role === "siswa";

  return (
    <div className="h-screen flex">
      {/* LEFT */}
  
      {!isSiswa ? (
        <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <span className="hidden lg:block font-bold">SMAN 1</span>
          </Link>
          <Menu />
        </div>
      ) : null} 
      
      {/* Right */}
      <div
        className={`bg-[#F7F8FA] overflow-scroll flex flex-col ${
          // 👇 Logika Width: Jika siswa = full, Jika bukan = 86%
          isSiswa ? "w-full" : "w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]"
        }`}
      >
        <Navbar />
        {children}
      </div>
    </div>
  );
}