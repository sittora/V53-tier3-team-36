import { z } from "zod";

export const markUnreadValidator = z.object({
  olid: z.string(),
  action: z.enum(["mark-unread"]),
});
