# Renhet Studio website

Renhet Studio's official site and blog, built with SvelteKit 2, Svelte 5, and Tailwind CSS 4.

## Careers

- Public careers page: `/careers`
- Open applications are always available.
- Published positions and incoming applications use a private Google Sheet.

See `docs/careers-google-sheets.md` for the required tabs, headers, and Google Apps Script setup.

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
npm run check
npm run lint
npm run build
npm start
```

Keep the command running while using the site. Both `npm run dev` and, after `npm run build`, `npm start` serve `http://localhost:3000`. Stop one before starting the other; the port is fixed so an old server cannot silently move development to a different URL.

Required environment variables:

```bash
PUBLIC_SITE_URL=
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
GOOGLE_APPS_SCRIPT_URL=
GOOGLE_APPS_SCRIPT_SECRET=
```

Do not expose a Supabase service-role key in this application.

`npm run dev` loads local `.env` and `.env.local` values. `npm start` also loads those files for local production runs, with `.env.local` taking priority. Environment variables supplied by the hosting platform take priority over both files. Image variants are generated automatically before development and production builds.

## Security model

- Supabase row-level security is the source of truth for post, comment, profile, and media permissions.
- Reader accounts cannot write posts, upload media, preview drafts, publish, or moderate.
- Comments are inserted as `pending` and require author/admin approval.
- Comment submissions are rate-limited in the database.
- Rich post content is stored as structured JSON and rendered to allowlisted server-side HTML. User-authored HTML is not executed.
- Uploaded files are limited to approved image, video, and audio MIME types and 50 MB.

The database schema and policies live in `supabase/migrations/202606220001_blog.sql`.

## Deployment

Local `npm run build` creates a Node server in `build/`; start it with `npm start`. Vercel runs the same build with `VERCEL=1`, selecting the Vercel adapter. `vercel.json` also pins the SvelteKit framework and build command, overriding any old Next.js project preset. Configure `PUBLIC_SITE_URL`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `GOOGLE_APPS_SCRIPT_URL`, and `GOOGLE_APPS_SCRIPT_SECRET` in the Vercel project before deploying; old `NEXT_PUBLIC_` names do not supply SvelteKit's public variables.
