import { Router } from "express";
import { normalizePreferences, generatePlan } from "../services/planService.js";

const router = Router();

// POST /api/plan  -> generate a full trip plan
router.post("/", async (req, res) => {
  try {
    const prefs = normalizePreferences(req.body);

    if (!prefs.destination && !prefs.budget && prefs.interests.length === 0) {
      return res.status(400).json({
        error: "Please provide at least a destination, a budget, or some interests.",
      });
    }

    const plan = await generatePlan(prefs);
    res.json({ preferences: prefs, plan });
  } catch (err) {
    console.error("[/api/plan]", err);
    res.status(502).json({ error: err.message || "Failed to generate plan" });
  }
});

export default router;
