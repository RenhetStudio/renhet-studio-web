import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().trim().url("Enter a complete URL, including https://").max(500)
    .refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL"),
]);

export const applicationSchema = z
  .object({
    positionId: z.string().trim().min(1).max(100),
    name: z.string().trim().min(2, "Enter your name").max(120),
    email: z.string().trim().email("Enter a valid email address").max(254),
    location: z.string().trim().min(2, "Enter your location or time zone").max(120),
    portfolioUrl: optionalUrl,
    linkedinUrl: optionalUrl,
    resumeUrl: optionalUrl,
    message: z.string().trim().min(20, "Tell us a little more about yourself").max(5000),
    consent: z.literal("on", { message: "Consent is required to submit" }),
    website: z.string().max(0),
  })
  .refine((value) => value.portfolioUrl || value.resumeUrl, {
    message: "Add a portfolio or CV link",
    path: ["portfolioUrl"],
  });
