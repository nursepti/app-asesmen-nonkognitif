// DATA SEMENTARA

export let role = "admin";

export interface Dimensi {
  id_dimensi: number;
  nama_dimensi: string;
  deskripsi: string;
}

export interface Indikator {
  id_indikator: number;
  id_dimensi: number; // FK tbl_dimensi
  nama_indikator: string;
}

export interface Pertanyaan {
  id_pertanyaan: number;
  id_dimensi: number; // FK tbl_dimensi
  id_indikator: number; // FK tbl_indikator
  teks_pertanyaan: string;
  urutan: number;
}

export interface KategoriNilai {
  id_kategori: number;
  nama_kategori: string;
  batas_bawah: number;
  batas_atas: number;
  warna: string; // Tambahan untuk UI (Hijau/Merah/dll)
}


// B. KELOMPOK 2: DATA PENGGUNA & SEKOLAH (INTERFACES)


export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  id_user: number;
  username: string;
  role: UserRole;
  // password tidak perlu di-mock untuk frontend
}

export interface Guru {
  id_guru: number;
  id_user: number; // FK tbl_user
  nip: string;
  nama_guru: string;
  email: string;
  no_telepon: string;
  foto: string;
  kelas_diampu: string[]; // Array nama kelas untuk display UI
}

export interface Kelas {
  id: number;
  id_guru: number;
  waliKelas: string; // FK tbl_guru (Wali Kelas)
  namaKelas: string;
  jumlahMurid: number;
  foto: string;
  telepon: string;
}

export interface Siswa {

  id: number;
  id_user: number; // FK tbl_user
  id_kelas: number; // FK tbl_kelas
  nisn: string;
  nama: string;
  telepon?: string;
  namaKelas: string[];
  alamat: string;
  foto: string;
}

export interface Guru{
    id: number,
    id_guru: number;
    nama: string;
    surel: string;
    foto: string;
    telepon: string;
    mataPelajaran: string[];
    kelasDiajar: string[];
    alamat: string;
}

// C. KELOMPOK 3: TRANSAKSI (INTERFACES)
 
export interface Jadwal {
  id_jadwal: number;
  id_kelas: number; // FK tbl_kelas
  id_guru: number; // FK tbl_guru (Pembuat Jadwal)
  nama_sesi: string;
  tgl_pelaksanaan: string; // YYYY-MM-DD
  jam_mulai: string;
  jam_selesai: string;
  status: 'aktif' | 'selesai';
}

// Struktur JSON untuk kolom 'detail_jawaban'
export interface DetailJawabanItem {
  no: number;
  pertanyaan: string;
  dimensi: string;
  indikator: string;
  jawaban_label: 'SS' | 'S' | 'TS' | 'STS';
  skor: number; // 0-3 (sudah memperhitungkan jenis positif/negatif)
}

// Interface Utama: tbl_asesmen_siswa
export interface AsesmenSiswa {
  id_asesmen: string; // Menggunakan string/UUID untuk ID transaksi biasanya lebih aman
  id_jadwal: number; // FK tbl_jadwal
  id_siswa: number; // FK tbl_siswa

  // a. Waktu & Validitas
  waktu_mulai: string;
  waktu_selesai: string;
  durasi_detik: number;
  status_validitas: 'valid' | 'suspect';

  // b. Snapshot History (Agar data aman saat naik kelas)
  snap_nama_siswa: string;
  snap_nama_kelas: string;
  snap_nisn: string;
  foto_profil_snap: string; // Tambahan UI: Foto saat ujian (opsional)

  // c. Agregat Nilai (Kolom fisik untuk Dashboard Cepat)
  total_skor: number;
  kategori_akhir: string;
  skor_kesadaran_diri: number;
  skor_manajemen_diri: number;
  skor_kesadaran_sosial: number;
  skor_relasi: number;
  skor_keputusan: number;

  // d. Detail Jawaban (JSONB)
  detail_jawaban: DetailJawabanItem[];
}

export const dataDimensi = [
  {
    id_dimensi: 1,
    nama_dimensi: "D1",
    deskripsi: "Kesejahteraan psikologis dan sosial emosional siswa",
  },
  {
    id_dimensi: 2,
    nama_dimensi: "D2",
    deskripsi: "Aktivitas belajar mandiri siswa",
  },
  {
    id_dimensi: 3,
    nama_dimensi: "D3",
    deskripsi: "Kondisi keluarga siswa",
  },
  {
    id_dimensi: 4,
    nama_dimensi: "D4",
    deskripsi: "Latar belakang pergaulan siswa",
  },
  {
    id_dimensi: 5,
    nama_dimensi: "D5",
    deskripsi: "Gaya belajar dan minat siswa",
  },
];

