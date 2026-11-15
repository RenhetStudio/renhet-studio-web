import { json } from "@sveltejs/kit";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getSupabaseEnv } from "$lib/supabase/env";
import type { RequestHandler } from "./$types";

const subscriptionSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()).transform((email) => email.toLowerCase()),
  website: z.string().max(200).optional(),
});
const headers = { "Cache-Control": "private, no-store" };
const success = () => json({ message: "You're subscribed. Thanks for joining us!" }, { headers });

export const POST: RequestHandler = async ({ request, url }) => {
  if (request.headers.get("origin") && request.headers.get("origin") !== url.origin) {
    return json({ message: "Please subscribe from our website." }, { status: 403, headers });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ message: "Invalid subscription request." }, { status: 415, headers });
  }
  if (Number(request.headers.get("content-length")) > 1024) {
    return json({ message: "Invalid subscription request." }, { status: 413, headers });
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 1024) {
      return json({ message: "Invalid subscription request." }, { status: 413, headers });
    }
    payload = JSON.parse(body);
  } catch {
    return json({ message: "Invalid subscription request." }, { status: 400, headers });
  }
  const parsed = subscriptionSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ message: "Enter a valid email address." }, { status: 400, headers });
  }
  if (parsed.data.website) return success();

  try {
    const { url: supabaseUrl, anonKey } = getSupabaseEnv();
    const client = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { error } = await client.rpc("subscribe_newsletter", {
      subscriber_email: parsed.data.email,
    }).abortSignal(AbortSignal.timeout(8000));
    if (error) {
      console.error("Newsletter subscription failed", error.code);
      return json({ message: "We couldn't subscribe you. Please try again." }, { status: 503, headers });
    }
    return success();
  } catch {
    console.error("Newsletter subscription service is unavailable");
    return json({ message: "We couldn't subscribe you. Please try again." }, { status: 503, headers });
  }
};
