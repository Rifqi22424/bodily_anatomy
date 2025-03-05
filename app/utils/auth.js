import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const sendVerificationEmail = async (email, token) => {
  // Configure SMTP transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const verificationLink = `${process.env.APP_URL}/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_SERVER_USER,
    to: email,
    subject: "Verify Your Email for Anatomy Learning Platform",
    html: `
      <h1>Email Verification</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const createUserToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
