import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getAdmins, getAdmin } from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get('/', authorize, getAdmins);

adminRouter.get('/:id', authorize, getAdmin);

adminRouter.post('/', (req, res) => res.send({ title: 'CREATE admin' }));

adminRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE admin' }));

adminRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE admin' }));


export default adminRouter;