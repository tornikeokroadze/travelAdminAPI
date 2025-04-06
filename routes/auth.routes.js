import { Router } from "express";

import { signinLimiter } from "../middleware/signinLimiter.middleware.js";
import authorize from "../middleware/auth.middleware.js";

import { signIn, signOut, forgotPassword, verifyToken, resetPassword } from "../controllers/auth.controller.js";

const authRouter = Router();

// authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signinLimiter, signIn);
authRouter.post("/sign-out", authorize, signOut);

authRouter.post("/forgot-password", forgotPassword);
authRouter.get('/reset-password', verifyToken);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
