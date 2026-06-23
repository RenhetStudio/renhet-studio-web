"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitCommentAction, type ActionState } from "@/lib/blog/actions";

const initialState: ActionState = { ok: false, message: "" };

export function CommentForm({ postId, slug, signedIn }: { postId: string; slug: string; signedIn: boolean }) {
  const [state, action, pending] = useActionState(submitCommentAction, initialState);

  if (!signedIn) {
    return <p className="comment-login"><Link href={`/login?next=/blog/${slug}%23comments`}>Sign in</Link> to join the discussion.</p>;
  }

  return (
    <form action={action} className="comment-form">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="slug" value={slug} />
      <div className="form-honeypot" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label htmlFor="comment-body">Your comment</label>
      <textarea id="comment-body" name="body" required minLength={1} maxLength={2000} rows={5} />
      <div className="comment-form-row">
        <p>Comments appear after moderation.</p>
        <button type="submit" disabled={pending}>{pending ? "Submitting…" : "Submit comment"}</button>
      </div>
      {state.message && <p className={state.ok ? "form-success" : "form-error"} role="status">{state.message}</p>}
    </form>
  );
}

