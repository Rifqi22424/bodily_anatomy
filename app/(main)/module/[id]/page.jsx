"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

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
  }, []);

  const handleStartQuiz = (id) => {
    router.push(`/quiz/${id}`);
  };

  if (!moduleData)
    return (
      <div className=" bg-gradient-to-b from-blue-50 to-blue-200 text-black h-screen w-screen flex flex-col justify-center items-center">
        <div className="w-20 h-20 animate-spin">
          <span className="text-4xl">🦴</span>
        </div>
        <p className="mt-4 text-lg font-semibold text-blue-800">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-blue-900 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
            </button>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded cursor-pointer ${
                  view === "outside"
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                onClick={() => setView("outside")}
              >
                Luar
              </button>
              <button
                className={`px-4 py-2 rounded cursor-pointer ${
                  view === "inside"
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-500"
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
                ? moduleData.outsideImageUrl
                : moduleData.insideImageUrl
              )?.replace(/ /g, "%20")}
              alt={`anatomy`}
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {moduleData.title}
            </h2>
            <div className="text-blue-800 mb-2">{moduleData.description}</div>
            <div className="text-blue-800 text-justify">
              {moduleData.content}
            </div>
          </div>

          {moduleData.quizId !== null && (
            <button
              onClick={() => handleStartQuiz(moduleData.quizId)}
              className="mt-8 w-full bg-yellow-400 text-white py-3 px-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              Mulai Kuis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