export const dataIndikator= [
  { id_indikator: 1, id_dimensi: 1, nama_indikator: "Pengenalan Emosi" },
  { id_indikator: 2, id_dimensi: 1, nama_indikator: "Kepercayaan Diri" },

  { id_indikator: 3, id_dimensi: 2, nama_indikator: "Pengelolaan Stress" },
  { id_indikator: 4, id_dimensi: 2, nama_indikator: "Disiplin Diri" },

  { id_indikator: 5, id_dimensi: 3, nama_indikator: "Empati" },
  { id_indikator: 6, id_dimensi: 3, nama_indikator: "Apresiasi Keberagaman" },

  { id_indikator: 7, id_dimensi: 4, nama_indikator: "Komunikasi Efektif" },
  { id_indikator: 8, id_dimensi: 4, nama_indikator: "Kerjasama Tim" },
  { id_indikator: 9, id_dimensi: 4, nama_indikator: "Resolusi Konflik" },

  { id_indikator: 10, id_dimensi: 5, nama_indikator: "Identifikasi Masalah" },
  { id_indikator: 11, id_dimensi: 5, nama_indikator: "Tanggung Jawab" }
];

export const dataPertanyaan: Pertanyaan[] = [
  // -- Indikator 1: Pengenalan Emosi (3 Soal) --
  { id_pertanyaan: 1, id_indikator: 1, id_dimensi: 1, teks_pertanyaan: "Saya tahu persis apa yang saya rasakan saat sedang marah.",   urutan: 1 },
  { id_pertanyaan: 2, id_indikator: 1, id_dimensi: 1, teks_pertanyaan: "Saya sulit menjelaskan perasaan saya kepada orang lain.",   urutan: 2 },
  { id_pertanyaan: 3, id_indikator: 1, id_dimensi: 1, teks_pertanyaan: "Saya menyadari ketika suasana hati saya berubah.",   urutan: 3 },

  // -- Indikator 2: Kepercayaan Diri (3 Soal) --
  { id_pertanyaan: 4, id_indikator: 2, id_dimensi: 1, teks_pertanyaan: "Saya merasa mampu menyelesaikan tugas sulit.",   urutan: 4 },
  { id_pertanyaan: 5, id_indikator: 2, id_dimensi: 1, teks_pertanyaan: "Saya merasa teman-teman saya lebih pintar dari saya.",   urutan: 5 },
  { id_pertanyaan: 6, id_indikator: 2, id_dimensi: 1, teks_pertanyaan: "Saya berani mencoba hal baru meski berisiko gagal.",   urutan: 6 },

  // -- Indikator 3: Pengelolaan Stress (4 Soal) --
  { id_pertanyaan: 7, id_indikator: 3, id_dimensi: 2, teks_pertanyaan: "Saya tetap tenang meskipun berada dalam tekanan.",   urutan: 7 },
  { id_pertanyaan: 8, id_indikator: 3, id_dimensi: 2, teks_pertanyaan: "Saya mudah panik saat menghadapi ujian mendadak.",   urutan: 8 },
  { id_pertanyaan: 9, id_indikator: 3, id_dimensi: 2, teks_pertanyaan: "Saya punya cara untuk menenangkan diri saat marah.",   urutan: 9 },
  { id_pertanyaan: 10, id_indikator: 3, id_dimensi: 2, teks_pertanyaan: "Stres membuat saya tidak bisa tidur nyenyak.",   urutan: 10 },

  // -- Indikator 4: Disiplin Diri (3 Soal) --
  { id_pertanyaan: 11, id_indikator: 4, id_dimensi: 2, teks_pertanyaan: "Saya mengerjakan PR jauh sebelum batas waktu pengumpulan.",   urutan: 11 },
  { id_pertanyaan: 12, id_indikator: 4, id_dimensi: 2, teks_pertanyaan: "Saya sering menunda pekerjaan sampai menit terakhir.",   urutan: 12 },
  { id_pertanyaan: 13, id_indikator: 4, id_dimensi: 2, teks_pertanyaan: "Saya bisa fokus belajar meskipun ada gangguan HP.",   urutan: 13 },

  // -- Indikator 5: Empati (3 Soal) --
  { id_pertanyaan: 14, id_indikator: 5, id_dimensi: 3, teks_pertanyaan: "Saya bisa merasakan kesedihan teman yang sedang menangis.",   urutan: 14 },
  { id_pertanyaan: 15, id_indikator: 5, id_dimensi: 3, teks_pertanyaan: "Saya tidak peduli dengan masalah orang lain.",   urutan: 15 },
  { id_pertanyaan: 16, id_indikator: 5, id_dimensi: 3, teks_pertanyaan: "Saya mencoba menghibur teman yang sedang kecewa.",   urutan: 16 },

  // -- Indikator 6: Apresiasi Keberagaman (3 Soal) --
  { id_pertanyaan: 17, id_indikator: 6, id_dimensi: 3, teks_pertanyaan: "Saya senang berteman dengan orang dari latar belakang berbeda.",   urutan: 17 },
  { id_pertanyaan: 18, id_indikator: 6, id_dimensi: 3, teks_pertanyaan: "Saya menghormati pendapat teman yang berbeda dengan saya.",   urutan: 18 },
  { id_pertanyaan: 19, id_indikator: 6, id_dimensi: 3, teks_pertanyaan: "Saya merasa tidak nyaman bergaul dengan kelompok lain.",   urutan: 19 },

  // -- Indikator 7: Komunikasi Efektif (3 Soal) --
  { id_pertanyaan: 20, id_indikator: 7, id_dimensi: 3, teks_pertanyaan: "Saya mendengarkan dengan baik saat orang lain berbicara.",   urutan: 20 },
  { id_pertanyaan: 21, id_indikator: 7, id_dimensi: 3, teks_pertanyaan: "Saya berbicara dengan sopan kepada guru dan teman.",   urutan: 21 },
  { id_pertanyaan: 22, id_indikator: 7, id_dimensi: 3, teks_pertanyaan: "Saya sering memotong pembicaraan orang lain.",   urutan: 22 },

  // -- Indikator 8: Kerjasama Tim (4 Soal) --
  { id_pertanyaan: 23, id_indikator: 8, id_dimensi: 3, teks_pertanyaan: "Saya aktif berkontribusi dalam tugas kelompok.",   urutan: 23 },
  { id_pertanyaan: 24, id_indikator: 8, id_dimensi: 3, teks_pertanyaan: "Saya lebih suka bekerja sendiri daripada dalam tim.",   urutan: 24 },
  { id_pertanyaan: 25, id_indikator: 8, id_dimensi: 3, teks_pertanyaan: "Saya membantu teman kelompok yang kesulitan.",   urutan: 25 },
  { id_pertanyaan: 26, id_indikator: 8, id_dimensi: 3, teks_pertanyaan: "Saya mau berbagi tugas secara adil.",   urutan: 26 },

  // -- Indikator 9: Resolusi Konflik (3 Soal) --
  { id_pertanyaan: 27, id_indikator: 9, id_dimensi: 3, teks_pertanyaan: "Saya meminta maaf jika saya berbuat salah.",   urutan: 27 },
  { id_pertanyaan: 28, id_indikator: 9, id_dimensi: 3, teks_pertanyaan: "Saya menggunakan kekerasan untuk menyelesaikan masalah.",   urutan: 28 },
  { id_pertanyaan: 29, id_indikator: 9, id_dimensi: 3, teks_pertanyaan: "Saya mencari solusi jalan tengah saat bertengkar.",   urutan: 29 },

  // -- Indikator 10: Identifikasi Masalah (4 Soal) --
  { id_pertanyaan: 30, id_indikator: 10, id_dimensi: 3, teks_pertanyaan: "Saya memikirkan dampak sebelum bertindak.",   urutan: 30 },
  { id_pertanyaan: 31, id_indikator: 10, id_dimensi: 3, teks_pertanyaan: "Saya sering bertindak gegabah tanpa berpikir.",   urutan: 31 },
  { id_pertanyaan: 32, id_indikator: 10, id_dimensi: 3, teks_pertanyaan: "Saya tahu mana yang benar dan mana yang salah.",   urutan: 32 },
  { id_pertanyaan: 33, id_indikator: 10, id_dimensi: 3, teks_pertanyaan: "Saya bisa membedakan situasi berbahaya dan aman.",   urutan: 33 },

  // -- Indikator 11: Tanggung Jawab (4 Soal) --
  { id_pertanyaan: 34, id_indikator: 11, id_dimensi: 3, teks_pertanyaan: "Saya mengakui kesalahan yang saya perbuat.",   urutan: 34 },
  { id_pertanyaan: 35, id_indikator: 11, id_dimensi: 3, teks_pertanyaan: "Saya menyalahkan orang lain atas kegagalan saya.",   urutan: 35 },
  { id_pertanyaan: 36, id_indikator: 11, id_dimensi: 3, teks_pertanyaan: "Saya menepati janji yang saya buat.",   urutan: 36 },
  { id_pertanyaan: 37, id_indikator: 11, id_dimensi: 3, teks_pertanyaan: "Saya menjaga barang-barang milik sekolah dengan baik.",   urutan: 37 },
];

