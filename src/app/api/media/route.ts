import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { mediaSchema } from "@/lib/blog/validation";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "audio/mpeg": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/webm": "webm",
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();
  if (!profile || !["author", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = mediaSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Unsupported file" }, { status: 400 });
  }

  const extension = extensions[parsed.data.contentType];
  const path = `${authData.user.id}/${randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from("blog-media").createSignedUploadUrl(path);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: publicData } = supabase.storage.from("blog-media").getPublicUrl(path);
  return NextResponse.json({
    path,
    token: data.token,
    publicUrl: publicData.publicUrl,
  });
}

