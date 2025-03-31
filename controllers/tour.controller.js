import Tour from "../models/tour.model.js";

// Get all tours
export const getTours = async (req, res, next) => {
  try {
    const tours = await Tour.findAll();
    res.status(200).json({ success: true, data: tours });
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
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    next(error);
  }
};

// Create a new tour
export const createTour = async (req, res, next) => {
  try {
    const {
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
    } = req.body;

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

    res.status(201).json({ success: true, data: newTour });
  } catch (error) {
    next(error);
  }
};

// Update a tour
export const updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    const { id } = req.params; // Get id from URL params
    
    const {
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
    } = req.body;

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

    res.status(200).json({ success: true, data: updatedTour });
  } catch (error) {
    next(error);
  }
};

// Delete a tour
export const deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;

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
