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
const PORT = process.env.PORT || 5000;

const origins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: origins }));
app.use(express.json({ limit: "1mb" }));

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

// Connect to the DB (non-fatal) then start the server.
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`✅ Trip Planner API on http://localhost:${PORT}`);
    console.log(`   AI provider: ${process.env.AI_PROVIDER || "groq"}`);
  });
});
