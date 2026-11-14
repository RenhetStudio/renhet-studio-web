import type { LayoutServerLoad } from "./$types";
import { getCurrentProfile } from "$lib/supabase/auth";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
  const hasAuthCookie = cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  const profile = hasAuthCookie
    ? await getCurrentProfile(locals).catch(() => null)
    : null;

  return {
    profile,
  };
};
