import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { env } from "$env/dynamic/public";
import { getCurrentProfile } from "$lib/supabase/auth";
import type { UserProfile } from "$lib/blog/types";
import type { Actions, PageServerLoad } from "./$types";

const newsletterStatusSchema = z.object({ email: z.string(), subscribed: z.boolean() });

function canManageAccount(profile: UserProfile) {
  return env.PUBLIC_ENABLE_COMMENTS === "true" || ["author", "admin"].includes(profile.role);
}

async function getOrUpdateNewsletter(locals: App.Locals, subscribe?: boolean) {
  try {
    const { data, error } = await locals.supabase
      .rpc("manage_my_newsletter_subscription", subscribe === undefined ? {} : { subscribe })
      .abortSignal(AbortSignal.timeout(8000));

    if (error) throw error;
    if (data === null) return { status: "unverified" } as const;
    return { status: "ready", ...newsletterStatusSchema.parse(data) } as const;
  } catch {
    console.error("Account newsletter settings could not be accessed");
    return { status: "unavailable" } as const;
  }
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
  setHeaders({ "Cache-Control": "private, no-store" });
  const profile = await getCurrentProfile(locals);
  if (!profile) redirect(303, "/login?next=/account");

  if (!canManageAccount(profile)) {
    await locals.supabase.auth.signOut();
    redirect(303, "/login?error=restricted");
  }

  return {
    profile,
    commentsEnabled: env.PUBLIC_ENABLE_COMMENTS === "true",
    newsletter: await getOrUpdateNewsletter(locals),
  };
};

export const actions = {
  default: async ({ request, locals }) => {
    const profile = await getCurrentProfile(locals);
    if (!profile || !canManageAccount(profile)) {
      return fail(403, { ok: false, message: "Profile editing is restricted to studio team members." });
    }

    const fields = await request.formData();
    if (fields.has("newsletterPreference")) {
      const preference = fields.get("newsletterPreference");
      if (preference !== "subscribe" && preference !== "unsubscribe") {
        return fail(400, { newsletter: { ok: false as const, message: "Choose a newsletter preference." } });
      }

      const newsletter = await getOrUpdateNewsletter(locals, preference === "subscribe");
      if (newsletter.status === "unverified") {
        return fail(403, { newsletter: { ok: false as const, message: "Confirm your account email to manage the newsletter." } });
      }
      if (newsletter.status === "unavailable") {
        return fail(503, { newsletter: { ok: false as const, message: "We couldn't update your subscription. Please try again." } });
      }

      return {
        newsletter: {
          ok: true as const,
          subscribed: newsletter.subscribed,
          message: newsletter.subscribed ? "You're subscribed to the newsletter." : "You've unsubscribed from the newsletter.",
        },
      };
    }

    const parsed = z
      .string()
      .trim()
      .min(1)
      .max(60)
      .safeParse(fields.get("displayName"));

    if (!parsed.success) {
      return fail(400, { ok: false, message: "Use a display name between 1 and 60 characters" });
    }

    const { error } = await locals.supabase
      .from("profiles")
      .update({ display_name: parsed.data })
      .eq("id", profile.id);

    if (error) {
      return fail(400, { ok: false, message: error.message });
    }

    return { ok: true, message: "Display name updated" };
  },
} satisfies Actions;
