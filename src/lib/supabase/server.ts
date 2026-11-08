import { createServerClient } from "@supabase/ssr";
import type { Cookies } from "@sveltejs/kit";
import { getSupabaseEnv } from "./env";

export function createClient(cookies: Cookies) {
  const { url, anonKey } = getSupabaseEnv();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (values) => {
        try {
          for (const { name, value, options } of values) {
            cookies.set(name, value, { ...options, path: options.path ?? "/" });
          }
        } catch {
          // The `setAll` method was called after the response has been generated.
          // This happens when Supabase's auth engine attempts an async background token refresh
          // on a route where no server load function awaited authentication before response streaming started.
          // Catching this prevents an unhandled exception from crashing the Node.js server.
        }
      },
    },
  });
}
