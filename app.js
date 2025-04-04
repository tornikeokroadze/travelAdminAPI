import express from "express";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import { PORT } from "./config/env.js";

import errorMiddleware from "./middleware/error.middleware.js";
import { connectToDatabase } from "./database/pgsql.js";
import checkExpiredTours from "./services/tour.service.js";

import adminRouter from "./routes/admin.routes.js";
import authRouter from "./routes/auth.routes.js";
import tourRouter from "./routes/tour.routes.js";
import typeRouter from "./routes/type.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import faqRouter from "./routes/faq.routes.js";
import contactLidRouter from "./routes/contactLid.routes.js";
import bookRouter from "./routes/book.routes.js";
import teamRouter from "./routes/team.routes.js";
import contactRouter from "./routes/contact.routes.js";
import aboutRouter from "./routes/about.routes.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/admins", adminRouter);
app.use("/api/tours", tourRouter);
app.use("/api/types", typeRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/faqs", faqRouter);
app.use("/api/contactlids", contactLidRouter);
app.use("/api/books", bookRouter);
app.use("/api/team", teamRouter);
app.use("/api/contact", contactRouter);
app.use("/api/about", aboutRouter);

// This will run at 12:00 AM (midnight) every day
cron.schedule('0 0 * * *', async () => {
  await checkExpiredTours();
});

app.use(errorMiddleware);


app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(PORT, async () => {
  console.log("server runing");

  await connectToDatabase();
});

export default app;
