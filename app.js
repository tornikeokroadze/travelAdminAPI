import express from "express";
import cookieParser from "cookie-parser";

import { PORT } from "./config/env.js";

import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import tourRouter from "./routes/tour.routes.js";
import { connectToDatabase } from "./database/pgsql.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);
app.use("/api/tours", tourRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(PORT, async () => {
  console.log("server runing");

  await connectToDatabase();
});

export default app;
