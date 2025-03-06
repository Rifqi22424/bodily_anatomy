"use client";

import { AuthProvider } from "./contexts/auth_context";
import { QuizProvider } from "./contexts/quiz_context";

export default function Provider({ children }) {
  return (
    <AuthProvider>
      <QuizProvider>{children}</QuizProvider>
    </AuthProvider>
  );
}
