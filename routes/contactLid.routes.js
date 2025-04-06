import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getContactLids, getContactLid, deleteContactLid } from "../controllers/contactLid.controller.js";

const contactLidRouter = Router();

contactLidRouter.get('/', authorize, getContactLids);

contactLidRouter.get('/:id', authorize, getContactLid);

contactLidRouter.delete('/:id', authorize, deleteContactLid);

export default contactLidRouter;