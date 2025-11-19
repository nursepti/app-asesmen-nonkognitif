import KuesionerAsesmen from "@/components/KuesionerAsesmen";

const SiswaPage = () => {
  return (
    // Menggunakan layout padding yang lebih baik dan latar belakang
    <div className="min-h-screen bg-gray-50 p-4 md:p-8"> 
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            Dashboard Siswa
        </h1>

        {/* Kotak untuk menampung komponen KuesionerSiswa */}
        <div className="flex justify-center items-start">
            
            {/* ✅ Langkah 2: Gunakan komponen yang sudah diimport */}
            <KuesionerAsesmen /> 

        </div>
        
    </div>
  )
}

export default SiswaPage;