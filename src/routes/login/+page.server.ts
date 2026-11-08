import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { getCurrentProfile, getCurrentUser } from "$lib/supabase/auth";
import { safeReturnPath } from "$lib/supabase/redirect";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url, locals }) => {
  const next = safeReturnPath(url.searchParams.get("next"));
  const isCommentsEnabled = env.PUBLIC_ENABLE_COMMENTS === "true";
  const user = await getCurrentUser(locals);

  if (user) {
    const profile = await getCurrentProfile(locals);
    if (isCommentsEnabled || (profile && ["author", "admin"].includes(profile.role))) {
      redirect(303, next);
    } else {
      // Reader session while comments are disabled: revoke session
      await locals.supabase.auth.signOut();
    }
  }

  const error = url.searchParams.get("error");
  return { next, error, commentsEnabled: isCommentsEnabled };
};
