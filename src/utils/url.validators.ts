import z from "zod";

export const urlSchema = z.object({
  originalUrl: z.string().trim().url("Must be a valid URL"),
});
