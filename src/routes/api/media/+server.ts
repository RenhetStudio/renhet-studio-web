import { randomUUID } from "node:crypto";
import { json } from "@sveltejs/kit";
import { mediaSchema } from "$lib/blog/validation";
import type { RequestHandler } from "./$types";
const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "video/mp4": "mp4", "video/webm": "webm", "audio/mpeg": "mp3", "audio/ogg": "ogg", "audio/wav": "wav", "audio/webm": "webm" };
export const POST: RequestHandler = async ({ request, locals }) => {
  const contentType = request.headers.get("content-type") ?? ""; const length = Number(request.headers.get("content-length") ?? 0);
  if (!contentType.startsWith("application/json") || !Number.isSafeInteger(length) || length > 2048) return json({ error: "Invalid request" }, { status: 400 });
  const { data: authData } = await locals.supabase.auth.getUser(); if (!authData.user) return json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await locals.supabase.from("profiles").select("role").eq("id", authData.user.id).single();
  if (!profile || !["author", "admin"].includes(profile.role)) return json({ error: "Forbidden" }, { status: 403 });
  const parsed = mediaSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return json({ error: "Unsupported file" }, { status: 400 });
  const path = `${authData.user.id}/${randomUUID()}.${extensions[parsed.data.contentType]}`;
  const { data, error } = await locals.supabase.storage.from("blog-media").createSignedUploadUrl(path); if (error) return json({ error: "Could not prepare upload" }, { status: 400 });
  return json({ path, token: data.token, publicUrl: locals.supabase.storage.from("blog-media").getPublicUrl(path).data.publicUrl });
};
