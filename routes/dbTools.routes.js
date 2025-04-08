import { Router } from "express";
import multer from 'multer';

import { backupDatabase, restoreDatabase } from '../controllers/dbTools.controller.js';
import authorize from "../middleware/auth.middleware.js";

const dbToolsRouter = Router();

const upload = multer({ dest: 'uploads/' });

dbToolsRouter.get('/backup', authorize, backupDatabase);
dbToolsRouter.post('/restore', authorize, upload.single('sqlFile'), restoreDatabase);

export default dbToolsRouter;
