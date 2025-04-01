import Type from "../models/type.model.js";

// Get all types
export const getTypes = async (req, res, next) => {
  try {
    const types = await Type.findAll();
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
};

// Get a single type by ID
export const getType = async (req, res, next) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "Type not found" });
    }
    res.status(200).json({ success: true, data: type });
  } catch (error) {
    next(error);
  }
};

// Create a new type
export const createType = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newType = await Type.create(name);

    res.status(201).json({ success: true, data: newType });
  } catch (error) {
    next(error);
  }
};

// Update a type
export const updateType = async (req, res, next) => {
  try {
    const type = await Type.findById(req.params.id);
    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "Type not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { name } = req.body;

    const updatedType = await Type.update(id, { name });

    res.status(200).json({ success: true, data: updatedType });
  } catch (error) {
    next(error);
  }
};

// Delete a type
export const deleteType = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Type.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Type deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
