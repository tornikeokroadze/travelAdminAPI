import bcrypt from "bcryptjs";

import Admin from "../models/admin.model.js";

// Get all admins
export const getAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
};

// Get a single admin by ID
export const getAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

// Create a new admin
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, job_title, role } = req.body;

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

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      job_title,
      role,
    });

    res.status(201).json({ success: true, data: newAdmin });
  } catch (error) {
    next(error);
  }
};

// Update a admin
export const updateAdmin = async (req, res, next) => {
  try {
    const adminId = await Admin.findById(req.params.id);

    if (!adminId) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { name, email, password, new_password, job_title, role, block } = req.body;

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

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    const updatedAdmin = await Admin.update(id, {
      name,
      email,
      password: hashedPassword,
      job_title,
      role,
      block,
    });

    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    next(error);
  }
};

// Delete a admin
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    if(admin.job_title === "Administartor") {
      return res.status(403).json({ message: "You can not delete Administartor" });
    }

    const result = await Admin.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
