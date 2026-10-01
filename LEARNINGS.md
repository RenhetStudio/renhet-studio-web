# Reusable Engineering Knowledge

## Web Development

### SvelteKit adapters match the hosting runtime

**Simple explanation**

SvelteKit renders the same routes through different deployment adapters. A Node server build cannot be deployed as Vercel functions without the Vercel adapter.

**How it works**

The adapter runs after Vite builds the app and packages its server routes and static assets for the target host. Local builds use `adapter-node`; Vercel builds select `adapter-vercel`. The Vercel framework preset and build command must also match SvelteKit, and client-visible environment variables need the `PUBLIC_` prefix.

**Why it matters**

A successful local build only proves the chosen adapter's output. Deployment can still fail or serve an older build if the host expects another framework or lacks the new environment variable names.

**In this project**

`svelte.config.js` selects the adapter and `vercel.json` pins the Vercel preset. `package.json` uses port 3000 for local development, matching the local production server.

**Tradeoffs / pitfalls**

Maintaining two targets requires validating each one. Generated images must be included in the deployed static output; an image selected by `<picture><source>` does not automatically fall back to the `<img>` URL after that source returns 404.

### Server-side proxy to a private spreadsheet

**Simple explanation**

A public website can use a private spreadsheet safely when the browser never receives spreadsheet credentials. The server validates the form, then calls a controlled backend endpoint.

**How it works**

The careers page reads published positions in a SvelteKit server load function. Applications go through a SvelteKit form action, which validates the form and confirms the selected role before forwarding the application to a Google Apps Script web app. Apps Script runs as the spreadsheet owner and appends the row.

**Why it matters**

This avoids exposing service-account keys or making the sheet public. It is useful for low-volume integrations when a full database is unnecessary.

**In this project**

The website bridge is in `src/lib/careers/google-sheets.ts`; the spreadsheet-side endpoint is `integrations/google-apps-script/Code.gs`.

**Tradeoffs / pitfalls**

Apps Script has quotas and is less observable than a dedicated API. Keep the POST secret in Script Properties and server environment variables only. The GET endpoint intentionally exposes published roles but no private sheet data.

### Separate public reads from private writes

**Simple explanation**

An integration can expose safe public data without requiring the credential used for private mutations. Configuration and error handling should reflect that separation.

**How it works**

The careers GET request only needs the Apps Script URL because the script returns published roles. Application POST requests additionally require the shared secret before writing to the private spreadsheet.

**Why it matters**

Requiring a write credential for public reads creates an unnecessary failure mode. A missing production secret should not make public job listings disappear, while write operations must still fail safely.

**In this project**

`src/lib/careers/google-sheets.ts` uses `getUrl()` for role reads and `getSecret()` only when submitting applications.

**Tradeoffs / pitfalls**

The public endpoint must never return private spreadsheet data. Keep mutation credentials server-only and configure them separately in production.

### Layered caching for public server data

**Simple explanation**

Public data that changes occasionally should be cached on the server for a bounded time. This makes normal page loads fast without making changes permanently stale.

**How it works**

The server keeps a short-lived in-memory result to avoid repeating the same upstream call inside one process. Public responses also send `s-maxage` and `stale-while-revalidate`, allowing a deployment CDN or reverse proxy to serve cached HTML while refreshing it in the background.

**In this project**

`getPublishedPositions` caches the public Apps Script GET request for five minutes and `src/routes/careers/+page.server.ts` sets the shared response-cache policy. The application POST remains uncached.

**Tradeoffs / pitfalls**

New and removed job listings can take up to five minutes to appear. Do not cache user-specific, authenticated, or write requests this way.

### Server rendering plus route-level CSR control reduces browser JavaScript

**Simple explanation**

An interactive effect does not require an entire page to be a Client Component. Static pages can stay server-rendered and use CSS for simple visual motion.

**How it works**

SvelteKit can render a route entirely on the server and set `csr = false`, so the browser receives complete HTML and CSS without a hydration runtime. CSS keyframe animations still run normally, and `prefers-reduced-motion` can disable them for users who request less motion.

