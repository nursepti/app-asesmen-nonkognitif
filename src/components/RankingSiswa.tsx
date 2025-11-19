
import Image from "next/image";

const RankingSiswa = () => {
  return (
    <div className="bg-gray-500 rounded-xl w-full p-4 shadow-md">
        <div className="flex  justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Skor Rata-rata Dimensi di Kelas 8A</h1>
        <Image src="/moreDark.png" alt="more" width={20} height={20} />
        </div>
    </div>
  )
}

export default RankingSiswa