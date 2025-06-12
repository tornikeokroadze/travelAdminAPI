import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getAbout, updateAbout } from "../controllers/about.controller.js";
import { uploadSingle } from "../middleware/upload.middleware.js";


const aboutRouter = Router();

aboutRouter.get('/', authorize, getAbout);
aboutRouter.put('/:id', authorize, uploadSingle, updateAbout);



export default aboutRouter;