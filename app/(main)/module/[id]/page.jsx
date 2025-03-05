"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ModuleDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [view, setView] = useState("outside"); // 'outside' or 'inside'
  const [moduleData, setModuleData] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch module data
      fetch(`/api/module/${id}`)
        .then((res) => res.json())
        .then((data) => setModuleData(data));
    }
  }, [id]);

  const handleStartQuiz = (id) => {
    router.push(`/quiz/${id}`);
  };

  if (!moduleData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between mb-6">
            <button onClick={() => router.back()} className="text-blue-800">
              ← Kembali
            </button>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded ${
                  view === "outside" ? "bg-yellow-400" : "bg-gray-200"
                }`}
                onClick={() => setView("outside")}
              >
                Luar
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  view === "inside" ? "bg-yellow-400" : "bg-gray-200"
                }`}
                onClick={() => setView("inside")}
              >
                Dalam
              </button>
            </div>
          </div>

          <div className="mb-8">
            <Image
              src={(view === "outside"
                ? moduleData.imageUrl
                : moduleData.imageUrl
              )?.replace(/ /g, "%20")}
              alt={`anatomy`}
              width={400}
              height={400}
              className="mx-auto"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {moduleData.title}
            </h2>
            <div className="text-blue-800">{moduleData.description}</div>
            <div className="text-blue-800">{moduleData.content}</div>
          </div>

          <button
            onClick={() => handleStartQuiz(moduleData.quizId)}
            className="mt-8 w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Mulai Kuis
          </button>
        </div>
      </div>
    </div>
  );
}
