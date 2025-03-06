"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../components/sidebar";
import { useAuth } from "../../contexts/auth_context";

export default function CreateQuiz() {
  const { token } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    moduleId: "",
    title: "",
    description: "",
    questionCount: 1,
  });
  
  const [questions, setQuestions] = useState([
    {
      text: "",
      image: null,
      imagePreview: null,
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);

  // Fetch modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch("/api/module", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch modules");
      }

      const data = await res.json();
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError("Gagal mengambil data module");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setQuestionCount = () => {
    const count = parseInt(formData.questionCount);
    if (count > 0) {
      const newQuestions = [];
      for (let i = 0; i < count; i++) {
        newQuestions.push({
          text: "",
          image: null,
          imagePreview: null,
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
      }
      setQuestions(newQuestions);
      setStep(2);
    }
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const { value } = e.target;
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.forEach((option, idx) => {
      option.isCorrect = idx === optionIndex;
    });
    setQuestions(newQuestions);
  };

  const handleImageChange = (questionIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newQuestions = [...questions];
    newQuestions[questionIndex].image = file;
    newQuestions[questionIndex].imagePreview = URL.createObjectURL(file);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form
    if (!formData.moduleId || !formData.title || !formData.description) {
      setError("Judul, deskripsi, dan module harus diisi");
      setLoading(false);
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text) {
        setError(`Pertanyaan ${i + 1} harus diisi`);
        setLoading(false);
        return;
      }

      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text) {
          setError(`Opsi jawaban ${j + 1} pada pertanyaan ${i + 1} harus diisi`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      const data = new FormData();
      data.append("moduleId", formData.moduleId);
      data.append("title", formData.title);
      data.append("description", formData.description);
      
      // Add questions
      data.append("questions", JSON.stringify(
        questions.map(q => ({
          text: q.text,
          options: q.options
        }))
      ));

      // Add question images
      questions.forEach((question, index) => {
        if (question.image) {
          data.append(`questionImage${index}`, question.image);
        }
      });

      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to create quiz");
      }

      setSuccess("Quiz berhasil dibuat!");
      
      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          moduleId: "",
          title: "",
          description: "",
          questionCount: 1,
        });
        setQuestions([
          {
            text: "",
            image: null,
            imagePreview: null,
            options: [
              { text: "", isCorrect: true },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
          },
        ]);
        setStep(1);
      }, 2000);
      
    } catch (error) {
      console.error("Error creating quiz:", error);
      setError("Gagal membuat quiz. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-blue-200">
      <Sidebar />

      <main className="md:ml-64 min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-900 mb-2">
            Buat Quiz Baru
          </h1>
          <p className="text-blue-800 mb-8">
            Tambahkan quiz untuk module yang sudah ada
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">
                Informasi Quiz
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="moduleId">
                    Pilih Module
                  </label>
                  <select
                    id="moduleId"
                    name="moduleId"
                    value={formData.moduleId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pilih Module --</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Judul Quiz
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan judul quiz"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Deskripsi Quiz
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Tuliskan deskripsi singkat tentang quiz ini"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="questionCount">
                    Jumlah Pertanyaan
                  </label>
                  <input
                    type="number"
                    id="questionCount"
                    name="questionCount"
                    min="1"
                    max="20"
                    value={formData.questionCount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={setQuestionCount}
                  disabled={!formData.moduleId || !formData.title || !formData.description}
                  className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${
                    !formData.moduleId || !formData.title || !formData.description
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Lanjut ke Pertanyaan
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold mb-4 text-blue-800">
                    Buat Pertanyaan Quiz
                  </h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Kembali
                  </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <p className="text-blue-800 font-medium">Module: {modules.find(m => m.id === formData.moduleId)?.title}</p>
                  <p className="text-blue-800 font-medium">Quiz: {formData.title}</p>
                  <p className="text-blue-800">Jumlah Pertanyaan: {formData.questionCount}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                      Pertanyaan {qIndex + 1}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor={`question-${qIndex}`}>
                          Pertanyaan
                        </label>
                        <textarea
                          id={`question-${qIndex}`}
                          value={question.text}
                          onChange={(e) => handleQuestionChange(qIndex, e)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Tuliskan pertanyaan"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">
                          Gambar Pertanyaan (Opsional)
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            onChange={(e) => handleImageChange(qIndex, e)}
                            className="hidden"
                            id={`question-image-${qIndex}`}
                            accept="image/*"
                          />
                          <label
                            htmlFor={`question-image-${qIndex}`}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition"
                          >
                            Pilih Gambar
                          </label>
                          {question.imagePreview && (
                            <div className="relative h-20 w-20 border rounded">
                              <Image
                                src={question.imagePreview}
                                alt="Question preview"
                                layout="fill"
                                objectFit="contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="font-medium text-gray-700">Opsi Jawaban</p>
                        
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center space-x-3">
                            <input
                              type="radio"
                              id={`correct-${qIndex}-${oIndex}`}
                              name={`correct-${qIndex}`}
                              checked={option.isCorrect}
                              onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                              className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                                option.isCorrect
                                  ? "border-green-300 focus:ring-green-500 bg-green-50"
                                  : "border-gray-300 focus:ring-blue-500"
                              }`}
                              placeholder={`Opsi ${oIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`py-3 px-8 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Menyimpan..." : "Simpan Quiz"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}