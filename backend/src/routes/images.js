import { Router } from "express";
import { searchImages } from "../services/imageService.js";

const router = Router();

// GET /api/images?query=Tokyo&perPage=6
router.get("/", async (req, res) => {
  try {
    const query = (req.query.query || "").toString().trim();
    const perPage = Math.min(15, Math.max(1, parseInt(req.query.perPage, 10) || 6));
    if (!query) return res.status(400).json({ error: "Query param 'query' is required" });

    const images = await searchImages(query, perPage);
    res.json({ query, images });
  } catch (err) {
    console.error("[/api/images]", err);
    res.status(502).json({ error: err.message || "Failed to fetch images" });
  }
});

export default router;
