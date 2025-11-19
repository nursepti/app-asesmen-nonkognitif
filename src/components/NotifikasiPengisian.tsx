import { Span } from "next/dist/trace"

const NotifikasiPengisian = () => {
  return (
    <div className="bg-white p-4 rounded-md">
        <div>
            <h1 className="text-xl font-semibold">Yang Sudah Mengisi</h1>
            <span className="text-xs text-gray-400">View All</span>
        </div>

        <div className="flex flex-col gap-4 mt4">
            <div className="bg-biruLangit rounded-md p-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium">Lorem ipmsum namae</h2>
                    <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">08:30</span>
                </div>
            </div>

            <div className="bg-biruLangit rounded-md p-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium">Lorem ipmsum namae</h2>
                    <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">08:30</span>
                </div>
            </div>

            <div className="bg-biruLangit rounded-md p-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-medium">Lorem ipmsum namae</h2>
                    <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">08:20</span>
                </div>
            </div>
        </div>
        
        

    </div>
    
  )
}

export default NotifikasiPengisian