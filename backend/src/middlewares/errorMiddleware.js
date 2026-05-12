export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Normalize common error shapes without breaking existing clients.
  const message = err?.message || "Server error";

  res.status(statusCode).json({
    success: false,
    message,
    // Keep stack only outside production.
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack
  });
};

