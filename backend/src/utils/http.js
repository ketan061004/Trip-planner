// Wrap an async route handler so thrown errors reach the error middleware.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Create an error with an HTTP status attached.
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
