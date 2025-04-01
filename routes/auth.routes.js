import { Router } from "express";

import authorize from "../middleware/auth.middleware.js";
import { signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

// authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", authorize, signOut);

export default authRouter;
