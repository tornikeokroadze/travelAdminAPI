import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get('/', authorize, getAdmins);

adminRouter.get('/:id', authorize, getAdmin);

adminRouter.post('/', authorize, createAdmin);

adminRouter.put('/:id', authorize, updateAdmin);

adminRouter.delete('/:id', authorize, deleteAdmin);


export default adminRouter;