**In this project**

The home page, blog index, and public post page use server-rendered Svelte with route-level CSR disabled. Their introductory animations remain CSS-only in `src/app/globals.css`.

**Tradeoffs / pitfalls**

CSS is ideal for bounded presentation effects. Keep a client component only when the animation needs live application state, gestures, or complex scroll interaction.

### Caching public database reads

**Simple explanation**

Public content does not need the visitor's login cookies, so it can be cached safely across visitors. Authenticated editor queries must remain separate and uncached.

**How it works**

`src/lib/blog/data.ts` stores published query results for five minutes in a small process-local cache. Post mutations call `clearPublishedPostsCache`, so the next public read fetches fresh data.

**In this project**

`src/lib/blog/data.ts` uses a cookie-free Supabase client for published posts. Dashboard, profile, and comment queries retain the session-aware server client in `src/lib/supabase/server.ts`.

**Tradeoffs / pitfalls**

Only use this split where row-level security permits anonymous reads. Never cache a client created with request cookies, or personalized data could be shared between visitors.

### Structured data describes the site to search engines

**Simple explanation**

Structured data is machine-readable markup that identifies real-world entities such as an organization or article. It supplements, but never replaces, useful visible page content.

**How it works**

Search engines can read schema.org microdata directly from server-rendered HTML. The schema links the studio's name, canonical URL, logo, and verified social profiles, while each blog post supplies a `BlogPosting` record with its dates and canonical URL.

**In this project**

The organization schema is rendered in `src/routes/+page.svelte`; post schema is rendered in `src/routes/blog/[slug]/+page.svelte`.

**Tradeoffs / pitfalls**

Schema is an eligibility signal, not a guarantee of rich results. Keep every field truthful and current, and never add ratings, people, or product claims that are not visibly supported by the page.

### Build-time responsive images

**Simple explanation**

A single large source image should not be sent unchanged to every screen. Build-time image processing creates smaller modern formats and lets the browser choose the best size it needs.

**How it works**

The image preparation script creates width variants in AVIF and WebP before development and production builds. Native `picture`, `source`, and `srcset` markup lets the browser select an efficient file for its viewport and pixel density without client-side JavaScript.

**Why it matters**

Images often dominate a page's transferred bytes. Optimizing them at build time improves first paint while keeping the original visual quality and avoids runtime image-processing work on the server.

**In this project**

`scripts/optimize-images.mjs` reads the stable originals in `public` and writes variants to `public/optimized`. The site header, footer, home page, and login page use those variants, with the originals as fallbacks and stable URLs for social metadata.

**Tradeoffs / pitfalls**

Generated variants increase build output and build work. Always provide accurate `sizes`, explicit dimensions where appropriate, and meaningful alternative text; otherwise the browser may download a larger variant than necessary or accessibility can regress. Static image files also avoid development server image middleware returning an incorrect MIME type.

# Security

### Framework-managed CSP and response security headers

**Simple explanation**
Content Security Policy restricts where scripts, styles, media, frames, and network connections may come from. SvelteKit can generate the correct nonce or hash policy for each rendering mode while a server hook adds the remaining response security headers.

**How it works**
`svelte.config.js` owns the CSP directives. `src/hooks.server.ts` adds HSTS, frame, content-type, referrer, opener, and permissions policies. Dynamic presentation uses classes or validated `data-*` attributes because `style-src-attr 'none'` blocks inline style attributes.

**Tradeoffs / pitfalls**
Strict CSP can break new third-party embeds or inline styles unless their exact origins and rendering strategy are reviewed. Keep the allowlist narrow and verify response headers after deployment.

### Spreadsheet formula injection

**Simple explanation**
Spreadsheet cells beginning with `=`, `+`, `-`, or `@` can be interpreted as formulas instead of plain applicant text.

**In this project**
`integrations/google-apps-script/Code.gs` prefixes those values with an apostrophe before `appendRow`, preserving the submitted text as a literal value.
