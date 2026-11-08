import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { safeReturnPath } from "$lib/supabase/redirect";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const next = safeReturnPath(url.searchParams.get("next"));

  if (code) {
    const { data, error } = await locals.supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const isCommentsEnabled = env.PUBLIC_ENABLE_COMMENTS === "true";

      // If public comments are disabled, restrict sign-in to studio authors and admins only
      if (!isCommentsEnabled) {
        const { data: profile } = await locals.supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!profile || !["author", "admin"].includes(profile.role)) {
          // Immediately revoke session and cookies
          await locals.supabase.auth.signOut();
          redirect(303, "/login?error=restricted");
        }
      }

      redirect(303, next);
    }
  }

  redirect(303, "/login?error=auth");
};
