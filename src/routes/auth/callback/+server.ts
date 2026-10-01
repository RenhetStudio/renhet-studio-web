import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = async ({ url, locals }) => {
  const code = url.searchParams.get("code");
  const value = url.searchParams.get("next");
  const next = value?.startsWith("/") && !value.startsWith("//") ? value : "/blog";
  if (code) { const { error } = await locals.supabase.auth.exchangeCodeForSession(code); if (!error) redirect(303, next); }
  redirect(303, "/login?error=auth");
};
