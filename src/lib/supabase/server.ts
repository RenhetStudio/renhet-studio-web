import { createServerClient } from "@supabase/ssr";
import type { Cookies } from "@sveltejs/kit";
import { getSupabaseEnv } from "./env";

export function createClient(cookies: Cookies) {
  const { url, anonKey } = getSupabaseEnv();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookies.getAll(),
      setAll: (values) => {
        for (const { name, value, options } of values) {
          cookies.set(name, value, { ...options, path: options.path ?? "/" });
        }
      },
    },
  });
}
