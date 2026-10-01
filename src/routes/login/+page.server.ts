import { redirect } from "@sveltejs/kit";
import { getCurrentUser } from "$lib/supabase/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const value = url.searchParams.get("next") ?? "/blog";
  const next = value.startsWith("/") && !value.startsWith("//") ? value : "/blog";
  if (await getCurrentUser(locals)) redirect(303, next);
  return { next };
};
