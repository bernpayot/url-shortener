import type { NextFunction, Request, Response } from "express";
import { URLService } from "../services/url.services.js";
import type { CreateUrlRequest, UpdateUrlRequest } from "../types/url.types.js";
import { URLRepository } from "../repositories/url.repository.js";

const urlService = new URLService(new URLRepository());

export async function redirect(
  req: Request<{ shortcode: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortcode } = req.params;
    const url = await urlService.redirect(shortcode);
    return res.redirect(302, url);
  } catch (err) {
    next(err);
  }
}

export async function createShortUrl(
  req: Request<{}, {}, CreateUrlRequest>,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = req.body;
    const url = await urlService.createShortUrl(data);
    return res.status(201).json(url);
  } catch (err) {
    next(err);
  }
}

export async function updateShortUrl(
  req: Request<{ shortcode: string }, {}, UpdateUrlRequest>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortcode } = req.params;
    const url = await urlService.updateShortUrl(shortcode, req.body);
    return res.status(200).json(url);
  } catch (err) {
    next(err);
  }
}

export async function deleteShortUrl(
  req: Request<{ shortcode: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortcode } = req.params;
    await urlService.deleteShortUrl(shortcode);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getByShortcode(
  req: Request<{ shortcode: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { shortcode } = req.params;
    const url = await urlService.getByShortcode(shortcode);
    return res.status(200).json(url);
  } catch (err) {
    next(err);
  }
}
