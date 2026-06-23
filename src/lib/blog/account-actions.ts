"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "./actions";

export async function updateProfileAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser("/account");
  const parsed = z.string().trim().min(1).max(60).safeParse(formData.get("displayName"));
  if (!parsed.success) return { ok: false, message: "Use a display name between 1 and 60 characters" };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ display_name: parsed.data }).eq("id", user.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Display name updated" };
}

