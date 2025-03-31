import jwt from "jsonwebtoken";

import Admin from "../models/admin.model.js";
import { JWT_SECRET } from "../config/env.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded) {
      const admin = await Admin.findById(decoded.adminId);

      if (!admin) return res.status(401).json({ message: "Unauthorized" });

      req.admin = admin;

      next();
    } else {
      throw new Error('error in the token');
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
