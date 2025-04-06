import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { getGalleries, getGallery, createGallery, updateGallery, deleteGallery } from "../controllers/gallery.controller.js";

const galleryRouter = Router();

galleryRouter.get('/', authorize, getGalleries);

galleryRouter.get('/:id', authorize, getGallery);

galleryRouter.post('/', authorize, upload, createGallery);

galleryRouter.put('/:id', authorize, upload, updateGallery);

galleryRouter.delete('/:id', authorize, deleteGallery);

export default galleryRouter;