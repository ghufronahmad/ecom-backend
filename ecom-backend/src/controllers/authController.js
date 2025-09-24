import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const exist = await prisma.user.findUnique({ where: { email } });
    if (exist) return res.status(400).json({ message: "Email already used" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 20 * 60 * 1000); // OTP berlaku 10 menit
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        name, 
        username, 
        email, 
        password: hashedPassword,
        otpCode: otp,
        otpExpiry: otpExpiry,
        isVerified: false
       },
    });

    await sendEmail(email, "Your Verification Code", `Your OTP is: ${otp}`);

    res.json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Account not verified. Please check your email for OTP." 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.json({ message: "Login success", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetExpiry },
    });

    await sendEmail(email, "Password Reset", `Your reset token: ${resetToken}`);

    res.json({ message: "Reset token sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpiry: { gte: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid/expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetExpiry: null },
    });

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    await prisma.user.update({
      where: { email },
      data: { otpCode: otp, otpExpiry },
    });

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.otpCode !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid/expired OTP" });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true, 
        otpCode: null,    
        otpExpiry: null,
      },
    });

    res.json({ message: "OTP verified successfully. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
