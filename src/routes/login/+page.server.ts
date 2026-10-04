import { redirect } from "@sveltejs/kit";
import { getCurrentUser } from "$lib/supabase/auth";
import { safeReturnPath } from "$lib/supabase/redirect";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const next = safeReturnPath(url.searchParams.get("next"));
  if (await getCurrentUser(locals)) redirect(303, next);
  return { next };
};
