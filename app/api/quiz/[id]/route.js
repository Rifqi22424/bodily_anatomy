import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get a quiz by ID
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // Ambil ID dari query parameter

  if (!id) {
    return Response.json({ message: "Quiz ID is required" }, { status: 400 });
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 });
    }

    return Response.json(quiz, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
