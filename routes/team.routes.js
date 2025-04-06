import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from "../controllers/team.controller.js";

const teamRouter = Router();

teamRouter.get('/', authorize, getTeams);

teamRouter.get('/:id', authorize, getTeam);

teamRouter.post('/', authorize, createTeam);

teamRouter.put('/:id', authorize, updateTeam);

teamRouter.delete('/:id', authorize, deleteTeam);

export default teamRouter;