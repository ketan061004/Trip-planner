import { Router } from "express";
import { suggestInterests } from "../services/interestService.js";

const router = Router();

// POST /api/interests  -> suggest interests tailored to destination + budget
router.post("/", async (req, res) => {
  try {
    const { destination, budget, currency, durationDays } = req.body || {};
    const result = await suggestInterests({
      destination,
      budget: budget != null ? Number(budget) || null : null,
      currency,
      durationDays: durationDays != null ? Number(durationDays) || null : null,
    });
    res.json(result);
  } catch (err) {
    console.error("[/api/interests]", err);
    res.status(502).json({ error: err.message || "Failed to suggest interests" });
  }
});

export default router;
