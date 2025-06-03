"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "../../../../contexts/quiz_context";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../../../contexts/auth_context";

export default function QuizResult() {
  const router = useRouter();
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (id) {
      fetch(`/api/attempt/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Gunakan token dari user
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setResult(data))
        .catch((error) => console.error("Error fetching result:", error));
    }
  }, []);

  if (!result)
    return (
      <div className=" bg-gradient-to-b from-blue-50 to-blue-200 text-black h-screen w-screen flex flex-col justify-center items-center">
        <div className="w-20 h-20 animate-spin">
          <span className="text-4xl">🫀</span>
        </div>
        <p className="mt-4 text-lg font-semibold text-blue-800">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center text-blue-900 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">
            Hasil Quiz
          </h1>

          <div className="flex justify-center mb-8">
            {result.passed ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="w-16 h-16 mr-4" />
                <span className="text-2xl font-semibold">Lulus</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <XCircle className="w-16 h-16 mr-4" />
                <span className="text-2xl font-semibold">Belum Lulus</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="text-center mb-4">
              <span className="text-5xl font-bold text-blue-900">
                {result.score}%
              </span>
              <p className="text-blue-700 mt-2">Skor Anda</p>
            </div>

            <div className="h-4 bg-gray-200 rounded-full mb-4">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${result.score}%` }}
              />
            </div>

            <div className="flex justify-between text-blue-900">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="bg-green-100 rounded-lg p-4">
              <span className="text-3xl font-bold text-green-700">
                {result.correctAnswers}
              </span>
              <p className="text-green-600 mt-2">Jawaban Benar</p>
            </div>
            <div className="bg-red-100 rounded-lg p-4">
              <span className="text-3xl font-bold text-red-700">
                {result.totalQuestions - result.correctAnswers}
              </span>
              <p className="text-red-600 mt-2">Jawaban Salah</p>
            </div>
          </div>

          <button
            onClick={() => router.push(`/quiz/${result.quizId}`)}
            className="mt-8 w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
