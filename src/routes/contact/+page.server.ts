import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { fail } from "@sveltejs/kit";
import { contactSchema } from "$lib/contact/validation";
import { CONTACT_EMAIL, createConfirmationEmail, createOwnerEmail } from "$lib/server/contact-email";
import type { Actions, PageServerLoad } from "./$types";

export const prerender = false;

function isConfigured() {
  return Boolean(env.RESEND_API_KEY && env.CONTACT_FROM_EMAIL && env.CONTACT_TO_EMAIL && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY);
}

export const load: PageServerLoad = ({ setHeaders }) => {
  setHeaders({ "Cache-Control": "private, no-store" });
  return { contactAvailable: isConfigured(), turnstileSiteKey: env.TURNSTILE_SITE_KEY ?? "" };
};

export const actions = {
  default: async ({ request, url, setHeaders }) => {
    setHeaders({ "Cache-Control": "private, no-store" });
    if (Number(request.headers.get("content-length")) > 24_000) {
      return fail(413, { status: "error", message: "Your message is too long.", errors: undefined, values: undefined });
    }
    const data = await request.formData();
    if (typeof data.get("website") === "string" && data.get("website")) {
      return { status: "success", message: "Thanks for your message.", errors: undefined, values: undefined };
    }
    const values = {
      name: String(data.get("name") ?? "").slice(0, 101),
      email: String(data.get("email") ?? "").trim().slice(0, 255),
      message: String(data.get("message") ?? "").slice(0, 3001),
    };
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      return fail(400, { status: "error", message: parsed.error.issues[0]?.message ?? "Please check your details and try again.", errors: parsed.error.flatten().fieldErrors, values });
    }
    const unavailable = () => fail(503, { status: "error", message: `Your message could not be sent. Please try again or email ${CONTACT_EMAIL}.`, errors: undefined, values });
    if (!isConfigured()) return unavailable();

    const token = data.get("cf-turnstile-response");
    const verificationError = () => fail(400, { status: "error", message: "Please complete the security check and try again.", errors: undefined, values });
    if (typeof token !== "string" || !token || token.length > 2048) return verificationError();

    try {
      const verification = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
        signal: AbortSignal.timeout(8000),
      });
      if (!verification.ok) return unavailable();
      const result = await verification.json();
      const developmentTest = dev && env.TURNSTILE_SECRET_KEY === "1x0000000000000000000000000000000AA";
      if (result.success !== true || (!developmentTest && (result.action !== "contact" || result.hostname !== url.hostname))) {
        return verificationError();
      }

      const response = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          { from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: parsed.data.email, ...createOwnerEmail(parsed.data) },
          { from: env.CONTACT_FROM_EMAIL, to: [parsed.data.email], reply_to: CONTACT_EMAIL, ...createConfirmationEmail(parsed.data) },
        ]),
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) {
        console.error("Contact email batch was rejected", response.status);
        return unavailable();
      }
    } catch (error) {
      console.error("Contact submission failed", error instanceof Error ? error.name : "UnknownError");
      return unavailable();
    }
    return { status: "success", message: "Your message has reached our inbox. A confirmation is on its way to your email.", errors: undefined, values: undefined };
  },
} satisfies Actions;
