import { verifyToken } from "../../../utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get a quiz by ID
// export async function GET(req, context) {
//   const { params } = context;
//   const id = params?.id;
export async function GET(req, { params }) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // Ambil ID dari params

    if (!id) {
      return Response.json({ message: "Quiz ID is required" }, { status: 400 });
    }
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
