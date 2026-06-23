"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/blog/account-actions";
import type { ActionState } from "@/lib/blog/actions";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, action, pending] = useActionState(updateProfileAction, { ok: false, message: "" } as ActionState);
  return (
    <form action={action} className="account-form">
      <label htmlFor="displayName">Public display name</label>
      <input id="displayName" name="displayName" defaultValue={displayName} minLength={1} maxLength={60} required />
      <button type="submit" disabled={pending}>{pending ? "Saving…" : "Save name"}</button>
      {state.message && <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p>}
    </form>
  );
}

