//module
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../utils/auth";
import { del, put } from "@vercel/blob";

const prisma = new PrismaClient();

// ✅ Create a new module with image upload
export async function POST(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse the multipart form data
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const content = formData.get("content");
    let x = formData.get("x");
    let y = formData.get("y");
    x = parseInt(x);
    y = parseInt(y);
    const outsideImage = formData.get("outsideImage"); // File input
    const insideImage = formData.get("insideImage"); // File input

    if (!title || !description || !content || !outsideImage || !insideImage) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload images to Vercel Blob
    const outsideImageBlob = await put(
      `uploads/${Date.now()}-${outsideImage.name}`,
      outsideImage.stream(),
      {
        access: "public",
      }
    );
    const insideImageBlob = await put(
      `uploads/${Date.now()}-${insideImage.name}`,
      insideImage.stream(),
      {
        access: "public",
      }
    );

    // Get the URLs of the uploaded images
    const outsideImageUrl = outsideImageBlob.url;
    const insideImageUrl = insideImageBlob.url;

    // Create the module entry in the database
    const module = await prisma.module.create({
      data: {
        title,
        description,
        x,
        y,
        content,
        outsideImageUrl,
        insideImageUrl,
        userId: decoded.id,
      },
    });

    return Response.json(module, { status: 201 });
  } catch (error) {
    console.error("Module creation error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ✅ Get all modules
export async function GET(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        title: true,
        outsideImageUrl: true,
        description: true,
        x: true,
        y: true,
      },
    });
    return Response.json(modules, { status: 200 });
  } catch (error) {
    console.error("Fetch modules error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ✅ Update a module
export async function PUT(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, description, content, imageUrl } = await req.json();

    const module = await prisma.module.findUnique({ where: { id } });

    if (!module || decoded.role !== "ADMIN") {
      return Response.json(
        { message: "Module not found or unauthorized" },
        { status: 403 }
      );
    }

    const updatedModule = await prisma.module.update({
      where: { id },
      data: { title, description, content, imageUrl },
    });

    return Response.json(updatedModule, { status: 200 });
  } catch (error) {
    console.error("Update module error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ✅ Delete a module
export async function DELETE(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();

    const module = await prisma.module.findUnique({
      where: { id },
      include: { quiz: { include: { questions: true } } },
    });

    if (!module || decoded.role !== "ADMIN") {
      return Response.json(
        { message: "Module not found or unauthorized" },
        { status: 403 }
      );
    }

    // Delete blob images associated with the module
    if (module.outsideImageUrl) {
      try {
        const outsideBlobUrl = new URL(module.outsideImageUrl);
        await del(outsideBlobUrl);
        console.log(`Deleted outside image blob for module ID: ${module.id}`);
      } catch (blobError) {
        console.error(
          `Failed to delete outside image blob for module ID: ${module.id}`,
          blobError
        );
        // Continue with deletion even if blob delete fails
      }
    }

    if (module.insideImageUrl) {
      try {
        const insideBlobUrl = new URL(module.insideImageUrl);
        await del(insideBlobUrl);
        console.log(`Deleted inside image blob for module ID: ${module.id}`);
      } catch (blobError) {
        console.error(
          `Failed to delete inside image blob for module ID: ${module.id}`,
          blobError
        );
        // Continue with deletion even if blob delete fails
      }
    }

    // Delete blob images associated with quiz questions if the module has a quiz
    if (module.quiz) {
      for (const question of module.quiz.questions) {
        if (question.imageUrl) {
          try {
            const questionBlobUrl = new URL(question.imageUrl);
            await del(questionBlobUrl);
            console.log(`Deleted image blob for question ID: ${question.id}`);
          } catch (blobError) {
            console.error(
              `Failed to delete image blob for question ID: ${question.id}`,
              blobError
            );
            // Continue with deletion even if blob delete fails
          }
        }
      }
    }

    await prisma.module.delete({ where: { id } });

    return Response.json(
      { message: "Module deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete module error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
