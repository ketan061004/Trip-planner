// Central error handler. Keeps route handlers thin — they can `throw` or
// call next(err) and land here with a consistent JSON shape.
export function errorHandler(err, _req, res, _next) {
  console.error("[error]", err);

  // Mongoose duplicate key (e.g. email already registered).
  if (err && err.code === 11000) {
    return res.status(409).json({ error: "That email is already registered." });
  }
  // Mongoose validation.
  if (err && err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || "Validation failed";
    return res.status(400).json({ error: msg });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Something went wrong" });
}