export const dataKategoriNilai: KategoriNilai[] = [
  { id_kategori: 1, nama_kategori: "Kurang", batas_bawah: 0, batas_atas: 50, warna: "#EF4444" },
  { id_kategori: 2, nama_kategori: "Cukup", batas_bawah: 51, batas_atas: 70, warna: "#F59E0B" },
  { id_kategori: 3, nama_kategori: "Baik", batas_bawah: 71, batas_atas: 85, warna: "#3B82F6" },
  { id_kategori: 4, nama_kategori: "Sangat Baik", batas_bawah: 86, batas_atas: 100, warna: "#10B981" },
];

export const dataJadwal: Jadwal[] = [
  {
    id_jadwal: 3,
    id_kelas: 10, // ID Dummy
    nama_sesi: "Asesmen Karakter Awal Tahun",
    tgl_pelaksanaan: "2024-07-20",
    jam_mulai: "08:00",
    jam_selesai: "09:30",
    status: 'selesai',
    id_guru: 1
  },
  {
    id_jadwal: 4,
    id_kelas: 10, 
    nama_sesi: "Evaluasi Semester Ganjil",
    tgl_pelaksanaan: "2024-12-10",
    jam_mulai: "08:00",
    jam_selesai: "09:30",
    status: 'aktif',
    id_guru: 2
  }
];

