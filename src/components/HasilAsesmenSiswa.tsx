import Image from "next/image";

interface DataAsesmen {
  nama: string;
  kelas: string;
  skor: number;
  keterangan: string;
}


// Dummy data untuk contoh tampilan
const dataAsesmen: DataAsesmen[] = [
  {
    nama: "Budi Santoso",
    kelas: "VIII A",
    skor: 92, 
    keterangan: "Ideal",
  },
  {
    nama: "Citra Dewi",
    kelas: "VIII A",
    skor: 78,
    keterangan: "Cukup Ideal",
  },
  {
    nama: "Agus Pratama",
    kelas: "VIII A",
    skor: 55,
    keterangan: "Tidak Ideal",
  },
  {
    nama: "Dewi Lestari",
    kelas: "VIII A",
    skor: 88,
    keterangan: "Ideal",
  },
];

const HasilAsesmenSiswa = () => {
  // Fungsi helper untuk menentukan warna berdasarkan keterangan
  const getKeteranganClass = (keterangan:string) => {
    switch (keterangan) {
      case "Ideal":
        return "bg-green-100 text-green-700";
      case "Cukup Ideal":
        return "bg-yellow-100 text-yellow-700";
      case "Tidak Ideal":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">Hasil Asesmen Siswa</h1>
        <Image src="/moreDark.png" alt="more" width={24} height={24} className="cursor-pointer" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Siswa
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kelas
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Skor
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataAsesmen.map((data, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {data.nama}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {data.kelas}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                  {data.skor}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getKeteranganClass(data.keterangan)}`}
                  >
                    {data.keterangan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Jika data kosong, tampilkan pesan */}
      {dataAsesmen.length === 0 && (
          <p className="text-center text-gray-500 mt-4 py-8">Belum ada data hasil asesmen.</p>
      )}
    </div>
  );
}

export default HasilAsesmenSiswa;