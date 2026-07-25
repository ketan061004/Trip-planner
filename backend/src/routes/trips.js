import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createTrip,
  listTrips,
  getTrip,
  getPublicTrip,
  updateTrip,
  deleteTrip,
  regenerateTrip,
} from "../controllers/tripController.js";

const router = Router();

// Public shared trip (no auth) — must come before the auth-guarded "/:id".
router.get("/public/:id", getPublicTrip);

router.use(requireAuth);
router.post("/", createTrip);
router.get("/", listTrips);
router.get("/:id", getTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.post("/:id/regenerate", regenerateTrip);

export default router;
