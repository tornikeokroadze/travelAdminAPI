import Book from "../models/book.model.js";

// Get all book
export const getBooks = async (req, res, next) => {
  try {
    const book = await Book.findAll();
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// Get a single book by ID
export const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

// Update a book
export const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    const { id } = req.params; // Get id from URL params

    const { tourId, name, surname, email, phone, peopleNum, paymentStatus } =
      req.body;

    const updatedBook = await Book.update(id, {
      tourId,
      name,
      surname,
      email,
      phone,
      peopleNum,
      paymentStatus,
    });

    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    next(error);
  }
};
