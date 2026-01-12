import Link from "next/link";
import Image from "next/image";
import {Role, Prisma} from '@prisma-client';
import { currentUser } from "@clerk/nextjs/server";


const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home", 
        href: "/",
        visible: ["admin", "guru"],
      },
      {
        icon: "/guru.png",
        label: "Guru",
        href: "/list/guru",
        visible: ["admin"],
      },
      {
        icon: "/murid.png",
        label: "Siswa", 
        href: "/list/siswa",
        visible: ["admin", "guru"],
      },
      {
        icon: "/class.png",
        label: "Kelas", 
        href: "/list/kelas",
        visible: ["admin", "guru"],
      },
      {
        icon: "/exam.png",
        label: "Asessmen",  
        href: "/list/asessmen",
        visible: ["admin", "guru"],
      },
      {
        icon: "/result.png",
        label: "Hasil Nilai",  
        href: "/list/hasil",
        visible: ["admin", "guru"],
      },

      {
        icon: "/calendar.png",
        label: "Jadwal", 
        href: "/list/jadwal",
        visible: ["admin", "guru"],
      },
            {
        icon: "/message.png",
        label: "Pesan",  
        href: "/list/messages",
        visible: ["admin", "guru"],
      },
    ],
  },
  {
    title: "LAINNYA", 
    items: [
      {
        icon: "/profile.png",
        label: "Profil", 
        href: "/profile",
        visible: ["admin", "guru", "siswa"],
      },
      {
        icon: "/setting.png",
        label: "Settings", 
        href: "/settings",
        visible: ["admin", "guru", "siswa"],
      },
      {
        icon: "/logout.png",
        label: "logout", 
        href: "/logout",
        visible: ["admin", "guru", "murid"],
      },
    ],
  },
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  console.log("DATA USER CLERK:", user?.publicMetadata);
  console.log("ROLE YANG DIBACA:", role);
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;


