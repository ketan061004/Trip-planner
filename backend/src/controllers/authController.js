import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler, httpError } from "../utils/http.js";
import { sendResetEmail } from "../services/emailService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function validateCredentials({ email, password, name, requireName }) {
  if (requireName && (!name || !name.trim())) throw httpError(400, "Name is required");
  if (!email || !EMAIL_RE.test(email)) throw httpError(400, "A valid email is required");
  if (!password || password.length < 8)
    throw httpError(400, "Password must be at least 8 characters");
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  validateCredentials({ email, password, name, requireName: true });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw httpError(409, "That email is already registered.");

  const user = new User({ name: name.trim(), email });
  await user.setPassword(password);
  await user.save();

  res.status(201).json({ token: signToken(user), user: user.toJSON() });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  validateCredentials({ email, password });

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    throw httpError(401, "Invalid email or password");
  }

  res.json({ token: signToken(user), user: user.toJSON() });
});

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw httpError(404, "User not found");
  res.json({ user: user.toJSON() });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email || !EMAIL_RE.test(email)) throw httpError(400, "A valid email is required");

  const generic = { message: "If that account exists, a reset link has been sent." };
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.json(generic); // don't reveal whether the email exists

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.resetTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await user.save();

  const resetLink = `${process.env.APP_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;
  const delivery = await sendResetEmail(user.email, resetLink);

  // In dev (no SMTP), surface the token so the flow is testable without email.
  const devPayload = delivery.devMode ? { devResetToken: rawToken, devResetLink: resetLink } : {};
  res.json({ ...generic, ...devPayload });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body || {};
  if (!token) throw httpError(400, "Reset token is required");
  if (!password || password.length < 8)
    throw httpError(400, "Password must be at least 8 characters");

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetTokenHash: tokenHash,
    resetTokenExpires: { $gt: new Date() },
  }).select("+resetTokenHash +resetTokenExpires");

  if (!user) throw httpError(400, "This reset link is invalid or has expired.");

  await user.setPassword(password);
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ token: signToken(user), user: user.toJSON() });
});

// POST /api/auth/logout — JWT is stateless; client discards the token.
export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: "Logged out" });
});
