"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "../../../contexts/quiz_context";
import { useAuth } from "../../../contexts/auth_context";

export default function Quiz() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { token } = useAuth();
  const { answers, saveAnswer, submitQuiz, startQuiz, currentQuiz } = useQuiz();

  useEffect(() => {
    if (id) {
      fetch(`/api/quiz/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Gunakan token dari user
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.questions?.length > 0) {
            setQuestions(data.questions);
            startQuiz(data); // Pastikan Context menerima data quiz
          }
        })
        .catch((error) => console.error("Error fetching quiz:", error));
    }
  }, []);

  const handleAnswer = (answerText) => {
    if (questions[currentQuestion]) {
      saveAnswer(questions[currentQuestion].id, answerText);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz();
      console.log(result);

      if (result) {
        router.push(`/quiz/result/${result.data.id}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!questions.length)
    return (
      <div className=" bg-gradient-to-b from-blue-50 to-blue-200 text-black h-screen w-screen flex flex-col justify-center items-center">
        <div className="w-20 h-20 animate-spin">
          <span className="text-4xl">🦴</span>
        </div>
        <p className="mt-4 text-lg font-semibold text-blue-800">Loading...</p>
      </div>
    );

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen  bg-gradient-to-b from-blue-50 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <div className="text-sm text-blue-800">
              Pertanyaan {currentQuestion + 1} dari {questions.length}
            </div>
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div
                className="h-full bg-yellow-400 rounded"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {question.text}
            </h2>
            {question.imageUrl && (
              <img
                src={question.imageUrl || "/placeholder.svg"}
                alt="Question illustration"
                width={200}
                height={200}
                className="mx-auto mb-2"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-blue-900">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`w-full p-4 text-left rounded-lg border cursor-pointer ${
                  answers.find((a) => a.questionId === question.id)
                    ?.optionId === option.id
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-yellow-400"
                }`}
                onClick={() => handleAnswer(option.id)}
              >
                {option.text}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 && (
            <button
              onClick={handleSubmit}
              className="mt-8 w-full bg-yellow-400 text-white py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors cursor-pointer"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