export const dataGuru = [
  {
    id: 1,
    id_guru: "G-1234567890",
    nama: "Budi Santoso",
    surel: "budi@santoso.com",
    foto:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567890",
    mataPelajaran: ["Matematika"],
    kelasDiajar: ["1B", "2A", "3C"],
    alamat: "Jl. Merdeka No. 1, Jakarta, Indonesia",
  },
  {
    id: 2,
    id_guru: "G-1234567891",
    nama: "Siti Rahayu",
    surel: "siti@rahayu.com",
    foto:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567891",
    mataPelajaran: ["Fisika", "Kimia"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Sudirman No. 2, Bandung, Indonesia",
  },
  {
    id: 3,
    id_guru: "G-1234567892",
    nama: "Agus Maulana",
    surel: "agus@maulana.com",
    foto:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567892",
    mataPelajaran: ["Biologi"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Diponegoro No. 3, Surabaya, Indonesia",
  },
  {
    id: 4,
    id_guru: "G-1234567893",
    nama: "Dewi Lestari",
    surel: "dewi@lestari.com",
    foto:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567893",
    mataPelajaran: ["Sejarah"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Gajah Mada No. 4, Medan, Indonesia",
  },
  {
    id: 5,
    id_guru: "G-1234567894",
    nama: "Joko Susilo",
    surel: "joko@susilo.com",
    foto:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567894",
    mataPelajaran: ["Seni Musik", "Sejarah"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Veteran No. 5, Yogyakarta, Indonesia",
  },
  {
    id: 6,
    id_guru: "G-1234567895",
    nama: "Rina Amelia",
    surel: "rina@amelia.com",
    foto:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567895",
    mataPelajaran: ["Fisika"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Pahlawan No. 6, Semarang, Indonesia",
  },
  {
    id: 7,
    id_guru: "G-1234567896",
    nama: "Faisal Rahman",
    surel: "faisal@rahman.com",
    foto:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567896",
    mataPelajaran: ["Bahasa Inggris", "Bahasa Spanyol"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Kartini No. 7, Bogor, Indonesia",
  },
  {
    id: 8,
    id_guru: "G-1234567897",
    nama: "Maya Sari",
    surel: "maya@sari.com",
    foto:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567897",
    mataPelajaran: ["Matematika", "Geometri"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Anggrek No. 8, Depok, Indonesia",
  },
  {
    id: 9,
    id_guru: "G-1234567898",
    nama: "Denny Wijaya",
    surel: "denny@wijaya.com",
    foto:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567898",
    mataPelajaran: ["Sastra", "Bahasa Inggris"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Kenanga No. 9, Malang, Indonesia",
  },
  {
    id: 10,
    id_guru: "G-1234567899",
    nama: "Eka Putri",
    surel: "eka@putri.com",
    foto:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "081234567899",
    mataPelajaran: ["Biologi"],
    kelasDiajar: ["5A", "4B", "3C"],
    alamat: "Jl. Melati No. 10, Solo, Indonesia",
  },
];

export const dataSiswa = [
  {
    id: 1,
    nisn: "M-1234567890",
    nama: "Doni Setiawan",
    surel: "doni@setiawan.com",
    foto:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543210",
    
    namaKelas: "1B",
    alamat: "Jl. Merdeka No. 1, Jakarta, Indonesia",
  },
  {
    id: 2,
    nisn: "M-1234567891",
    nama: "Ria Fitri",
    surel: "ria@fitri.com",
    foto:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543211",
    
    namaKelas: "5A",
    alamat: "Jl. Sudirman No. 2, Bandung, Indonesia",
  },
  {
    id: 3,
     nisn: "M-1234567892",
    nama: "Andre Pratama",
    surel: "andre@pratama.com",
    foto:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543212",
    
    namaKelas: "5A",
    alamat: "Jl. Diponegoro No. 3, Surabaya, Indonesia",
  },
  {
    id: 4,
     nisn: "M-1234567893",
    nama: "Nina Amelia",
    surel: "nina@amelia.com",
    foto:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543213",
    namaKelas: "5A",
    alamat: "Jl. Gajah Mada No. 4, Medan, Indonesia",
  },
  {
    id: 5,
     nisn: "M-1234567894",
    nama: "Sari Dewi",
    surel: "sari@dewi.com",
    foto:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543214",
    namaKelas: "5A",
    alamat: "Jl. Veteran No. 5, Yogyakarta, Indonesia",
  },
  {
    id: 6,
     nisn: "M-1234567895",
    nama: "Fajar Nugraha",
    surel: "fajar@nugraha.com",
    foto:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543215",
    
    namaKelas: "5A",
    alamat: "Jl. Pahlawan No. 6, Semarang, Indonesia",
  },
  {
    id: 7,
     nisn: "M-1234567896",
    nama: "Gilang Ramadhan",
    surel: "gilang@ramadhan.com",
    foto:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543216",
    
    namaKelas: "5A",
    alamat: "Jl. Kartini No. 7, Bogor, Indonesia",
  },
  {
    id: 8,
     nisn: "M-1234567897",
    nama: "Lina Wahyuni",
    surel: "lina@wahyuni.com",
    foto:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543217",
    
    namaKelas: "5A",
    alamat: "Jl. Anggrek No. 8, Depok, Indonesia",
  },
  {
    id: 9,
     nisn: "M-1234567898",
    nama: "Rizky Firmansyah",
    surel: "rizky@firmansyah.com",
    foto:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543218",
    
    namaKelas: "5A",
    alamat: "Jl. Kenanga No. 9, Malang, Indonesia",
  },
  {
    id: 10,
     nisn: "M-1234567899",
    nama: "Citra Kirana",
    surel: "citra@kirana.com",
    foto:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    telepon: "089876543219",
    
    namaKelas: "5A",
    alamat: "Jl. Melati No. 10, Solo, Indonesia",
  },
];

export const dataKelas = [
  {
    id: 1,
    namaKelas: "1A", 
    jumlahMurid: 20,
    waliKelas: "Budi Santoso",
    telepon: "081234567890",
    foto: "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 1)
  },
  {
    id: 2,
    namaKelas: "2B", 
    jumlahMurid: 22,
    waliKelas: "Siti Rahayu",
    telepon: "081234567891",
    foto: "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 2)
  },
  {
    id: 3,
    namaKelas: "3C", 
    jumlahMurid: 20,
    waliKelas: "Faisal Rahman",
    telepon: "081234567892", 
    foto: "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 3)
  },
  {
    id: 4,
    namaKelas: "4B", 
    jumlahMurid: 18,
    waliKelas: "Anisa Candra", 
    telepon: "081234567893", 
    foto: "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 4)
  },
  {
    id: 5,
    namaKelas: "5A", 
    jumlahMurid: 16,
    waliKelas: "Ira Fitriani", 
    telepon: "081234567894", 
    foto: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 5)
  },
  {
    id: 6,
    namaKelas: "5B", 
    jumlahMurid: 20,
    waliKelas: "Lukman Setiawan", 
    telepon: "081234567895", 
    foto: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 6)
  },
  {
    id: 7,
    namaKelas: "7A", 
    jumlahMurid: 18,
    waliKelas: "Dian Permata", 
    telepon: "081234567896", 
    foto: "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 7)
  },
  {
    id: 8,
    namaKelas: "6B", 
    jumlahMurid: 22,
    waliKelas: "Krisna Bimantoro", 
    telepon: "081234567897", 
    foto: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 8)
  },
  {
    id: 9,
    namaKelas: "6C", 
    jumlahMurid: 18,
    waliKelas: "Mira Lestari", 
    telepon: "081234567898", 
    foto: "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 9)
  },
  {
    id: 10,
    namaKelas: "6D", 
    jumlahMurid: 20,
    waliKelas: "Olivia Maharani", 
    telepon: "081234567899", 
    foto: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ditambahkan dari dataGuru (ID 10)
  },
];

export const dataAcara = [
  {
    id: 1,
    judul: "Kunjungan ke Danau",
    namaKelas: "1A",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 2,
    judul: "Piknik Sekolah",
    namaKelas: "2A",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 3,
    judul: "Karyawisata Pantai",
    namaKelas: "3A",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 4,
    judul: "Kunjungan ke Museum",
    namaKelas: "4A",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 5,
    judul: "Konser Musik",
    namaKelas: "5A",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 6,
    judul: "Pertunjukan Sulap",
    namaKelas: "1B",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 7,
    judul: "Kunjungan ke Danau",
    namaKelas: "2B",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 8,
    judul: "Lomba Balap Sepeda",
    namaKelas: "3B",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 9,
    judul: "Pameran Seni",
    namaKelas: "4B",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
  {
    id: 10,
    judul: "Turnamen Olahraga",
    namaKelas: "5B",
    tanggal: "2025-01-01",
    waktuMulai: "10:00",
    waktuSelesai: "11:00",
  },
];

export const dataPengumuman = [
  {
    id: 1,
    judul: "Mengenai Ujian Matematika 4A",
    namaKelas: "4A",
    tanggal: "2025-01-01",
  },
  {
    id: 2,
    judul: "Mengenai Ujian Matematika 3A",
    namaKelas: "3A",
    tanggal: "2025-01-01",
  },
  {
    id: 3,
    judul: "Mengenai Ujian Matematika 3B",
    namaKelas: "3B",
    tanggal: "2025-01-01",
  },
  {
    id: 4,
    judul: "Mengenai Ujian Matematika 6A",
    namaKelas: "6A",
    tanggal: "2025-01-01",
  },
  {
    id: 5,
    judul: "Mengenai Ujian Matematika 8C",
    namaKelas: "8C",
    tanggal: "2025-01-01",
  },
  {
    id: 6,
    judul: "Mengenai Ujian Matematika 2A",
    namaKelas: "2A",
    tanggal: "2025-01-01",
  },
  {
    id: 7,
    judul: "Mengenai Ujian Matematika 4C",
    namaKelas: "4C",
    tanggal: "2025-01-01",
  },
  {
    id: 8,
    judul: "Mengenai Ujian Matematika 4B",
    namaKelas: "4B",
    tanggal: "2025-01-01",
  },
  {
    id: 9,
    judul: "Mengenai Ujian Matematika 3C",
    namaKelas: "3C",
    tanggal: "2025-01-01",
  },
  {
    id: 10,
    judul: "Mengenai Ujian Matematika 1C",
    namaKelas: "1C",
    tanggal: "2025-01-01",
  },
];


// Anda dapat mengubah tanggal-tanggal acara di bawah ini ke tanggal saat ini
// (November 2025) untuk melihat acara di kalender.
// Bulan dalam JavaScript dimulai dari 0 (0 = Januari, 10 = November)
const tahunSekarang = 2025;
const bulanSekarang = 10; // November

export const acaraKalender = [
  {
    judul: "Matematika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 3, 8, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 3, 8, 45),
  },
  {
    judul: "Bahasa Inggris",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 3, 9, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 3, 9, 45),
  },
  {
    judul: "Biologi",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 3, 10, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 3, 10, 45),
  },
  {
    judul: "Fisika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 3, 11, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 3, 11, 45),
  },
  {
    judul: "Kimia",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 3, 13, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 3, 13, 45),
  },
  {
    judul: "Sejarah",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 3, 14, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 3, 14, 45),
  },
  {
    judul: "Bahasa Inggris",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 4, 9, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 4, 9, 45),
  },
  {
    judul: "Biologi",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 4, 10, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 4, 10, 45),
  },
  {
    judul: "Fisika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 4, 11, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 4, 11, 45),
  },
  {
    judul: "Sejarah",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 4, 14, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 4, 14, 45),
  },
  {
    judul: "Matematika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 5, 8, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 5, 8, 45),
  },
  {
    judul: "Biologi",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 5, 10, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 5, 10, 45),
  },
  {
    judul: "Kimia",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 5, 13, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 5, 13, 45),
  },
  {
    judul: "Sejarah",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 5, 14, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 5, 14, 45),
  },
  {
    judul: "Bahasa Inggris",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 6, 9, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 6, 9, 45),
  },
  {
    judul: "Biologi",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 6, 10, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 6, 10, 45),
  },
  {
    judul: "Fisika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 6, 11, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 6, 11, 45),
  },
  {
    judul: "Sejarah",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 6, 14, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 6, 14, 45),
  },
  {
    judul: "Matematika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 7, 8, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 7, 8, 45),
  },
  {
    judul: "Bahasa Inggris",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 7, 9, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 7, 9, 45),
  },
  {
    judul: "Fisika",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 7, 11, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 7, 11, 45),
  },
  {
    judul: "Kimia",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 7, 13, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 7, 13, 45),
  },
  {
    judul: "Sejarah",
    sepanjangHari: false,
    mulai: new Date(tahunSekarang, bulanSekarang, 7, 14, 0),
    selesai: new Date(tahunSekarang, bulanSekarang, 7, 14, 45),
  },
];



