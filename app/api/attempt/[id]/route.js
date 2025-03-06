import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get a single quizAttempt
export async function GET(req, { params }) {
  const { id } = await params;
  console.log(id);

  try {
    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: { id },
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
      return Response.json({ message: "Quiz Attempt not found" }, { status: 404 });
    }
    return Response.json({
        ...quizAttempt,
        passed: quizAttempt.score >= 70
    }, { status: 200 });
  } catch (error) {
    console.error("Fetch quizAttempt error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
