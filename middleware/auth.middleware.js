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

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    // if (req.cookies.token !== token) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Token is invalid" });
    // }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
      const admin = await Admin.findById(decoded.adminId);

      if (!admin)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      if (admin.block)
        return res
          .status(403)
          .json({ success: false, reason: "blocked", message: "This account is blocked" });

      if (
        (req.originalUrl.includes("/admin") || req.originalUrl.includes("/db")) &&
        admin.job_title !== "Administartor"
      ) {
        return res
          .status(403)
          .json({ success: false, message: "You have no permission" });
      }

      if (
        req.method == "POST" &&
        admin.role < 2 &&
        !req.originalUrl.includes("/sign-out")
      ) {
        return res
          .status(403)
          .json({ success: false, message: "You have no permission" });
      }

      if (req.method == "PUT" && admin.role < 3) {
        return res
          .status(403)
          .json({ success: false, message: "You have no permission" });
      }

      if (req.method == "DELETE" && admin.role < 4) {
        return res
          .status(403)
          .json({ success: false, message: "You have no permission" });
      }

      req.admin = admin;

      next();
    } else {
      throw new Error("error in the token");
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
