import { redirect } from "@sveltejs/kit";
import type { UserProfile } from "$lib/blog/types";

export async function getCurrentUser(locals: App.Locals) {
  const { data, error } = await locals.supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export async function getCurrentProfile(locals: App.Locals): Promise<UserProfile | null> {
  const user = await getCurrentUser(locals);
  if (!user) return null;
  const { data } = await locals.supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .single();
  return data as UserProfile | null;
}

export async function requireUser(locals: App.Locals, next = "/blog") {
  const user = await getCurrentUser(locals);
  if (!user) redirect(303, `/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAuthor(locals: App.Locals) {
  const profile = await getCurrentProfile(locals);
  if (!profile || !["author", "admin"].includes(profile.role)) {
    redirect(303, "/blog");
  }
  return profile;
}
