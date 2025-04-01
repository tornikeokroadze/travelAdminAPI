import Faq from "../models/faq.model.js";

// Get all faq
export const getFaqs = async (req, res, next) => {
  try {
    const faq = await Faq.findAll();
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// Get a single faq by ID
export const getFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res
        .status(404)
        .json({ success: false, message: "Faq not found" });
    }
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

// Create a new faq
export const createFaq = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const newFaq = await Faq.create({ title, description });

    res.status(201).json({ success: true, data: newFaq });
  } catch (error) {
    next(error);
  }
};

// Update a faq
export const updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) {
      return res
        .status(404)
        .json({ success: false, message: "Faq not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { title, description } = req.body;

    const updatedFaq = await Faq.update(id, { title, description });

    res.status(200).json({ success: true, data: updatedFaq });
  } catch (error) {
    next(error);
  }
};

// Delete a Faq
export const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Faq.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Faq not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Faq deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
