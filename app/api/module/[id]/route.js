//module
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get a single module
export async function GET(req, { params }) {
  const { id } = await params;
  console.log(id);

  try {
    const module = await prisma.module.findUnique({
      where: { id },
      select: {
        title: true,
        description: true,
        content: true,
        outsideImageUrl: true,
        insideImageUrl: true,
        quizId: true,
      },
    });
    if (!module) {
      return Response.json({ message: "Module not found" }, { status: 404 });
    }
    return Response.json(module, { status: 200 });
  } catch (error) {
    console.error("Fetch module error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
