import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import type { UserProfile } from "@/lib/blog/types";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

export const getCurrentProfile = cache(async (): Promise<UserProfile | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .single();
  return data as UserProfile | null;
});

export async function requireUser(next = "/blog") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAuthor() {
  const profile = await getCurrentProfile();
  if (!profile || !["author", "admin"].includes(profile.role)) {
    redirect("/blog");
  }
  return profile;
}

