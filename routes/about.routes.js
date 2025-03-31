import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getAbout, updateAbout } from "../controllers/about.controller.js";


const aboutRouter = Router();

aboutRouter.get('/', authorize, getAbout);
aboutRouter.put('/:id', authorize, updateAbout);



export default aboutRouter;