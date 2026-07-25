import { Router } from "express";
import { getWeather } from "../services/weatherService.js";

const router = Router();

// GET /api/weather?place=Paris
router.get("/", async (req, res) => {
  try {
    const place = (req.query.place || "").toString().trim();
    if (!place) return res.status(400).json({ error: "Query param 'place' is required" });

    const weather = await getWeather(place);
    res.json(weather);
  } catch (err) {
    console.error("[/api/weather]", err);
    res.status(502).json({ error: err.message || "Failed to fetch weather" });
  }
});

export default router;
