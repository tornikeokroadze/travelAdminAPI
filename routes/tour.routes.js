import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { validateTour } from "../middleware/validateTour.middleware.js";
import {
  searchTours,
  exportToursToCSV,
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  deleteManyTours,
} from "../controllers/tour.controller.js";
import { uploadMultiple } from "../middleware/upload.middleware.js";

const tourRouter = Router();

tourRouter.get("/search", authorize, searchTours);
tourRouter.get("/export/csv", authorize, exportToursToCSV);

tourRouter.get("/", authorize, getTours);

tourRouter.get("/:id", authorize, getTour);

tourRouter.post("/", authorize, validateTour, uploadMultiple, createTour);

tourRouter.put("/:id", authorize, uploadMultiple, updateTour);

tourRouter.delete("/delete-many", authorize, deleteManyTours);

tourRouter.delete("/:id", authorize, deleteTour);

export default tourRouter;
