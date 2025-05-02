import { body } from "express-validator";

export const validateTour = [
  body("title")
    .isLength({ min: 3 })
    .trim()
    .escape()
    .withMessage("Title must be at least 3 characters long"),

  body("description")
    .isLength({ min: 10 })
    .trim()
    .escape()
    .withMessage("Description must be at least 10 characters long"),

  body("location")
    .isLength({ min: 3 })
    .trim()
    .escape()
    .withMessage("Location must be at least 3 characters long"),

  body("price").isNumeric().withMessage("Price must be a number"),

  body("duration")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  body("startDate").isDate().withMessage("Invalid start date"),

  body("endDate").isDate().withMessage("Invalid end date"),

  body("typeId").isInt().withMessage("Type ID must be a valid integer"),

  body("bestOffer")
    .optional()
    .isBoolean()
    .withMessage("Best offer must be a boolean"),

  body("adventures")
    .optional()
    .isBoolean()
    .withMessage("adventures must be a boolean"),

  body("experience")
    .optional()
    .isBoolean()
    .withMessage("experience must be a boolean"),
];