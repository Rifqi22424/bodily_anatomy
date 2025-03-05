import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../utils/auth";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

// ✅ Create a new quiz with questions (each question may have an image)
export async function POST(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse multipart form data
    const formData = await req.formData();
    const moduleId = formData.get("moduleId");
    const title = formData.get("title");
    const description = formData.get("description");
    const questions = JSON.parse(formData.get("questions") || "[]"); // Convert to array

    if (!moduleId || !title || !description || !questions.length) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // **Cek apakah sudah ada kuis untuk moduleId ini**
    const existingQuiz = await prisma.quiz.findUnique({
      where: { moduleId },
      include: { questions: true },
    });

    if (existingQuiz) {
      // **Hapus quiz lama beserta pertanyaan dan pilihan jawabannya**
      await prisma.quiz.delete({
        where: { id: existingQuiz.id },
      });
    }

    // Proses setiap pertanyaan dan cek apakah ada gambar
    const questionData = await Promise.all(
      questions.map(async (q, index) => {
        const image = formData.get(`questionImage${index}`); // Ambil gambar sesuai indeks pertanyaan
        let imageUrl = null;

        if (image) {
          const filePath = `./public/uploads/${Date.now()}-${image.name}`;
          await writeFile(filePath, Buffer.from(await image.arrayBuffer()));
          imageUrl = `/public/uploads/${path.basename(filePath)}`;
        }

        return {
          text: q.text,
          imageUrl, // Simpan URL gambar pertanyaan (jika ada)
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        };
      })
    );

    // Simpan kuis tanpa imageUrl karena tidak diperlukan
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        moduleId,
        questions: {
          create: questionData,
        },
      },
    });

    await prisma.module.update({
      where: {
        id: moduleId,
      },
      data: {
        quizId: quiz.id,
      },
    });

    return Response.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Quiz creation error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ✅ Submit quiz attempt
export async function PUT(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quizId, answers } = await req.json();

    // Cek apakah user ada
    const userExists = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!userExists) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Fetch quiz details
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    });

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const userAnswer = answers.find((a) => a.questionId === question.id);
      if (userAnswer) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (correctOption && userAnswer.optionId === correctOption.id) {
          correctAnswers++;
        }
      }
    }

    const score = (correctAnswers / totalQuestions) * 100;

    // Save quiz attempt
    await prisma.quizAttempt.create({
      data: {
        userId: decoded.id,
        quizId,
        score,
        totalQuestions,
        correctAnswers,
      },
    });

    return Response.json(
      { score, correctAnswers, totalQuestions, passed: score >= 70 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz submission error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
