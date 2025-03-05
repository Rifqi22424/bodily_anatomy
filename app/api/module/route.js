//module
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../utils/auth";
import path from "path";
import { writeFile } from "fs/promises";

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
    const image = formData.get("image"); // File input

    if (!title || !description || !content || !image) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save the image locally (or replace this with cloud storage logic)
    const filePath = `./public/uploads/${Date.now()}-${image.name}`;
    await writeFile(filePath, Buffer.from(await image.arrayBuffer()));

    // Generate the URL (modify this for cloud storage)
    const imageUrl = `/uploads/${path.basename(filePath)}`;

    // Create the module entry in the database
    const module = await prisma.module.create({
      data: {
        title,
        description,
        x,
        y,
        content,
        imageUrl,
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

    if (!module || module.userId !== decoded.id) {
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

    const module = await prisma.module.findUnique({ where: { id } });

    if (!module || module.userId !== decoded.id) {
      return Response.json(
        { message: "Module not found or unauthorized" },
        { status: 403 }
      );
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
