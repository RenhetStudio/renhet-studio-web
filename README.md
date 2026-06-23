# Renhet Studio website

Renhet Studio's official site and blog.

## Blog

- Public blog: `/blog`
- Editorial dashboard: `/blog/dashboard`
- Login: `/login`
- Account page: `/account`
- RSS feed: `/blog/feed.xml`

Authors can create rich posts, upload cover/media files, preview drafts, schedule publication, and moderate comments. Readers can sign in with Google or an email magic link, edit their display name, and submit moderated comments.

The blog name and tagline are editable in `src/lib/blog/config.ts`.

## Operations

```bash
npm run dev
npm run lint
npm run build
```

Required environment variables:

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Do not expose a Supabase service-role key in this application.

## Security model

- Supabase row-level security is the source of truth for post, comment, profile, and media permissions.
- Reader accounts cannot write posts, upload media, preview drafts, publish, or moderate.
- Comments are inserted as `pending` and require author/admin approval.
- Comment submissions are rate-limited in the database.
- Rich post content is stored as structured JSON and rendered through an allowlisted React renderer. User-authored HTML is not executed.
- Uploaded files are limited to approved image, video, and audio MIME types and 50 MB.

The database schema and policies live in `supabase/migrations/202606220001_blog.sql`.
