import fs from "fs";
import path from "path";
import About from "../models/about.model.js";

// Get about
export const getAbout = async (req, res, next) => {
  try {
    const about = await About.findById(1);

    const imageUrl = about.image
      ? `${req.protocol}://${req.get("host")}/uploads/images/${about.image}`
      : null;

    res.status(200).json({
      success: true,
      data: {
        ...about,
        image: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update about
export const updateAbout = async (req, res, next) => {
  try {
    const about = await About.findById(req.params.id);
    if (!about) {
      return res
        .status(404)
        .json({ success: false, message: "About not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { title, description } = req.body;
    const newImage = req.file?.filename;

    if (newImage && about.image) {
      const oldImagePath = path.join("uploads", "images", about.image);

      // Check if the old image exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
    }

    const image = newImage ?? about.image;

    const updatedAbout = await About.update(id, {
      title,
      description,
      image,
    });

    res.status(200).json({ success: true, data: updatedAbout });
  } catch (error) {
    next(error);
  }
};
