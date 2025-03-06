import { PrismaClient } from "@prisma/client";
import { comparePassword, createUserToken } from "../../../utils/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { credential, password } = await req.json(); // Use req.json() in App Router

    // Validate input
    if (!credential || !password) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: credential }, { username: credential }],
      },
    });

    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return Response.json(
        { message: "Please verify your email first" },
        { status: 403 }
      );
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = createUserToken(user);

    return Response.json(
      {
        message: "Login successful",
        token,
        role: user.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
