import ContactLid from "../models/contactLid.model.js";

// Get all contactLid
export const getContactLids = async (req, res, next) => {
  try {
    const contactLid = await ContactLid.findAll();
    res.status(200).json({ success: true, data: contactLid });
  } catch (error) {
    next(error);
  }
};

// Get a single contactLid by ID
export const getContactLid = async (req, res, next) => {
  try {
    const contactLid = await ContactLid.findById(req.params.id);
    if (!contactLid) {
      return res
        .status(404)
        .json({ success: false, message: "ContactLid not found" });
    }
    res.status(200).json({ success: true, data: contactLid });
  } catch (error) {
    next(error);
  }
};

// Delete a ContactLid
export const deleteContactLid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await ContactLid.delete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "ContactLid not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "ContactLid deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
