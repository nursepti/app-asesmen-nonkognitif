"use client";

import { useState } from "react";
import Image from "next/image";

interface DropdownProps {
  classes: string[]; // Terima data dari database
  onSelect: (val: string) => void;
}

const DropdownMenu = ({ classes, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="hover:bg-gray-100 p-1 rounded-full">
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20 py-1">
            <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pilih Kelas</p>
            {classes.length > 0 ? (
              classes.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600"
                >
                  Kelas {item}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-gray-400 italic">Belum ada data</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownMenu;