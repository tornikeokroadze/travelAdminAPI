import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const { name, email, password, job_title } = req.body;

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
    const { email, password } = req.body;

    const admin = await Admin.findByEmail(email);

    // If the admin doesn't exist
    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, admin.password);

    // If password doesn't match
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Generate a JWT token for the admin
    const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Send the response
    res.status(200).json({
      success: true,
      message: "Admin signed in successfully",
      data: {
        token,
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
