"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "./auth_context";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [answers, setAnswers] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const { token } = useAuth();
  const [quizProgress, setQuizProgress] = useState({
    total: 0,
    completed: 0,
  });

  const saveAnswer = (questionId, optionId) => {
    setAnswers((prev) => {
      // Periksa apakah jawaban untuk questionId sudah ada
      const existingIndex = prev.findIndex(
        (item) => item.questionId === questionId
      );

      if (existingIndex !== -1) {
        // Jika sudah ada, update jawaban yang lama
        const updatedAnswers = [...prev];
        updatedAnswers[existingIndex] = { questionId, optionId };
        return updatedAnswers;
      } else {
        // Jika belum ada, tambahkan jawaban baru
        return [...prev, { questionId, optionId }];
      }
    });
  };

  const startQuiz = (quizData) => {
    if (!quizData) return;
    setCurrentQuiz(quizData);
    setQuizProgress({
      total: quizData.questions.length,
      completed: 0,
    });
    setAnswers([]);
  };

  const submitQuiz = async () => {
    if (!currentQuiz) {
      console.error("Error: currentQuiz is null");
      return;
    }

    console.log("currentQuiz id ", currentQuiz.id);
    console.log("answers ", answers);

    const payload = {
      quizId: currentQuiz.id, // Pastikan quizId tidak null
      answers, // Langsung gunakan answers karena sudah dalam format yang benar
    };

    try {
      const response = await fetch("/api/quiz", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Gunakan token dari user
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Result ", result);

      return result;
    } catch (error) {
      console.error("Error submitting quiz:", error);
      throw error;
    }
  };

  return (
    <QuizContext.Provider
      value={{
        answers,
        currentQuiz,
        quizProgress,
        saveAnswer,
        startQuiz,
        submitQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);
