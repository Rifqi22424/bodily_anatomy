"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/auth_context";
import { ArrowLeft, TrendingUp, Award, Clock } from "lucide-react";

export default function LearningReport() {
  const router = useRouter();
  const { token } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attempt", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const sortedAttempts = Object.values(data)
          .filter((attempt) => typeof attempt === "object")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAttempts(sortedAttempts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching attempts:", error);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className=" bg-gradient-to-b from-blue-50 to-blue-200 text-black h-screen w-screen flex flex-col justify-center items-center">
        <div className="w-20 h-20 animate-spin">
          <span className="text-4xl">🦴</span>
        </div>
        <p className="mt-4 text-lg font-semibold text-blue-800">Loading...</p>
      </div>
    );
  }

  const averageScore =
    attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length;
  const totalQuizzes = attempts.length;
  const bestScore = Math.max(...attempts.map((attempt) => attempt.score));

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center text-blue-900 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Dashboard
        </button>

        <h1 className="text-3xl font-bold text-blue-900 mb-6">
          Laporan Belajar
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <TrendingUp className="w-12 h-12 text-blue-500 mr-4" />
            <div>
              <p className="text-lg font-semibold text-blue-900">
                Rata-rata Skor
              </p>
              <p className="text-3xl font-bold text-blue-700">
                {averageScore.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <Award className="w-12 h-12 text-yellow-500 mr-4" />
            <div>
              <p className="text-lg font-semibold text-blue-900">
                Skor Tertinggi
              </p>
              <p className="text-3xl font-bold text-blue-700">{bestScore}%</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center">
            <Clock className="w-12 h-12 text-green-500 mr-4" />
            <div>
              <p className="text-lg font-semibold text-blue-900">Total Quiz</p>
              <p className="text-3xl font-bold text-blue-700">{totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Riwayat Quiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attempts.map((attempt, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-blue-900">
                    Quiz #{index + 1}
                  </p>
                  <p className="text-sm text-blue-700">
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mb-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${attempt.score}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-green-600">
                    Benar: {attempt.correctAnswers}/{attempt.totalQuestions}
                  </p>
                  <p className="font-bold text-blue-900">{attempt.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
