"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "../../../contexts/quiz_context";

export default function Quiz() {
  const router = useRouter();
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { answers, saveAnswer, submitQuiz, startQuiz, currentQuiz } = useQuiz();

  useEffect(() => {
    if (id) {
      fetch(`/api/quiz/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.questions?.length > 0) {
            setQuestions(data.questions);
            startQuiz(data); // Pastikan Context menerima data quiz
          }
        })
        .catch((error) => console.error("Error fetching quiz:", error));
    }
  }, [id, startQuiz]);

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
      if (result) {
        router.push(`/quiz/result/${id}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (!questions.length) return <div>Loading...</div>;

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-blue-100 p-4">
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
              {question.question}
            </h2>
            {question.image && (
              <img
                src={question.image || "/placeholder.svg"}
                alt="Question illustration"
                width={400}
                height={400}
                className="mx-auto mb-6"
              />
            )}
          </div>

          <div className="space-y-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`w-full p-4 text-left rounded-lg border ${
                  answers[question.id] === option.text
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 hover:border-yellow-400"
                }`}
                onClick={() => handleAnswer(option.text)}
              >
                {option.text}
              </button>
            ))}
          </div>

          {currentQuestion === questions.length - 1 && (
            <button
              onClick={handleSubmit}
              className="mt-8 w-full bg-yellow-400 text-blue-900 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
