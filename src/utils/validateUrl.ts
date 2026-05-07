import { ValidationError } from "./errors.js";

export function validateUrl(url: string) {
  try {
    new URL(url);
    return;
  } catch (err) {
    throw new ValidationError("Invalid URL, please try again.");
  }
}
