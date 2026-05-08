import type { Request, Response } from "express";

export function renderIndex(req: Request, res: Response) {
  res.render("index");
}
