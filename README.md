# Renhet Studio website

Renhet Studio's official site and blog, built with SvelteKit 2, Svelte 5, and Tailwind CSS 4.

## Careers

- Public careers page: `/careers`
- Open applications are always available.
- Published positions and incoming applications use a private Google Sheet.

See `docs/careers-google-sheets.md` for the required tabs, headers, and Google Apps Script setup.

## Newsletter

The footer newsletter form sends `POST /api/newsletter` only when the visitor presses Subscribe. Loading a page or typing an address performs no subscription reads or writes. Success uses a floating toast matching the post editor. The original subscription and a duplicate receive the same confirmation.

Before enabling subscriptions, run `supabase/migrations/202611150001_newsletter_subscribers.sql` in the Supabase SQL Editor, or apply it with your normal migration workflow. It creates `public.newsletter_subscribers` with:

- `email`: normalized to lowercase, unique primary key.
- `suscribed_at`: server-generated `timestamptz`, preserving the requested column spelling.

The `subscribe_newsletter` RPC inserts with `ON CONFLICT DO NOTHING`, so resubmitting preserves the original timestamp, including concurrent requests. Row-level security is enabled and public table permissions are revoked. Anonymous and authenticated visitors can call the subscription function, but cannot list, edit or delete subscribers. This uses the existing Supabase URL and anon key; no service-role key is needed. No newsletter emails are sent by this feature.

Run `npm run test:newsletter` for endpoint tests that intercept database requests. `supabase/tests/newsletter.sql` checks the real schema, duplicate behavior and permissions in a test database, rolling back fixture changes. The API and SQL tests are separate: intercepted requests do not validate a deployed database. Apply the migration before deploying the interface, then verify a controlled new subscription and a duplicate in Supabase. The form does not check mailbox ownership; a honeypot reduces simple bot submissions, but the public RPC remains callable and needs deployment-level abuse controls if traffic warrants them.

## Contact

`/contact` sends a message to the private `CONTACT_TO_EMAIL` recipient and a branded confirmation to the visitor through Resend. Both emails include HTML and plain text. The public contact address and confirmation reply address remain `hello@renhetstudio.com`; the notification recipient can be configured independently.

Configure these private variables in `.env.local` and in the deployment environment:

```dotenv
RESEND_API_KEY=re_your_sending_key
CONTACT_FROM_EMAIL="Renhet Studio <no-reply@renhetstudio.com>"
CONTACT_TO_EMAIL=hello@renhetstudio.com
TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
```

Verify `renhetstudio.com` in Resend before using that sender. Create a Cloudflare Turnstile widget with the site's production hostnames and `localhost` for local development. Only the site key is exposed to the browser. Missing configuration disables the form and leaves the direct email link available. Restart the server after changing environment variables.

The form validates Turnstile's success, hostname and `contact` action on the server before sending. SvelteKit's default origin checking protects form POSTs. No contact data is written to the application database or included in provider error logs. Configure provider quotas/rate limits for the deployment; Turnstile and a honeypot reduce abuse but are not a per-user quota.

Run `npm run test:contact` for the provider-intercepted integration tests. They use dummy credentials and never send email. For local browser verification only, Cloudflare's passing test keys are site key `1x00000000000000000000AA` and secret `1x0000000000000000000000000000000AA`; the server accepts their test metadata only in development. Use real keys in production. Verify actual delivery and reply addresses with a controlled submission after configuring Resend.

Email templates live in `src/lib/server/contact-email.ts`. They use the production logo URL, the studio palette, table layout and inline styles for email clients. System fonts are intentional because many mail clients do not support custom web fonts. Preview both templates on mobile and check Gmail/Outlook before changing the layout.

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

