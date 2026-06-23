"use client";

import { deletePostAction } from "@/lib/blog/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="danger-button" type="submit">Delete</button>
    </form>
  );
}

