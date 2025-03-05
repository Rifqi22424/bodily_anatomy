import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  generateVerificationToken,
  sendVerificationEmail,
} from "../../../utils/auth";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Gunakan req.json() karena ini Server Action

    const body = await req.json();
    const { username, email, password } = body;

    // Validate input
    if (!username || !email || !password) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      return Response.json(
        { message: "Username or email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpires,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return Response.json(
      {
        message:
          "User registered successfully. Please check your email to verify.",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
