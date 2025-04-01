import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getGalleries, getGallery, createGallery, updateGallery, deleteGallery } from "../controllers/gallery.controller.js";

const galleryRouter = Router();

galleryRouter.get('/', authorize, getGalleries);

galleryRouter.get('/:id', authorize, getGallery);

galleryRouter.post('/', authorize, createGallery);

galleryRouter.put('/:id', authorize, updateGallery);

galleryRouter.delete('/:id', authorize, deleteGallery);

export default galleryRouter;