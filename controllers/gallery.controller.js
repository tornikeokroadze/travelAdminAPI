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
    const { tourId, image } = req.body;

    const newGallery = await Gallery.create({ tourId, image });

    res.status(201).json({ success: true, data: newGallery });
  } catch (error) {
    next(error);
  }
};

// Update a gallery
export const updateGallery = async (req, res, next) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { tourId, image } = req.body;

    const updatedGallery = await Gallery.update(id, { tourId, image });

    res.status(200).json({ success: true, data: updatedGallery });
  } catch (error) {
    next(error);
  }
};

// Delete a gallery
export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Gallery.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
