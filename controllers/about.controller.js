import About from "../models/about.model.js";

// Get about
export const getAbout = async (req, res, next) => {
  try {
    const about = await About.findById(1);
    res.status(200).json({ success: true, data: about });
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

    const { title, description, image } = req.body;

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
