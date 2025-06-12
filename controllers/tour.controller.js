import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";

import Tour from "../models/tour.model.js";
import Gallery from "../models/gallery.model.js";

export const getTours = async (req, res, next) => {
  try {
    const tours = await Tour.findAll();

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    // Get all tour IDs
    const tourIds = tours.map((t) => t.id);

    // Get all gallery images for the listed tours
    const galleries = await Gallery.findManyByTourIds(tourIds);

    // Group gallery images by tourId
    const galleryMap = {};
    for (const image of galleries) {
      const tourId = image.tourId;
      if (!galleryMap[tourId]) {
        galleryMap[tourId] = [];
      }

      galleryMap[tourId].push({
        ...image,
        image: `${hostUrl}/uploads/images/${image.image}`,
      });
    }

    const toursWithImageUrl = tours.map((tour) => ({
      ...tour,
      image: tour.image ? `${hostUrl}/uploads/images/${tour.image}` : null,
      gallery: galleryMap[tour.id] || [],
    }));

    res.status(200).json({
      success: true,
      data: toursWithImageUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single tour by ID
export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    const imageUrl = tour.image
      ? `${req.protocol}://${req.get("host")}/uploads/images/${tour.image}`
      : null;

    res.status(200).json({
      success: true,
      data: {
        ...tour,
        image: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a new tour
export const createTour = async (req, res, next) => {
  // Check for validation errors
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     success: false,
  //     errors: errors.array(),
  //   });
  // }

  try {
    const {
      title,
      description,
      location,
      price,
      duration,
      startDate,
      endDate,
      typeId,
      bestOffer,
      adventures,
      experience,
    } = req.body;

    const image = req.files?.["image"]?.[0]?.filename || null;
    const gallery = req.files?.["gallery[]"];

    const newTour = await Tour.create({
      title,
      description,
      location,
      price,
      duration,
      startDate,
      endDate,
      image,
      typeId,
      bestOffer,
      adventures,
      experience,
    });

    if (gallery && gallery.length > 0) {
      const galleryPromises = gallery.map((file) => {
        return Gallery.create({
          tourId: newTour.id,
          image: file.filename,
        });
      });

      // Wait for all images to be saved
      await Promise.all(galleryPromises);
    }

    res.status(201).json({ success: true, data: newTour });
  } catch (error) {
    next(error);
  }
};

// Update a tour
export const updateTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    const {
      title,
      description,
      location,
      price,
      duration,
      startDate,
      endDate,
      typeId,
      bestOffer,
      adventures,
      experience,
    } = req.body;

    const uploadedImage = req.files?.["image"]?.[0]?.filename || null;
    const image = uploadedImage ?? tour.image;

    if (uploadedImage && tour.image) {
      const oldImagePath = path.join("uploads", "images", tour.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // === Handle gallery images ===
    const existingImages = req.body["existingGallery"];
    const keptFilenames = Array.isArray(existingImages)
      ? existingImages
      : existingImages
      ? [existingImages]
      : [];

    // Find the current filenames in the gallery
    const currentGallery = await Gallery.findByTourId(id);
    const currentFilenames = currentGallery.map((img) => img.image);

    // === Handle the case where images are only being added, not deleted ===
    // Add the new gallery images
    const newGalleryFiles = req.files?.["gallery[]"] || [];
    const newGallery = newGalleryFiles.map((file) => ({
      tourId: id,
      image: file.filename,
    }));

    // Only insert the new gallery images into the database
    if (newGallery.length > 0) {
      await Gallery.insertMany(newGallery);
    }

    // Delete only images that are explicitly removed ===
    const deletedFilenames = currentFilenames.filter(
      (filename) => !keptFilenames.includes(filename)
    );

    // Remove only the files that should be deleted
    for (const filename of deletedFilenames) {
      const filePath = path.join("uploads", "images", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await Gallery.deleteByFilename(filename); // Remove the record from the database
    }

    // === Update Tour ===
    const updatedTour = await Tour.update(id, {
      title,
      description,
      location,
      price,
      duration,
      startDate,
      endDate,
      image,
      typeId,
      bestOffer,
      adventures,
      experience,
    });

    return res.status(200).json({ success: true, data: updatedTour });
  } catch (error) {
    next(error);
  }
};

// Delete a tour
export const deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    if (tour.image) {
      const imagePath = path.join("uploads", "images", tour.image);

      // Check if the old image exists
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the old image
      }
    }

    const galleryImages = await Gallery.findByTourId(id);
    for (const image of galleryImages) {
      const galleryImagePath = path.join("uploads", "images", image.image);
      // Check if the gallery images exists
      if (fs.existsSync(galleryImagePath)) {
        fs.unlinkSync(galleryImagePath); // Delete the gallery images
      }
    }

    await Gallery.deleteByTourId(id); //delete gallery

    const result = await Tour.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteManyTours = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of tour IDs to delete",
      });
    }

    const tours = await Tour.findManyByIds(ids);

    for (const tour of tours) {
      if (tour.image) {
        const imagePath = path.join("uploads", "images", tour.image);

        // Check if the old image exists
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Delete the old image
        }
      }

      const galleryImages = await Gallery.findByTourId(tour.id);

      for (const image of galleryImages) {
        const galleryImagePath = path.join("uploads", "images", image.image);

        // Check if the gallery image exists and delete it
        if (fs.existsSync(galleryImagePath)) {
          fs.unlinkSync(galleryImagePath);
        }
      }

      // Delete gallery entries from DB
      await Gallery.deleteByTourId(tour.id);
    }

    const result = await Tour.deleteMany(ids);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No tours found for deletion",
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.rowCount} tour(s) deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Search a tours
export const searchTours = async (req, res, next) => {
  try {
    const filters = req.query;

    if (!filters) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await Tour.search(filters);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

// Export tours in CSV format
export const exportToursToCSV = async (req, res, next) => {
  try {
    const tours = await Tour.findAll();

    const fields = [
      "id",
      "title",
      "description",
      "location",
      "price",
      "duration",
      "startDate",
      "endDate",
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(tours);

    res.header("Content-Type", "text/csv");
    res.attachment("tours.csv");
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
