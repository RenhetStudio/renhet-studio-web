import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { getCurrentProfile, requireUser } from "$lib/supabase/auth";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const profile = await getCurrentProfile(locals);
  if (!profile) redirect(303, "/login?next=/account");
  return { profile };
};
export const actions = {
  default: async ({ request, locals }) => {
    const user = await requireUser(locals, "/account");
    const parsed = z.string().trim().min(1).max(60).safeParse((await request.formData()).get("displayName"));
    if (!parsed.success) return fail(400, { ok: false, message: "Use a display name between 1 and 60 characters" });
    const { error } = await locals.supabase.from("profiles").update({ display_name: parsed.data }).eq("id", user.id);
    if (error) return fail(400, { ok: false, message: error.message });
    return { ok: true, message: "Display name updated" };
  },
} satisfies Actions;
