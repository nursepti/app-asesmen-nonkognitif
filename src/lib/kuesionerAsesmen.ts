
export interface QuestionItem {
    id: string; // Contoh: 'P1'
    id_dimensi: string; // Contoh: 'DIM01'
    teks_pertanyaan: string;
}

/**
 * Interface untuk mendefinisikan opsi pada Skala Likert.
 */
export interface LikertOption {
    value: number; 
    label: string; // Teks yang ditampilkan kepada pengguna
}

// Opsi Skala Likert yang digunakan dalam survei
export const likertOptions: LikertOption[] = [
    { value: 1, label: 'Sangat Tidak Setuju (STS)' },
    { value: 2, label: 'Tidak Setuju (TS)' },
    { value: 3, label: 'Setuju (S)' },
    { value: 4, label: 'Sangat Setuju (SS)' },
];

export interface QuizAnswers { 
    [key: string]: number;
}


export const questionsDummy: QuestionItem[] = [
    // --- DIMENSI 1 (D1): 12 BUTIR ---
    { id: 'P1', id_dimensi: 'DIM01', teks_pertanyaan: 'Staf pengajar selalu memberikan contoh yang relevan dengan materi pelajaran.' },
    { id: 'P2', id_dimensi: 'DIM01', teks_pertanyaan: 'Materi yang disampaikan terasa membosankan dan kurang interaktif.' },
    { id: 'P3', id_dimensi: 'DIM01', teks_pertanyaan: 'Guru memberikan umpan balik yang membangun terhadap tugas-tugas saya.' },
    { id: 'P4', id_dimensi: 'DIM01', teks_pertanyaan: 'Saya merasa kesulitan memahami penjelasan yang diberikan guru di kelas.' },
    { id: 'P5', id_dimensi: 'DIM01', teks_pertanyaan: 'Guru menyediakan waktu di luar jam pelajaran untuk konsultasi.' }, 
    { id: 'P6', id_dimensi: 'DIM01', teks_pertanyaan: 'Metode pengajaran yang digunakan guru tidak bervariasi.' }, 
    { id: 'P7', id_dimensi: 'DIM01', teks_pertanyaan: 'Tujuan pembelajaran disampaikan dengan jelas di awal pertemuan.' }, 
    { id: 'P8', id_dimensi: 'DIM01', teks_pertanyaan: 'Guru cenderung mengabaikan pertanyaan yang diajukan oleh siswa.' }, 
    { id: 'P9', id_dimensi: 'DIM01', teks_pertanyaan: 'Penggunaan media pembelajaran sangat membantu saya memahami konsep.' }, 
    { id: 'P10', id_dimensi: 'DIM01', teks_pertanyaan: 'Penilaian yang diberikan guru terasa tidak objektif.' }, 
    { id: 'P11', id_dimensi: 'DIM01', teks_pertanyaan: 'Saya merasa termotivasi untuk belajar lebih giat setelah diajar oleh guru ini.' }, 
    { id: 'P12', id_dimensi: 'DIM01', teks_pertanyaan: 'Tugas yang diberikan terlalu banyak dan tidak relevan.' }, 
    
    // --- DIMENSI 2 (D2): 6 BUTIR ---
    { id: 'P13', id_dimensi: 'DIM02', teks_pertanyaan: 'Guru menguasai materi yang diajarkan dengan sangat baik.' },
    { id: 'P14', id_dimensi: 'DIM02', teks_pertanyaan: 'Guru mampu menjawab pertanyaan yang rumit dengan penjelasan yang sederhana.' },
    { id: 'P15', id_dimensi: 'DIM02', teks_pertanyaan: 'Guru dapat menggunakan teknologi untuk mendukung kegiatan belajar.' },
    { id: 'P16', id_dimensi: 'DIM02', teks_pertanyaan: 'Guru aktif mencari dan membagikan informasi terbaru terkait bidangnya.' },
    { id: 'P17', id_dimensi: 'DIM02', teks_pertanyaan: 'Guru mampu mengelola kelas dengan baik sehingga kondusif untuk belajar.' },
    { id: 'P18', id_dimensi: 'DIM02', teks_pertanyaan: 'Guru menunjukkan sikap profesional dalam setiap interaksi.' },
    
    // --- DIMENSI 3 (D3): 4 BUTIR ---
    { id: 'P19', id_dimensi: 'DIM03', teks_pertanyaan: 'Ruang kelas seringkali terasa panas dan tidak nyaman untuk belajar.' },
    { id: 'P20', id_dimensi: 'DIM03', teks_pertanyaan: 'Fasilitas di sekolah sering mengalami kerusakan dan lambat diperbaiki.' },
    { id: 'P21', id_dimensi: 'DIM03', teks_pertanyaan: 'Ketersediaan buku di perpustakaan sangat terbatas.' },
    { id: 'P22', id_dimensi: 'DIM03', teks_pertanyaan: 'Jaringan internet di area sekolah sering terputus atau sangat lambat.' },
    
    // --- DIMENSI 4 (D4): 8 BUTIR ---
    { id: 'P23', id_dimensi: 'DIM04', teks_pertanyaan: 'Guru selalu datang tepat waktu dan memulai pelajaran sesuai jadwal.' },
    { id: 'P24', id_dimensi: 'DIM04', teks_pertanyaan: 'Guru sering menunda atau membatalkan kelas tanpa pemberitahuan yang jelas.' },
    { id: 'P25', id_dimensi: 'DIM04', teks_pertanyaan: 'Guru menyelesaikan materi pelajaran sesuai dengan rencana awal.' },
    { id: 'P26', id_dimensi: 'DIM04', teks_pertanyaan: 'Guru terlihat tidak siap saat mengajar (misal: belum menyiapkan bahan ajar).' },

    { id: 'P27', id_dimensi: 'DIM04', teks_pertanyaan: 'Tugas yang diberikan selalu diperiksa dan dikembalikan tepat waktu.' }, 

    { id: 'P28', id_dimensi: 'DIM04', teks_pertanyaan: 'Komunikasi antara guru dan siswa berjalan satu arah (hanya guru yang berbicara).' }, 

    { id: 'P29', id_dimensi: 'DIM04', teks_pertanyaan: 'Guru menjaga etika dan norma dalam berinteraksi dengan siswa.' }, 

    { id: 'P30', id_dimensi: 'DIM04', teks_pertanyaan: 'Guru seringkali membedakan perlakuan antara siswa pintar dan siswa biasa.' },

    // --- DIMENSI 5 (D5): 7 BUTIR ---
    { id: 'P31', id_dimensi: 'DIM05', teks_pertanyaan: 'Saya merasa aman dan nyaman berada di lingkungan sekolah.' },
    { id: 'P32', id_dimensi: 'DIM05', teks_pertanyaan: 'Saya pernah mengalami perundungan (bullying) dari siswa lain di sekolah.' },
    { id: 'P33', id_dimensi: 'DIM05', teks_pertanyaan: 'Sekolah aktif mengadakan kegiatan untuk mengembangkan minat dan bakat saya.' },

    { id: 'P34', id_dimensi: 'DIM05', teks_pertanyaan: 'Aturan dan tata tertib sekolah terlalu ketat dan tidak fleksibel.' }, 

    { id: 'P35', id_dimensi: 'DIM05', teks_pertanyaan: 'Sekolah memberikan kesempatan yang sama bagi semua siswa untuk berpartisipasi.' }, 

    { id: 'P36', id_dimensi: 'DIM05', teks_pertanyaan: 'Saya merasa tidak didukung oleh pihak sekolah dalam mencapai prestasi.' }, 

    { id: 'P37', id_dimensi: 'DIM05', teks_pertanyaan: 'Staf sekolah (selain guru) bersikap ramah dan membantu.' }, 
];