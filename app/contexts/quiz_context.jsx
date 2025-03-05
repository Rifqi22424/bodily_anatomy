"use client";

import { createContext, useContext, useState } from "react";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizProgress, setQuizProgress] = useState({
    total: 0,
    completed: 0,
  });

  const saveAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const startQuiz = (quizData) => {
    if (!quizData) return;
    setCurrentQuiz(quizData);
    setQuizProgress({
      total: quizData.questions.length,
      completed: 0,
    });
    setAnswers({});
  };

  const submitQuiz = async () => {
    if (!currentQuiz) {
      console.error("Error: currentQuiz is null");
      return;
    }

    try {
      const response = await fetch("/api/quiz", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: currentQuiz.id, // Pastikan tidak null
          answers,
        }),
      });

      const result = await response.json();
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
