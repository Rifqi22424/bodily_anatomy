import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const adminUsername = "admin";
  const adminPassword = "Admin123!"; // Ubah sesuai kebutuhan

  // Hash password
  const hashedPassword = await hashPassword(adminPassword);

  // Cek apakah user admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true, // Admin langsung diverifikasi
      },
    });

    console.log("✅ Admin user berhasil dibuat!");
  } else {
    console.log("⚠️ Admin user sudah ada, tidak perlu dibuat lagi.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