// ==========================================
// LOGIC GENERATOR (JAWABAN, SKOR, WAKTU)
// ==========================================

// 1. Generate Detail Jawaban Random (37 Soal)
const generateDummyDetails = (): DetailJawabanItem[] => {
  return dataPertanyaan.map((q) => {
    const indikator = dataIndikator.find(i => i.id_indikator === q.id_indikator);
    const dimensi = dataDimensi.find(d => d.id_dimensi === indikator?.id_dimensi);

    // Randomize jawaban (Bobot ke nilai positif biar terlihat realistis)
    const rand = Math.random();
    let label: 'SS' | 'S' | 'TS' | 'STS' = 'SS';
    let skor = 3;

    if (rand < 0.1) { label = 'STS'; skor = 0; }
    else if (rand < 0.3) { label = 'TS'; skor = 1; }
    else if (rand < 0.7) { label = 'S'; skor = 2; }
    else { label = 'SS'; skor = 3; }

    return {
      no: q.urutan,
      pertanyaan: q.teks_pertanyaan,
      dimensi: dimensi ? dimensi.nama_dimensi : "Umum",
      indikator: indikator ? indikator.nama_indikator : "Umum",
      jawaban_label: label,
      skor: skor
    };
  });
};

// 2. Fungsi Utama: Generate Full Assessment Object
// Fungsi ini akan menghitung skor agregat berdasarkan jawaban yang dihasilkan
const createAssessmentData = (idSiswa: number, idJadwal: number, idAsesmen: string): AsesmenSiswa | null => {
  // Cari data siswa dulu untuk snapshot
  const siswa = dataSiswa.find(s => s.id === idSiswa);
  const kelas = dataKelas.find(k => k.id === siswa?.id);
  
  if (!siswa || !kelas) return null;

  // A. Generate Jawaban dulu!
  const details = generateDummyDetails();

  // B. Hitung Skor Agregat dari 'details'
  let totalSkor = 0;
  let s_diri = 0, s_manajemen = 0, s_sosial = 0, s_relasi = 0, s_keputusan = 0;

  details.forEach(d => {
    totalSkor += d.skor;
    if (d.dimensi === "Kesadaran Diri") s_diri += d.skor;
    if (d.dimensi === "Manajemen Diri") s_manajemen += d.skor;
    if (d.dimensi === "Kesadaran Sosial") s_sosial += d.skor;
    if (d.dimensi === "Keterampilan Berelasi") s_relasi += d.skor;
    if (d.dimensi === "Pengambilan Keputusan") s_keputusan += d.skor;
  });

  // C. Tentukan Kategori Akhir (Skala 0-111, karena 37 soal x 3 max score = 111)
  // Kita konversi ke skala 100 dulu untuk mencocokkan dengan dataKategoriNilai
  const skorSkala100 = Math.round((totalSkor / 111) * 100);
  
  let kategori = "Kurang";
  const catRef = dataKategoriNilai.find(c => skorSkala100 >= c.batas_bawah && skorSkala100 <= c.batas_atas);
  if (catRef) kategori = catRef.nama_kategori;

  // D. Generate Waktu & Validitas Random
  // Waktu mulai random antara jam 08:00 - 10:00
  const baseDate = new Date("2024-12-15T08:00:00");
  const randomStartMinutes = Math.floor(Math.random() * 120); 
  const waktuMulai = new Date(baseDate.getTime() + randomStartMinutes * 60000);

  // Durasi pengerjaan random (antara 10 menit s/d 40 menit)
  // 10 menit = 600 detik, 40 menit = 2400 detik
  const durasiDetik = Math.floor(Math.random() * (2400 - 600 + 1)) + 600;
  const waktuSelesai = new Date(waktuMulai.getTime() + durasiDetik * 1000);

  // Status Validitas (Jika durasi < 5 menit dianggap suspect)
  const statusValiditas = durasiDetik < 300 ? "suspect" : "valid";

  return {
    id_asesmen: idAsesmen,
    id_jadwal: idJadwal,
    id_siswa: idSiswa,

    // Generated Time
    waktu_mulai: waktuMulai.toISOString().replace('T', ' ').substring(0, 19),
    waktu_selesai: waktuSelesai.toISOString().replace('T', ' ').substring(0, 19),
    durasi_detik: durasiDetik,
    status_validitas: statusValiditas,

    // Snapshot
    snap_nama_siswa: siswa.nama,
    snap_nama_kelas: kelas?kelas.namaKelas : (siswa.namaKelas[0] || "Umum"),
    snap_nisn: siswa.nisn || "",
    foto_profil_snap: siswa.foto,

    // Calculated Scores (Sinkron dengan Detail Jawaban!)
    total_skor: skorSkala100, // Kita pakai skala 100
    kategori_akhir: kategori,
    
    skor_kesadaran_diri: s_diri,
    skor_manajemen_diri: s_manajemen,
    skor_kesadaran_sosial: s_sosial,
    skor_relasi: s_relasi,
    skor_keputusan: s_keputusan,

    // The Answers
    detail_jawaban: details
  };
};


