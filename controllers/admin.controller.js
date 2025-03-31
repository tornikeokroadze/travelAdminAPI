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
        return res.status(404).json({ success: false, message: "Admin not found" });
      }
      res.status(200).json({ success: true, data: admin });
    } catch (error) {
      next(error);
    }
  };
  
  // Create a new admin
  export const createAdmin = async (req, res, next) => {
    try {
      const { name, email, password, job_title } = req.body;
  
      const newAdmin = await Admin.create({
        name,
        email,
        password,
        job_title,
      });
  
      res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
      next(error);
    }
  };