import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB, isDbConnected } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import planRoutes from "./routes/plan.js";
import weatherRoutes from "./routes/weather.js";
import interestRoutes from "./routes/interests.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import imageRoutes from "./routes/images.js";
import geoRoutes from "./routes/geo.js";

const app = express();

const origins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));

// Kick off the DB connection once per process (cached across serverless
// invocations on a warm instance; retried lazily if it failed).
let dbPromise = connectDB();
app.use(async (_req, _res, next) => {
  if (!isDbConnected()) {
    await dbPromise.catch(() => {});
    if (!isDbConnected()) dbPromise = connectDB(); // retry on next request
  }
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: process.env.AI_PROVIDER || "groq",
    db: isDbConnected() ? "connected" : "disconnected",
  });
});

// AI + data routes (unauthenticated — work with or without a DB)
app.use("/api/plan", planRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/geo", geoRoutes);

// Auth + persistence routes (require a DB connection)
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

export default app;
