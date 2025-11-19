import Image from "next/image";
import Link from "next/link";

const UserCard = ({type}:{type:string}) => {
  return (
    <div className="rounded-2xl odd:bg-hijauDaun even:bg-biruBiasa  p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 text-purple-600">2025/3/25</span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h1 className="capitalize text-sm font-medium text-gray-500">{type}</h1>
    </div>
  )
}

export default UserCard