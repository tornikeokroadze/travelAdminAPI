import fs from "fs";
import path from "path";

import Gallery from "../models/gallery.model.js";

// Get all gallery
export const getGalleries = async (req, res, next) => {
  try {
    const gallery = await Gallery.findAll();
    res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
};

// Get a single gallery by ID
export const getGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }
    res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    next(error);
  }
};

// Create a new gallery
export const createGallery = async (req, res, next) => {
  try {
    const { tourId } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }

    const galleryPromises = images.map((file) => {
      const imagePath = file.filename;
      return Gallery.create({
        tourId,
        image: imagePath,
      });
    });

    // Wait for all images to be saved
    const newGallery = await Promise.all(galleryPromises);

    res.status(201).json({ success: true, data: newGallery });
  } catch (error) {
    next(error);
  }
};

// Update a gallery
export const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tourId } = req.body;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    const imagePath = req.file ? req.file.filename : null;

    if (!imagePath) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    // DELETE OLD FILE from uploads/images
    // const oldImagePath = path.join("uploads", "images", gallery.image);
    // fs.unlink(oldImagePath, (err) => {
    //   if (err) {
    //     console.error("Failed to delete old image:", err.message);
    //   }
    // });

    const updatedGallery = await Gallery.update(id, {
      tourId,
      image: imagePath,
    });

    res.status(200).json({ success: true, data: updatedGallery });
  } catch (error) {
    next(error);
  }
};

// Delete a gallery
export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const result = await Gallery.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    const imagePath = path.join("uploads", "images", gallery.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.warn("Warning: Failed to delete image file:", err.message);
      }
    });

    res.status(200).json({
      success: true,
      message: "Gallery and image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
