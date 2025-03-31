import Contact from "../models/contact.model.js";

// Get contact
export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(1);
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

// Update contact
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { phone, location, email, facebook, instagram, youtube, whatsapp } =
      req.body;

    const updatedContact = await Contact.update(id, {
      phone,
      location,
      email,
      facebook,
      instagram,
      youtube,
      whatsapp,
    });

    res.status(200).json({ success: true, data: updatedContact });
  } catch (error) {
    next(error);
  }
};
