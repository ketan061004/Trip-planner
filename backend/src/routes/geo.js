import { Router } from "express";
import { searchPlaces } from "../services/weatherService.js";

const router = Router();

// GET /api/geo/search?q=par&count=6
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const count = Math.min(10, Math.max(1, parseInt(req.query.count, 10) || 6));
    if (!q) return res.json({ results: [] });

    const results = await searchPlaces(q, count);
    res.json({ results });
  } catch (err) {
    console.error("[/api/geo/search]", err);
    res.status(502).json({ error: err.message || "Failed to search places" });
  }
});

export default router;
