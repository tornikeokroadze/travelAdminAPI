import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import http from "http";
import { Server as SocketIO } from "socket.io";

import { PORT } from "./config/env.js";

import errorMiddleware from "./middleware/error.middleware.js";
import { connectToDatabase } from "./database/pgsql.js";
import checkExpiredTours from "./services/tour.service.js";
import checkExpiredEvents from "./services/event.service.js";
import { apiLimiter } from "./middleware/rateLimiter.middleware.js";

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
import eventRouter from "./routes/event.routes.js";
import dbToolsRouter from "./routes/dbTools.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure folders exist
["uploads", "backups"].forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
});

const app = express();

const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(apiLimiter);

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
app.use("/api/events", eventRouter);
app.use("/api/db", dbToolsRouter);

// This will run at 12:00 AM (midnight) every day
cron.schedule("0 0 * * *", async () => {
  await checkExpiredTours();
  await checkExpiredEvents();
});

app.use(errorMiddleware);

server.listen(PORT, async () => {
  console.log("server runing");

  await connectToDatabase();
});

export default app;
