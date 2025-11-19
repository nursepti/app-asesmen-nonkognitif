"use client"
import React, { useState } from 'react';


import { questionsDummy, likertOptions, QuizAnswers, QuestionItem } from '../lib/kuesionerAsesmen';

const KuesionerSiswa: React.FC = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [answers, setAnswers] = useState<QuizAnswers>({}); 
    
    const currentQuestion: QuestionItem | undefined = questionsDummy[currentQuestionIndex];
    const totalQuestions = questionsDummy.length;


    if (!currentQuestion) {

        
        return (
            <div className="p-10 bg-white rounded-xl shadow-lg text-center h-full flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Kuesioner Selesai!</h2>
                <p className="text-gray-600">Terima kasih telah meluangkan waktu untuk mengisi survei ini.</p>
                <p className="mt-4 text-sm text-gray-500">Total butir yang diisi: **{Object.keys(answers).length}**</p>
                {/* Di sini Anda bisa menambahkan tombol Submit ke API */}
            </div>
        );
    }

    // Fungsi untuk menangani perubahan jawaban
    const handleAnswerChange = (value: number) => {
        setAnswers((prevAnswers:QuizAnswers) => ({
            ...prevAnswers,
            [currentQuestion.id]: value,
        }));
    };

    // Fungsi untuk maju ke pertanyaan berikutnya
    const handleNext = () => {
        // Cek apakah pertanyaan sudah dijawab sebelum pindah
        if (answers[currentQuestion.id]) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            alert('Mohon pilih salah satu jawaban sebelum melanjutkan!');
        }
    };
    
    // Fungsi untuk mundur ke pertanyaan sebelumnya
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    // Mengakses jawaban saat ini (aman karena sudah menggunakan QuizAnswers)
    const selectedValue: number | undefined = answers[currentQuestion.id]; 
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
            
            {/* Header / Progress */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-700">Kuesioner Evaluasi</h3>
                <div className="text-sm font-bold bg-indigo-500 text-white px-4 py-1 rounded-full shadow">
                    {currentQuestionIndex + 1}/{totalQuestions}
                </div>
            </div>

            {/* Area Pertanyaan Utama */}
            <div className="text-center mb-8">
                <p className="text-2xl font-extrabold text-gray-800 leading-relaxed">
                    {currentQuestion.teks_pertanyaan}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    {currentQuestion.id_dimensi}
                </p>
            </div>

            {/* Area Opsi Jawaban (Likert) */}
            <div className="flex flex-col gap-3">
                {likertOptions.map(option => (
                    <button
                        key={option.value}
                        // Pastikan tipe yang dikirimkan adalah number
                        onClick={() => handleAnswerChange(option.value)} 
                        className={`
                            p-4 rounded-lg text-lg font-medium transition-all duration-200 ease-in-out
                            ${selectedValue === option.value
                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-800' // Selected Style
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' // Default Style
                            }
                        `}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Footer / Tombol Navigasi */}
            <div className="mt-8 pt-6 border-t flex justify-between">
                {/* Tombol Sebelumnya */}
                <button
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className={`
                        py-2 px-6 text-base font-semibold rounded-full transition-all duration-200 
                        ${isFirstQuestion
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow'
                        }
                    `}
                >
                    ◀ Sebelumnya
                </button>
                
                {/* Tombol Selanjutnya / Submit */}
                <button
                    onClick={handleNext}
                    // Tombol harus aktif hanya jika sudah ada jawaban (selectedValue)
                    className={`
                        py-3 px-10 text-xl font-bold rounded-full transition-all duration-200 ease-in-out shadow-lg
                        ${selectedValue
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }
                    `}
                    disabled={!selectedValue}
                >
                    {isLastQuestion ? 'SUBMIT' : 'SELANJUTNYA ▶'}
                </button>
            </div>
        </div>
    );
};

export default KuesionerSiswa;