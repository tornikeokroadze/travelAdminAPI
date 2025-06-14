import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import Admin from "../models/admin.model.js";
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  NODE_ENV,
  BASE_URL,
  SENDING_EMAIL_ADDRESS,
} from "../config/env.js";
import validator from "validator";
import transport from "../middleware/sendMail.middleware.js";

export const signUp = async (req, res, next) => {
  const { name, email, password, job_title, role } = req.body;

  try {
    // Check if a admin already exists in the database
    const existingAdmin = await Admin.findByEmail(email);

    if (existingAdmin) {
      const error = new Error("Admin already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new Admin in the database
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      job_title,
      role,
    });

    // Generate a JWT token for the admin
    const token = jwt.sign({ adminId: newAdmin.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        token,
        admin: newAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const saveToken = req.cookies.token;
    if (saveToken) {
      return res.status(403).json({
        success: false,
        message:
          "You are already signed in. Logout first before signing in again.",
        token: saveToken,
      });
    }

    let email = req.body.email || "";
    let password = req.body.password || "";

    email = validator.trim(email || "");
    email = validator.normalizeEmail(email);
    password = validator.trim(password || "");
    password = validator.escape(password);

    const admin = await Admin.findByEmail(email);

    // If the admin doesn't exist
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (admin.block) {
      return res
        .status(403)
        .json({ success: false, message: "This account is blocked" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, admin.password);

    // If password doesn't match
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate a JWT token for the admin
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Save token and send the response
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Admin signed in successfully",
        data: {
          token,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            job_title: admin.job_title,
            role: admin.role,
            created_at: admin.created_at,
            updated_at: admin.updated_at,
          },
        },
      });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // if (!req.cookies.token) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "You are already signed out",
    //   });
    // }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Admin signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const saveToken = req.cookies.token;
    if (saveToken) {
      return res.status(403).json({
        success: false,
        message: "You are already signed in",
      });
    }

    const { email } = req.body;

    const admin = await Admin.findByEmail(email);

    // If the admin doesn't exist
    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 404;
      throw error;
    }

    if (admin.block) {
      return res
        .status(403)
        .json({ success: false, message: "This account is blocked" });
    }

    // Generate reset token (32 bytes, hex format)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set expiration time
    const resetTokenExpires = new Date(Date.now() + 600000); // 10 minutes

    // Save token & expiration in the database
    await Admin.saveResetToken(email, resetToken, resetTokenExpires);

    // Generate Reset Link
    const resetLink = `${BASE_URL}reset-password?token=${resetToken}`;

    console.log(resetLink);

    // Send Email with Reset Link
    // await transport.sendMail({
    //   from: SENDING_EMAIL_ADDRESS,
    //   to: admin.email,
    //   subject: "Password Reset Request",
    //   html: `<p>You requested a password reset.</p>
    //          <p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    // });

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email.",
      resetToken: resetToken, // The token should not be sent!!!!!!!
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Token and password required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    const admin = await Admin.verifyResetToken(token);

    if (!admin)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await Admin.resetPassword(admin.email, hashedPassword);

    res.json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
};
