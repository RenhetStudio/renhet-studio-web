import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
  await locals.supabase.auth.signOut();
  const referer = request.headers.get("referer");
  let target = "/blog";
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.pathname.startsWith("/blog/dashboard") || url.pathname.startsWith("/account")) {
        target = "/";
      } else {
        target = url.pathname;
      }
    } catch {
      target = "/blog";
    }
  }
  redirect(303, target);
};
