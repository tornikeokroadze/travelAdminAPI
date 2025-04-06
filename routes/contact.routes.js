import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getContact, updateContact } from "../controllers/contact.controller.js";


const contactRouter = Router();

contactRouter.get('/', authorize, getContact);
contactRouter.put('/:id', authorize, updateContact);



export default contactRouter;