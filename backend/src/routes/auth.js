import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  register,
  login,
  me,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

export default router;
