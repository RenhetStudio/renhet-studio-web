import type { Handle } from "@sveltejs/kit";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";
import { createClient } from "$lib/supabase/server";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_ANON_KEY
    ? createClient(event.cookies)
    : new Proxy({} as SupabaseClient, {
        get() { throw new Error("Missing required Supabase environment variables: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY."); },
      });
  const response = await resolve(event);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  if (!import.meta.env.DEV) {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
};
