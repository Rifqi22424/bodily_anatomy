import { verifyToken } from "../../utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get a single quizAttempt
export async function GET(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const quizAttempt = await prisma.quizAttempt.findMany({
      where: { userId: decoded.id },
      select: {
        userId: true,
        quizId: true,
        score: true,
        correctAnswers: true,
        totalQuestions: true,
        createdAt: true,
      },
    });

    if (!quizAttempt) {
      return Response.json(
        { message: "Quiz Attempt not found" },
        { status: 404 }
      );
    }
    return Response.json(
      {
        ...quizAttempt,
        passed: quizAttempt.score >= 70,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch quizAttempt error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
