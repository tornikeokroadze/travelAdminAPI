import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import {
  searchTours,
  exportToursToCSV,
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tour.controller.js";

const tourRouter = Router();

tourRouter.get("/search", authorize, searchTours);
tourRouter.get('/export/csv', authorize, exportToursToCSV);


tourRouter.get("/", authorize, getTours);

tourRouter.get("/:id", authorize, getTour);

tourRouter.post("/", authorize, createTour);

tourRouter.put("/:id", authorize, updateTour);

tourRouter.delete("/:id", authorize, deleteTour);

export default tourRouter;
