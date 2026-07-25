import jwt from "jsonwebtoken";
import { isDbConnected } from "../config/db.js";

function readToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

/**
 * Require a valid JWT. Populates req.user = { id }.
 * Returns 503 if the database isn't connected (auth can't work without it).
 */
export function requireAuth(req, res, next) {
  if (!isDbConnected()) {
    return res.status(503).json({ error: "Auth is unavailable — database not connected." });
  }
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired session" });
  }
}

/** Attach req.user if a valid token is present, but never block. */
export function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token && process.env.JWT_SECRET) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: payload.sub };
    } catch {
      /* ignore */
    }
  }
  next();
}
