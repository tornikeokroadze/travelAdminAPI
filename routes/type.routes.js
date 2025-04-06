import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getTypes, getType, createType, updateType, deleteType } from "../controllers/type.controller.js";

const typeRouter = Router();

typeRouter.get('/', authorize, getTypes);

typeRouter.get('/:id', authorize, getType);

typeRouter.post('/', authorize, createType);

typeRouter.put('/:id', authorize, updateType);

typeRouter.delete('/:id', authorize, deleteType);

export default typeRouter;