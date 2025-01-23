import { z } from "zod";

export const markReadValidator = z.object({
  date: z.string().transform((val) => new Date(val).toISOString()),
  olid: z.string(),
});
