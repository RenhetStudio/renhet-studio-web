import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use 100 characters or fewer.").refine((value) => ![...value].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127), "Enter your name on one line."),
  email: z.email("Enter a valid email address.").max(254, "Use 254 characters or fewer."),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(3000, "Use 3,000 characters or fewer."),
});

export type ContactMessage = z.infer<typeof contactSchema>;
