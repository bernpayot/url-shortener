import rateLimit from "express-rate-limit";

export const createLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: {
    error: "Too many requests",
    message: "Too many requests against this link. Please try again later.",
  },
  standardHeaders: true,
});

export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many requests",
    message: "Too many requests against this link. Please try again later.",
  },
  standardHeaders: true,
});

export const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  message: {
    error: "Too many requests",
    message: "Too many requests against this link. Please try again later.",
  },
  standardHeaders: true,
});
