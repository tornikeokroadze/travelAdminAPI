import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from "../controllers/team.controller.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const teamRouter = Router();

teamRouter.get('/', authorize, getTeams);

teamRouter.get('/:id', authorize, getTeam);

teamRouter.post('/', authorize, uploadSingle, createTeam);

teamRouter.put('/:id', authorize, uploadSingle, updateTeam);

teamRouter.delete('/:id', authorize, deleteTeam);

export default teamRouter;