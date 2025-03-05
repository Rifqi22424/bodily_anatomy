import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with matching token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(), // Token not expired
        },
      },
    });

    console.log(user);

    if (!user) {
      return Response.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });

    return Response.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
