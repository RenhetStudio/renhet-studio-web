# Reusable Engineering Knowledge

## Web Development

### Server-side proxy to a private spreadsheet

**Simple explanation**

A public website can use a private spreadsheet safely when the browser never receives spreadsheet credentials. The server validates the form, then calls a controlled backend endpoint.

**How it works**

The careers page reads published positions on the server. Applications go through a server action, which validates the form and confirms the selected role before forwarding the application to a Google Apps Script web app. Apps Script runs as the spreadsheet owner and appends the row.

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

### Caching public App Router data

**Simple explanation**

Public data that changes occasionally should be cached on the server for a bounded time. This makes normal page loads fast without making changes permanently stale.

**How it works**

Next.js stores the GET response for the configured revalidation window. Once the window expires, the next request triggers a refresh while callers can still receive the previous cached response. This avoids a blocking request to the origin service for every visitor.

**In this project**

`getPublishedPositions` caches the public Apps Script GET request for five minutes and `src/app/careers/page.tsx` uses the same revalidation policy. The application POST remains uncached.

**Tradeoffs / pitfalls**

New and removed job listings can take up to five minutes to appear. Do not cache user-specific, authenticated, or write requests this way.

### Server Components reduce browser JavaScript

**Simple explanation**

An interactive effect does not require an entire page to be a Client Component. Static pages can stay server-rendered and use CSS for simple visual motion.

**How it works**

The `"use client"` directive makes a component and its imports part of the browser bundle. CSS keyframe animations run without React hydration or a JavaScript animation library, and `prefers-reduced-motion` can disable them for users who request less motion.

**In this project**

The home page and blog wrapper no longer load GSAP. Their introductory animations are CSS-only in `src/app/globals.css`; the GSAP dependencies were removed from `package.json`.

**Tradeoffs / pitfalls**

CSS is ideal for bounded presentation effects. Keep a client component only when the animation needs live application state, gestures, or complex scroll interaction.

### Caching public database reads

**Simple explanation**

Public content does not need the visitor's login cookies, so it can be cached safely across visitors. Authenticated editor queries must remain separate and uncached.

**How it works**

`unstable_cache` stores the published post queries for five minutes and associates them with the `published-posts` tag. A post mutation calls `updateTag` so the next render receives fresh public content immediately.

**In this project**

`src/lib/blog/data.ts` uses a cookie-free Supabase client for published posts. Dashboard, profile, and comment queries retain the session-aware server client in `src/lib/supabase/server.ts`.

**Tradeoffs / pitfalls**

Only use this split where row-level security permits anonymous reads. Never cache a client created with request cookies, or personalized data could be shared between visitors.

### Structured data describes the site to search engines

**Simple explanation**

Structured data is machine-readable JSON in a page that identifies real-world entities such as an organization or article. It supplements, but never replaces, useful visible page content.

**How it works**

Search engines can read JSON-LD script tags without executing application code. The schema links the studio's name, canonical URL, logo, and verified social profiles, while each blog post supplies a `BlogPosting` record with its dates and canonical URL.

**In this project**

The organization schema is rendered on `src/app/page.tsx`; post schema is rendered in `src/app/blog/[slug]/page.tsx`.

**Tradeoffs / pitfalls**

Schema is an eligibility signal, not a guarantee of rich results. Keep every field truthful and current, and never add ratings, people, or product claims that are not visibly supported by the page.
