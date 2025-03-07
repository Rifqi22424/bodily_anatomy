//quiz
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../utils/auth";
import { del, put } from "@vercel/blob";

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

    // Check if a quiz already exists for this moduleId
    const existingQuiz = await prisma.quiz.findUnique({
      where: { moduleId },
      include: { questions: true },
    });

    if (existingQuiz) {
      // Delete all blob images from questions before deleting the quiz
      for (const question of existingQuiz.questions) {
        if (question.imageUrl) {
          try {
            // Extract blob URL from the full URL
            const blobUrl = new URL(question.imageUrl);
            await del(blobUrl);
            console.log(`Deleted blob for question ID: ${question.id}`);
          } catch (blobError) {
            console.error(`Failed to delete blob for question ID: ${question.id}`, blobError);
            // Continue with deletion even if blob delete fails
          }
        }
      }


      // Delete the old quiz along with its questions and answer options
      await prisma.quiz.delete({
        where: { id: existingQuiz.id },
      });
    }

    // Process each question and check if there's an image
    const questionData = await Promise.all(
      questions.map(async (q, index) => {
        const image = formData.get(`questionImage${index}`); // Get image according to question index
        let imageUrl = null;

        if (image) {
          // Upload image to Vercel Blob
          const imageBlob = await put(
            `uploads/quiz/${Date.now()}-${image.name}`,
            image.stream(),
            {
              access: "public",
            }
          );

          // Get the URL of the uploaded image
          imageUrl = imageBlob.url;
        }

        return {
          text: q.text,
          imageUrl, // Store the question image URL (if any)
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        };
      })
    );

    // Save the quiz without imageUrl as it's not needed
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
    const result = await prisma.quizAttempt.create({
      data: {
        userId: decoded.id,
        quizId,
        score,
        totalQuestions,
        correctAnswers,
      },
    });

    return Response.json(
      {
        data: {
          id: result.id,
          // score,
          // correctAnswers,
          // totalQuestions,
          // passed: score >= 70,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz submission error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