// ==========================================
// EXPORT DATA FINAL
// ==========================================

// Kita generate array asesmen menggunakan fungsi helper di atas
// Jadi tidak perlu ngetik manual satu-satu
export const dataAsesmenSiswa: AsesmenSiswa[] = [
  createAssessmentData(1, 301, "ASM-2024-001")!, // Siswa 1
  createAssessmentData(2, 301, "ASM-2024-002")!, // Siswa 2 (Otomatis beda skor & jawaban)
  createAssessmentData(3, 301, "ASM-2024-003")!, // Siswa 3
  createAssessmentData(4, 301, "ASM-2024-004")!, // Siswa 4
  createAssessmentData(5, 301, "ASM-2024-005")!, // Siswa 5
  createAssessmentData(6, 301, "ASM-2024-006")!, // Siswa 6
  createAssessmentData(7, 301, "ASM-2024-007")!, // Siswa 7
  createAssessmentData(8, 301, "ASM-2024-008")!, // Siswa 8
  createAssessmentData(9, 301, "ASM-2024-009")!, // Siswa 9
  createAssessmentData(10, 301, "ASM-2024-010")!, // Siswa 10
];


// Helper Selector untuk Page
export const getStudentAssessmentData = (studentId: number): AsesmenSiswa | null => {
  const assessment = dataAsesmenSiswa.find((a) => a.id_siswa === studentId);
  return assessment || null;
};
