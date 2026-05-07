import { Router } from "express";
import * as urlController from "../controllers/url.controllers.js";
import { validate } from "../middlewares/validate.middleware.js";
import { urlSchema } from "../utils/url.validators.js";
import {
  generalLimiter,
  redirectLimiter,
  createLimiter,
} from "../middlewares/ratelimiter.middleware.js";

const router = Router();

router.post(
  "/shorten",
  createLimiter,
  validate(urlSchema),
  urlController.createShortUrl,
);
router.get("/shorten/:shortcode", generalLimiter, urlController.getByShortcode);
router.put(
  "/shorten/:shortcode",
  generalLimiter,
  validate(urlSchema),
  urlController.updateShortUrl,
);
router.delete(
  "/shorten/:shortcode",
  generalLimiter,
  urlController.deleteShortUrl,
);
router.get("/:shortcode", redirectLimiter, urlController.redirect);

export default router;
