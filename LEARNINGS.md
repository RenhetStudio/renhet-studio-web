# Reusable Engineering Knowledge

## Web Development

### Native route transitions without remounting the application shell

**Simple explanation**

The browser can capture the old and new pages and animate between them while SvelteKit keeps ownership of routing, focus, and scroll restoration.

**How it works**

Register `onNavigate` in the root layout. Start `document.startViewTransition`, release the navigation inside its update callback, and await `navigation.complete` before the browser captures the destination. Resolve the navigation gate immediately, rather than waiting for the animation to finish. CSS animates the root snapshots with opacity and a small vertical translation.

**Why it matters**

This avoids keyed wrappers that remount global providers or transforms on real layout containers that disturb fixed and sticky positioning. Native snapshots animate without changing document layout.

**In this project**

`src/routes/+layout.svelte` handles pathname changes only. `src/app/globals.css` dissolves the old page over 180ms and settles the new page over 360ms with an 8px movement, matching Renhet's gentle paper aesthetic. Named snapshots keep `SiteHeader` and the custom cursor out of the page movement. `SiteHeader.svelte` closes menus in `onNavigate` with zero-duration exits during navigation; the root layout waits for `tick()` before capture.

**Tradeoffs / pitfalls**

Browsers without View Transitions navigate normally, and reduced-motion users skip the API. Same-page anchors and search/filter query changes do not trigger the effect. Each `view-transition-name` must be unique in the rendered document. `tick()` flushes state changes but does not wait for animated outros, so menus need immediate exits when navigating. Streamed content can arrive after the destination capture and retains its existing loading behavior. Full document loads and external navigation are outside this client-side hook.

For transparent shell elements, `animation: none` alone leaves the static old snapshot visible beneath the live new view. An outgoing logo can therefore show through until the entire route transition ends. Hide `::view-transition-old(site-header)` (and the cursor equivalents) and use `mix-blend-mode: normal` on their new views. This preserves the destination's live logo and scroll-driven styling without an overlapping stale capture.

### Explicit public sitemap entries and real modification dates

**Simple explanation**

Keep the sitemap readable and list public pages explicitly alongside published articles.

**How it works**

The sitemap endpoint renders an indented XML `urlset` from static pages and published posts. Article slugs are URL-encoded and XML values are escaped. Static pages provide explicit modification dates based on their Git history; articles use their stored `updated_at` value. Each entry also has an explicit priority.

**Why it matters**

An explicit list prevents private routes from entering the sitemap and makes missing public pages easy to spot. Real modification dates avoid claiming that unchanged pages were updated on every request.

**In this project**

`src/routes/sitemap.xml/+server.ts` includes home, Beelze Pub, blog, and careers, followed by published articles. It uses `loc`, `lastmod`, and `priority`, and retains the shared cache policy for dynamic blog content.

**Tradeoffs / pitfalls**

Add new public pages to `publicPages` and update their dates when page content changes. Do not use the request date as `lastmod`. Article coverage still depends on the existing published-post query and its default limit.

### SvelteKit adapters match the hosting runtime

**Simple explanation**

SvelteKit renders the same routes through different deployment adapters. A Node server build cannot be deployed as Vercel functions without the Vercel adapter.

**How it works**

The adapter runs after Vite builds the app and packages its server routes and static assets for the target host. Local builds use `adapter-node`; Vercel builds select `adapter-vercel`. The Vercel framework preset and build command must also match SvelteKit, and client-visible environment variables need the `PUBLIC_` prefix.

**Why it matters**

A successful local build only proves the chosen adapter's output. Deployment can still fail or serve an older build if the host expects another framework or lacks the new environment variable names.

**In this project**

`svelte.config.js` selects the adapter and `vercel.json` pins the Vercel preset. `package.json` uses port 3000 for local development, matching the local production server.e`svelte.config.js` selects the adapter and `vercel.json` pins the Vercel preset. `package.json` uses port 3000 for local development, matching the local production server.

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

### Stream slow data without delaying the page shell

**Simple explanation**

A page can become visible before a slow external service finishes. Return the service's promise from a SvelteKit server load function and render its pending and resolved states with a Svelte `{#await}` block.

**How it works**

SvelteKit sends the initial HTML with the pending state, then streams the resolved data to the browser. Catch expected upstream failures on the promise before returning it so the page can show a safe result. This needs client-side JavaScript to replace the pending content.

**Why it matters**

Caching makes repeat visits fast, but cannot remove the first cold request to an external service. Streaming keeps the navigation and useful parts of the page responsive during that request.

**In this project**

`src/routes/careers/+page.server.ts` returns the published-positions promise, and `src/routes/careers/+page.svelte` shows the hero and open-application form while role listings arrive.

**Tradeoffs / pitfalls**

The delayed section still depends on the upstream service. Keep its loading state clear, and avoid assuming that an option which has not arrived yet can be selected or submitted.

### Non-blocking navigation and selective auth cookie detection in public routes

**Simple explanation**

Checking for generic cookies (`cookies.getAll().length > 0`) to determine whether to query authentication breaks CDN caching and adds hundreds of milliseconds of blocking auth latency for anonymous public visitors.

**How it works**

Inspect only framework-specific auth cookies (such as `sb-*-auth-token` for Supabase SSR) rather than all browser cookies (which include analytics, cookie banners, Vercel preview tokens). If no auth cookie is present, skip all remote auth API calls (`auth.getUser()`) and immediately set public CDN cache headers (`s-maxage=300, stale-while-revalidate=86400`). Furthermore, stream dynamic post queries as unawaited promises so SvelteKit navigates in 0ms without waiting for upstream databases.

**Why it matters**

In production serverless environments, calling `auth.getUser()` on an anonymous visitor incurs a slow outbound network hop across the internet to the Supabase auth API. Awaiting it in a server `load` halts SvelteKit's client-side navigation.

**In this project**

`src/routes/blog/+page.server.ts` and `src/routes/blog/[slug]/+page.server.ts` inspect `sb-*-auth-token`. Anonymous readers bypass `getCurrentProfile` completely, allowing instant navigation and full Edge CDN caching. In `+page.svelte`, an animated skeleton renders immediately during streaming.

**Tradeoffs / pitfalls**

If custom auth cookie names are ever changed in `@supabase/ssr`, the prefix/naming filter must be updated accordingly.

### Environment-switched discussion lifecycles in public content

**Simple explanation**
Public interactivity (such as blog comments and community login) can be safely disabled or reopened across production without breaking existing content or writing database migrations by controlling feature lifecycles with runtime environment variables.

**How it works**
`PUBLIC_ENABLE_COMMENTS` is evaluated dynamically in SvelteKit (`env.PUBLIC_ENABLE_COMMENTS === "true"`). If the variable is absent, empty, or "false", the public login prompts and comment submission forms are completely hidden from the UI, and the server action returns `fail(403)` if an unauthorized submission is attempted. Approved past comments remain visible in an editorial archive state without allowing new input.

**Why it matters**
Indie studios frequently toggle between active feedback periods (such as playtests or major releases) and quiet development stretches. Deactivating discussion via a standard environment variable prevents spam, moderation overhead, and unnecessary auth calls while preserving the ability to reopen comments instantly.

**In this project**
`src/routes/blog/[slug]/+page.server.ts` uses `env.PUBLIC_ENABLE_COMMENTS === "true"` to pass `commentsEnabled` to `+page.svelte`. When disabled, the discussion displays an editorial "Closed" pill, suppresses public `/login` invitations, and keeps all approved comments styled on the `#f6f1e8` paper canvas separated by `OrganicDivider`.

**Tradeoffs / pitfalls**
Always default feature flags to `false` when the variable is unset. Server actions must strictly enforce the flag on mutation endpoints rather than trusting client-side button hiding alone.

### Preserving client hydration on pages with interactive shell components

**Simple explanation**

Never disable Client-Side Rendering (`export const csr = false`) on routes that include interactive navigation or audio shells like `SiteHeader` or `SoundProvider`. Doing so prevents Svelte Runes and client event listeners from executing, breaking scroll-triggered state, sound toggles, and mobile menus.

**How it works**

SvelteKit allows setting `export const csr = false` in `+page.ts` to output inert static HTML without emitting hydration script bundles. While CSS-only animations (like native Scroll-Driven Animations on the navbar background) continue to run via the browser compositor, any state driven by JavaScript (such as `isHeroInView` driving the logo morph between compact symbol and full wordmark, window scroll listeners, or procedural audio click delegation) remains frozen in its initial SSR state.

**Why it matters**

If `csr = false` is set on a page (such as `/blog`), the page renders visually, but:
1. The logo never morphs from the symbol to the wordmark when scrolling out of the hero because `isHeroInView` cannot update.
2. The sound mute button and mobile hamburger toggle cannot respond to user clicks.
3. The `ScrollToTop` docking button cannot measure scroll distance or animate.

**In this project**

Routes across the application (`/`, `/games/beelze-pub`, `/blog`, `/careers`) use standard SvelteKit SSR with client hydration enabled (`export const prerender = false`). This ensures that the global interactive shell (`SiteHeader`, `SoundProvider`, `ScrollToTop`) remains fully functional while SSR delivers instant first paints.

**Tradeoffs / pitfalls**

Only use `export const csr = false` for completely isolated, zero-interaction static documents (e.g. RSS feeds, printable invoice templates) that do not share the interactive site shell.

### Caching public database reads

**Simple explanation**

Public content does not need the visitor's login cookies, so it can be cached safely across visitors. Authenticated editor queries must remain separate and uncached.

**How it works**

`src/lib/blog/data.ts` stores published query results for five minutes in a small process-local cache. Post mutations call `clearPublishedPostsCache`, so the next public read fetches fresh data.

**In this project**

`src/lib/blog/data.ts` uses a cookie-free Supabase client for published posts. Dashboard, profile, and comment queries retain the session-aware server client in `src/lib/supabase/server.ts`.

List queries select only the fields their cards and feeds need. Rich post content is fetched only for an individual article. The anonymous blog index can use a shared response cache; requests carrying cookies still resolve the visitor's profile and stay private.

**Tradeoffs / pitfalls**

Only use this split where row-level security permits anonymous reads. Never cache a client created with request cookies, or personalized data could be shared between visitors.
When cache keys include visitor-controlled search terms or slugs, cap the number of entries. A time-to-live alone does not remove keys that are never requested again.
Let upstream read errors reject instead of turning them into an empty result; otherwise a brief outage can become a cached 404.

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

### Server-rendered social previews and independent crawler caches

**Simple explanation**
A social network builds a link preview by fetching the page's HTML and then its advertised image. It can keep that preview after the website has changed.

**How it works**
Render Open Graph and Twitter Card tags in `svelte:head` during SSR. Use absolute URLs for both the canonical page and the image. A crawler does not need to execute application JavaScript or understand `picture`/`srcset`. Declare image dimensions only when they are known; arbitrary article covers may have different sizes.

**Why it matters**
A working image in a browser does not prove that a social crawler can fetch it. Check HTTP status, MIME type, robots rules, and the raw HTML with the crawler's user agent before changing tags. An older description in a preview is evidence of stale data, but it does not establish why the original image fetch failed.

**In this project**
`SocialMeta.svelte` emits one consistent Open Graph and Twitter tag set for home, careers, the game, the blog index, and public articles. `scripts/optimize-images.mjs` generates opaque 1200 by 630 JPEGs in `public/social` from the existing studio logo and game art. Articles use their cover when supplied, or the studio image otherwise. Private pages retain `noindex` and do not receive public social metadata.

**Tradeoffs / pitfalls**
Explicit Twitter fields avoid depending on Open Graph fallback, but cannot force X to refresh a cached card. A deployment and a platform recrawl are separate steps. Test a fresh share URL after deployment when diagnosing caching, without changing the canonical URL. Public article covers still need to be accessible, appropriately sized, and in a crawler-supported format. Keep generation in the build pipeline so referenced assets cannot be accidentally omitted from deployment.

### Unified hero detection with data-hero and dynamic scroll exit transitions

**Simple explanation**

Floating navigation bars should adapt to whether a page has a hero section without hardcoding route paths, and transition from transparent to solid exactly as the hero exits the viewport, regardless of whether the hero is 520px, 600px, 800px, or 100vh.

**How it works**

Any page featuring a hero section tags its hero container with the `data-hero` attribute. The navigation bar coordinates CSS Scroll-Driven Animations and Svelte Runes:

1. **Dynamic exit distance calculation:** On mount, route navigation, and window/hero resize (via `ResizeObserver`), `SiteHeader.svelte` calculates the exact scroll offset where the hero passes under the floating navbar:
   $\text{exitDistance} = \max(120, \text{heroBottomDoc} - 80)$
   This offset is set as a CSS custom property on `:root`: `--hero-exit-distance: ${exitDistance}px`.
2. **Synchronized 100px exit transition ramp:** In CSS:
   `animation-range: calc(var(--hero-exit-distance, calc(100vh - 80px)) - 100px) var(--hero-exit-distance, calc(100vh - 80px));`
   - Throughout the body of the hero (from `scrollY = 0` up to `exitDistance - 100px`), the navbar remains 100% transparent.
   - Over the final 100px approaching the exit, it smoothly transitions into the solid style.
   - At `exitDistance` (where `hero.bottom = 80px`), it reaches 100% solid styling.
3. **Synchronized logo morph:** When `rect.bottom <= 80` triggers at the exit threshold, Svelte flips `isHeroInView = false`, driving the 300ms logo morph from compact symbol to full wordmark in perfect sync with the solid navbar background.
4. **Zero-flash SSR & reload fallback:** On initial SSR and reload before JavaScript hydration, CSS defaults `--hero-exit-distance` to `calc(100vh - 80px)`. At `scrollY = 0`, the compositor paints transparent immediately; deep on reload (`scrollY > 100vh`), it paints solid immediately without transition jumps.
5. **Pages without a hero:** Selectors match `:root:not(:has([data-hero]))`, rendering solid immediately on first paint without running scroll animations.

**Why it matters**

Hardcoding a fixed viewport distance (such as `70vh`) causes the navbar to turn solid prematurely on tall heroes (like the 100vh homepage) while remaining semi-transparent long after shorter heroes (like the 600px Beelze Pub hero) have already exited offscreen. Dynamic exit calculations make navbar behavior identical across all page designs, aspect ratios, and device form factors.

**In this project**

`src/lib/components/SiteHeader.svelte` coordinates dynamic `--hero-exit-distance` measuring with a `ResizeObserver`. Hero sections in `src/lib/components/home/HeroSplit.svelte`, `src/routes/games/beelze-pub/+page.svelte`, and `src/routes/blog/+page.svelte` are marked with `data-hero` (non-hero pages such as `/careers` and `/account` render solid immediately).

**Tradeoffs / pitfalls**

Do not query DOM geometry or write CSS custom properties on every scroll tick — scroll listeners should only evaluate `rect.bottom > 80` for the logo state, while hero height measurements and CSS variable updates are restricted to mount, navigation, and `ResizeObserver` callbacks to prevent layout thrashing.

### Isolating CSS scroll-driven animations from transitions to prevent reload jumps

**Simple explanation**

Never mix CSS transitions (`transition: all`) or Tailwind utility transform classes (`translate-*`, `scale-*`) with native CSS Scroll-Driven Animations (`animation-timeline: scroll()`) on the same element. When a user reloads a page while scrolled down, Svelte hydration updates the class list, which triggers a conflicting transition that causes the element to jump or slide.

**How it works**

In modern browsers (and Tailwind CSS v4), utility classes like `translate-x-2` and `scale-90` compile to independent CSS properties (`translate: 0.5rem 0` and `scale: 0.9`), while CSS `@keyframes` animations control `transform`. If the element has `transition: all`, the browser notices the class change when Svelte hydrates (`isHeroInView = false`), animating `translate: 8px -> 0px` over 300ms even though the scroll animation had already positioned the element correctly.

To eliminate the reload jump:
1. Under `@supports (animation-timeline: scroll())`, explicitly set:
   ```css
   :global(:root:has([data-hero])) .nav-symbol-icon,
   :global(:root:has([data-hero])) .nav-wordmark-logo {
     translate: none !important;
     scale: none !important;
     transition: none !important;
   }
   ```
2. The GPU compositor controls opacity and transform exclusively via `animation-timeline: scroll()`, preventing duplicate transforms and eliminating all hydration transition triggers.
3. Fallback transitions are scoped strictly inside `@supports not (animation-timeline: scroll())` for legacy browsers.

**Why it matters**

Reloading the page while scrolled down must paint the header and logo in their final scrolled state with 0px movement and zero visual flicker or FOUC.

**In this project**

In `src/lib/components/SiteHeader.svelte`, `.nav-symbol-icon` and `.nav-wordmark-logo` use native scroll animations. Disabling transitions and independent transforms when scroll animations are active guarantees that the logo remains completely static (`left: 226.5px`, `width: 71.2px`) from frame 0 through full hydration across all routes.

**Tradeoffs / pitfalls**

Always verify both modern browsers (with `animation-timeline: scroll()`) and fallback browsers. Do not remove the fallback classes from the markup because non-supporting browsers rely on Svelte's reactive classes to toggle between states.

### Monolithic button feedback over generic AI icon translation

**Simple explanation**

Buttons and action links should behave as cohesive, tactile physical units. Never animate internal arrows or external link icons sliding (`translate-x-1`, `translate-y-0.5`) or scaling on hover, which feels like a generic AI template cliché.

**How it works**

Hover feedback belongs to the button container as a whole (subtle elevation lift `hover:-translate-y-0.5`, background shade shift, and tactile procedural click audio), while icons inside remain completely anchored (`translate: none`, static geometry). If visual emphasis is desired on the icon, use a subtle opacity shift (`opacity-80` to `opacity-100`) rather than positional drift.

**Why it matters**

Generic landing page templates and AI builders ubiquitously add `group-hover:translate-x-1` to arrows. In handcrafted indie design, elements feel grounded, confident, and physical rather than restless or gimmicky.

**In this project**

All buttons and link pills across `GameSpotlight.svelte`, `Beelze-Pub/+page.svelte`, `SiteFooter.svelte`, `ScrollToTop.svelte`, `TheCrew.svelte`, `SiteHeader.svelte`, and `careers/+page.svelte` have had all icon translations (`translate-x-1`, `translate-y-1`, `scale-110`, diagonal translations) completely removed.

**Tradeoffs / pitfalls**

Keep the icon visually weighted and aligned with the text baseline so that static placement looks deliberate and crisp without relying on movement to attract attention.

### Mathematical 2-period SVGs for seamless infinite wave dividers

**Simple explanation**

Infinite animated wave dividers should loop continuously without visual seam tears, stutters, or subpixel rounding cracks between stacked colored sections.

**How it works**

The wave path is defined inside an SVG `viewBox="0 0 200 100"` with exactly two mathematically identical repeating periods ($x = 0..100$ and $x = 100..200$) with $C^1$ continuity at inflection points. Hardware-accelerated CSS `transform: translate3d(-50%, 0, 0)` shifts the SVG by exactly one period. When the animation resets to `0%`, the visual geometry is identical, creating a seamless infinite loop.

To prevent hairline cracks caused by subpixel rounding on retina/high-DPI screens or zoom changes, vertical bleed (`-top-20`, `-bottom-20`) extends the SVG bounding box to completely cover seam joints.

**Why it matters**

Single-period SVGs or percentage approximations cause jarring visual jumps on each animation cycle. Unpadded SVG containers leave 1px subpixel rendering gaps where the background peeks through between dark and light sections.

**In this project**

`src/lib/components/home/WaveDivider.svelte` provides seamless 3-layer wave dividers, with an inverted variant (`scaleY(-1)`) used as a shoreline transition in `src/lib/components/SiteFooter.svelte` and on the hero bottom in `/blog`.

**Tradeoffs / pitfalls**

Dynamic fill colors must respect strict CSP (`style-src-attr 'none'`); fill attributes should be set via JavaScript DOM properties or CSS variables rather than inline `style` strings. Animation should pause or respect `prefers-reduced-motion: reduce`.

### Procedural Web Audio micro-synthesis for zero-latency UI sound

**Simple explanation**

Micro-interactions (such as tactile button clicks) should feel responsive and natural without downloading `.mp3` audio files, introducing network latency, or creating repetitive audio fatigue.

**How it works**

A centralized `SoundManager` singleton uses the native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) to synthesize short sine-wave drops (~18ms–25ms duration). On every click, the frequency is subtly randomized with Gaussian-like jitter (`480Hz ± 60Hz`). A single global capturing listener in `SoundProvider.svelte` detects interactive clicks (`a, button, [role='button'], input, .badge-stamp`) and triggers the micro-click.

**Why it matters**

Traditional audio files add bundle size, require network requests, can fail to load on poor connections, and sound robotic when played repeatedly at the exact same pitch. Procedural synthesis requires zero bandwidth, plays instantly, and organic pitch randomization mimics natural physical acoustics.

**In this project**

`src/lib/audio/soundEffects.ts` implements procedural synthesis and mute state persistence in `localStorage`. `src/lib/components/SoundProvider.svelte` mounts at the root layout (`src/routes/+layout.svelte`) and handles capture-phase delegation.

**Tradeoffs / pitfalls**

Modern browsers require a user gesture (`pointerdown` or `keydown`) before an `AudioContext` can leave the `suspended` state. The sound manager must listen for the first user interaction to resume the context. Never attach sounds to hover events; click-only interactions prevent overwhelming users.

**Zero local click handlers (CRITICAL):** Never add local `onclick={() => sound.playClick()}` or `sound.playPop()` handlers to individual components, buttons, or links. Because `SoundProvider.svelte` attaches a global event listener in the capturing phase (`{ capture: true }`) on `window`, any click on interactive elements (`a, button, [role='button'], [role='tab'], input, select, textarea, summary, label, .badge-stamp`) automatically triggers the tactile click sound. Adding local handlers causes duplicate audio execution (double-clicking sounds within milliseconds) and violates the centralized audio architecture. Individual components should only interact with `sound` to toggle mute state (`sound.toggleMute()`) or subscribe to mute updates (`sound.subscribe()`).

### Geometric centering vs coordinate positioning for elastic custom cursors

**Simple explanation**

Custom cursor rings that expand on interactive hover states must stay perfectly centered on the native cursor point without visual wobble, drift, or coordinate lag.

**How it works**

Separate coordinate calculation from geometric transformation:
1. Dynamic JS/LERP updates apply exclusively to `style.left` and `style.top` in pixel values.
2. The CSS definition uses static `transform: translate(-50%, -50%)` on the dot and ring elements.

When CSS transitions change element diameter on hover (e.g. from `h-7 w-7` to `h-11 w-11`), the expansion radiates symmetrically from the exact anchor point rather than pushing down and right.

**Why it matters**

Combining dynamic translation coordinates inside the same `transform: translate(x, y)` string alongside scale or size changes causes subtle subpixel coordinate drift, making the cursor look misaligned when hovering buttons.

**In this project**

`src/lib/components/CustomCursor.svelte` tracks the pointer using `requestAnimationFrame` with linear interpolation (`lerp`), delegating centering strictly to static CSS.

**Tradeoffs / pitfalls**

Custom cursors must be disabled on touch or coarse-pointer devices (`@media (pointer: coarse)`) and must declare `pointer-events: none` on all cursor DOM elements to avoid intercepting clicks.

### Layout shift prevention in morphing headers via space reservation

**Simple explanation**

When a floating header morphs between a compact symbol logo and a wider wordmark logo upon scrolling, the change in width will shove adjacent navigation links unless space is explicitly reserved.

**How it works**

The logo container `<a href="/">` uses a single CSS grid cell (`grid-cols-1 grid-rows-1`) with a fixed width (`w-[72px] sm:w-[80px]`) sized to fit the largest variant (the wordmark). Both the compact `<picture>` and full wordmark `<picture>` occupy `col-start-1 row-start-1`. When scrolling triggers the transition, both elements cross-fade and scale smoothly within the fixed bounding box without changing the outer container dimensions.

**Why it matters**

Without reserved space, swapping between an icon and a wordmark causes Cumulative Layout Shift (CLS) and abruptly shifts navigation links or centered desktop menus.

**In this project**

`src/lib/components/SiteHeader.svelte` uses this shared grid overlay for the symbol and wordmark logos, paired with `transition-all duration-300 ease-out`.

**Tradeoffs / pitfalls**

The hidden variant must apply `pointer-events-none` when faded out (`opacity-0`) so it cannot capture pointer events or hover states while invisible.

### FLIP-animated docking of floating action buttons into inline layout

**Simple explanation**

A floating "Scroll to top" button fixed at the viewport corner can feel intrusive and cluttered when it overlaps footer content. Instead of abruptly disappearing or popping into the footer, it smoothly glides into an inline slot alongside the footer's button row as the user reaches the bottom.

**How it works**

Using the FLIP (First, Last, Invert, Play) technique paired with an `IntersectionObserver`:
1. The footer reserves a placeholder slot (`h-10 w-10 sm:h-11 sm:w-11`) in its flex row, keeping it hidden (`opacity-0 pointer-events-none`) until docked so there is zero layout shift.
2. When the footer button slot intersects the viewport, `getBoundingClientRect()` calculates the delta (`dx, dy`) between the floating button's current position and the destination footer slot.
3. The floating button is hidden immediately (`opacity: 0; transition: none`) while the footer button is simultaneously transformed by `translate3d(dx, dy, 0)`.
4. On the next animation frame, the footer button transitions smoothly to `translate3d(0, 0, 0)` with a hardware-accelerated cubic bezier (`cubic-bezier(0.22, 1, 0.36, 1)`).
5. When scrolling up away from the footer, the reverse FLIP animation runs so the button uncouples and glides back to the floating viewport position.

**Why it matters**

Abruptly showing/hiding buttons creates visual stutter, while leaving a floating button stationary over a footer row leads to visual overlap with social icons. FLIP provides the physical illusion of a single continuous UI element docking into the page structure.

**In this project**

`src/lib/components/ScrollToTop.svelte`, `src/lib/components/SiteFooter.svelte`, and shared rune `src/lib/components/scrollDock.svelte.ts` coordinate the docking transition, syncing with SvelteKit client route navigation via `$app/state` (`page.url.pathname`).

**Tradeoffs / pitfalls**

1. **Avoid dynamic `style={...}` on FLIP elements and NEVER use `!important` in docking classes:** In Svelte 5, binding reactive expressions to the `style` attribute will overwrite manual JS inline mutations whenever reactive state updates. Furthermore, using `!important` in CSS classes (e.g. `.is-docked { transform: translate3d(0, 0, 0) scale(1) !important; }`) causes the browser CSS cascade to prioritize the stylesheet over inline styles set by JavaScript FLIP (`element.style.transform = translate3d(dx, dy, 0)`). This completely breaks the undock transition, causing the button to pop in instantly with zero animation. Keep CSS class overrides natural via stylesheet source order rather than `!important`.
2. **Double `requestAnimationFrame` for guaranteed FLIP paints:** Switching an element from `transition: none` with an inverted transform (`translate3d(dx, dy, 0)`) to `transition: transform 380ms ...` in the same or immediate microtask can cause the browser to batch both recalculations, skipping the flight animation entirely. Wrapping the destination transition in a nested `requestAnimationFrame(() => requestAnimationFrame(() => ...))` guarantees frame 1 is painted before frame 2 initiates the transition.
3. **Active animation cancellation (`cancelActiveAnimation`):** If a user reverses scroll direction while a FLIP flight is underway (e.g. scrolling up immediately after reaching the footer), stale `setTimeout` callbacks from the previous animation must be cancelled (`clearTimeout`) and listeners detached. Otherwise, the old timer fires mid-flight and strips `style.transform` via cleanup routines.
4. **Synchronize IntersectionObserver thresholds with manual boundary checks:** Using different thresholds (e.g. `threshold: 0.1` vs `rect.top < window.innerHeight - 10`) creates a dead zone where the scroll listener calls `undock()` while the IntersectionObserver simultaneously calls `dock()`, triggering rapid state flapping. Both must agree on the exact viewport boundary.
2. **Never drop intersection events during animation:** Guarding observer callbacks with `if (isAnimating) return` creates permanent desynchronization if the user reverses scroll direction before the animation concludes. Always verify state upon transition completion and on scroll ticks to guarantee self-healing.
3. **Instant handoff without ghost clones:** If the source element fades out with a CSS transition while the target element moves, both elements will temporarily be visible simultaneously. The handoff must be instantaneous.
4. **Route transitions:** Global dock runes (`scrollDockState.isDocked`) must explicitly reset to `false` and clear element transforms upon client-side route changes (`page.url.pathname`).
5. **Smooth scroll-to-top bypass:** When clicking scroll-to-top while docked, flag `isScrollingToTop = true` to immediately undock without running a reverse cross-page flight animation while the viewport is already rapidly moving to $y=0$.

### Layout shift prevention in randomized typographic roster sections (The Crew)

**Simple explanation**

When rendering a randomized typographic roster that animates into view on scroll, shuffling member order, font swapping (FOUT), or dynamic contextual details (e.g. varying role lengths, presence/absence of portfolio links) will cause Cumulative Layout Shift (CLS) unless dimensions are strictly stabilized.

**How it works**

1. **Font Preloading (`app.html`):** Heavy display fonts (`Paperlogy-9Black.woff2` and `Paperlogy-7Bold.woff2`) are preloaded with `<link rel="preload" as="font" type="font/woff2" crossorigin>` in `<head>`. This prevents FOUT where system fallback fonts suddenly expand when custom fonts finish downloading.
2. **Font Readiness Guard:** Shuffled DOM readiness is deferred via `document.fonts.ready` (with a fast fallback timeout) and `requestAnimationFrame` before marking the roster as prepared (`isPrepared = true`). The entrance animation never fires while text metrics are fluctuating.
3. **Names Cloud Minimum Height:** Responsive min-height (`min-h-[290px] sm:min-h-[240px] lg:min-h-[260px]`) prevents the flex-wrap cloud from changing section height between shuffle variations (e.g. 5 vs 6 lines on mobile, 3 vs 4 lines on desktop).
4. **Contextual Info Slot Reservation:**
   - Both mobile (`min-h-[195px]`) and desktop (`min-h-[200px]`) info containers declare stable minimum heights.
   - Role paragraphs reserve space for multi-line titles (`min-h-[38px]` mobile, `min-h-[48px]` desktop).
   - Portfolio link slots reserve an explicit container (`min-h-[26px]`) so members without links do not collapse the vertical layout.
5. **Keyed Iteration & Targeted Transitions:** `{#each team as member, i (member.name)}` ensures DOM node identity is preserved across reordering, and CSS transitions target exclusively `opacity` and `transform` rather than `transition-all`.

**Why it matters**

Layout shifts destroy reading flow and penalize Core Web Vitals (CLS). Ensuring deterministic height bounds prevents sections below (like game showcases and footers) from jumping during page load, hydration, and user interaction.

**In this project**

`src/lib/components/home/TheCrew.svelte` and `src/app.html` implement these stability patterns for the Renhet Studio team cloud.

**Tradeoffs / pitfalls**

Do not shuffle arrays during SSR (`Math.random()`), as this causes Svelte hydration mismatches. Always start with deterministic initial data during SSR, shuffle on client mount, and hold elements invisible until fonts and layout are ready.

### Integrated panoramic keyart hero with horizontal gradient & responsive stacked mobile layout

**Simple explanation**

Game landing heroes should showcase official wide-format key art with their embedded title logo while keeping editorial headlines readable on indie paper canvas without resorting to artificial text cards, dark overlays, or duplicate logos.

**How it works**

1. **Desktop (>= 1024px):** To avoid the harsh vertical cut where the contained key art ends on wide viewports while elongating the tavern atmosphere to the left, a dual-layer approach is used:
   - An underlying blurred backdrop layer (`.hero-extended-bg`, `filter: blur(28px) saturate(1.1) opacity(0.6)`) fills the entire hero width, extending the warm wood shelves, lanterns, and red counter continuously to the far left edge.
   - The primary sharp key art (`.hero-sharp-keyart`, `h-full w-auto max-w-none object-contain absolute right-0 top-0`) keeps the complete Beelze Pub title and sandwich (*bocadillo*) intact, and uses a CSS mask (`mask-image: linear-gradient(to right, transparent 0%, ... black 24%)`) to seamlessly dissolve its left edge into the blurred backdrop with zero visible seam.
   - A smooth non-linear horizontal gradient (`.hero-paper-gradient`) provides a paper wash on the left, guaranteeing WCAG AA text contrast for the editorial copy while seamlessly fading into the unblurred art. The signature animated `WaveDivider` ripples along the bottom counter into the paper canvas.
2. **Entire hero as interactive destination:** Rather than adding visual clutter with repetitive CTA buttons in both the hero and page bottom, the entire hero is wrapped in an accessible `<a>` link leading to the itch.io store page. On desktop, the copy is vertically centered within the hero (`lg:min-h-[600px] flex items-center`), optically compensated for the floating header.
3. **Mobile & Tablet (< 1024px):** Stacking the text directly over detailed art causes severe legibility clashes and cuts off the embedded logo. Instead, the hero gracefully decouples into two dedicated zones:
   - A full-bleed upper banner zone reaching all the way to `top: 0` (`h-[360px] sm:h-[420px] md:h-[480px]`) that sits directly behind the floating frosted navbar (`SiteHeader`), centered on the game logo and sandwich (`object-[49.5%_center]`) and dissolving smoothly at the bottom via a multi-stop non-linear cream fade (`.hero-mobile-fade`).
   - A lower content zone rendered on solid cream paper canvas (`#f6f1e8`) with centered typography (`text-center py-8 sm:py-12`) sitting naturally between the banner fade and the wave divider without button clutter.

**Why it matters**

Superimposing text directly over intricate illustrations destroys readability or forces heavy artificial drop-shadows and box cards that violate Renhet's anti-cliché design system. Decoupling mobile into a banner + solid canvas layout preserves brand fidelity and character art without compromising accessibility, while vertical containment on desktop prevents image cropping from cutting critical illustrated elements like props or titles.

**In this project**

`src/routes/games/beelze-pub/+page.svelte` implements this pattern for Beelze Pub, unifying the official itch.io key art, floating `SiteHeader`, signature `WaveDivider`, and transition to the gameplay features grid.

**Tradeoffs / pitfalls**

When scaling panoramic game banners inside fixed-height or responsive heroes, avoid blindly using `object-cover` with `w-full` on wide viewports; doing so can zoom in excessively and crop out bottom counter items (e.g. sandwiches, glasses, props) or top title decorations. Ensure `object-contain` or carefully calibrated aspect heights are used to preserve key focal points. On mobile viewports, let the banner reach all the way to the top edge behind the floating navbar rather than padding it down with artificial top margins, and use a generous bottom fade to melt the wooden counter into the cream canvas. Center mobile text and CTA buttons to avoid asymmetric whitespace imbalances. Set the responsive breakpoint at `lg:` (1024px) rather than `md:` (768px) to prevent narrow tablet screens from squeezing text against the background logo.

### Responsive full-width footer alignment with FLIP docking and CSS display: contents

**Simple explanation**

In mobile viewports, footer components (brand mark, headline, navigation pills, and social icon buttons) should occupy the full horizontal width edge-to-edge rather than clustering into a narrow left-aligned box. To preserve exact button row alignment and maintain FLIP docking without layout distortion, nested flex wrappers can flatten on mobile using CSS `display: contents`.

**How it works**

1. **Brand row full-width distribution (`w-full justify-between`):**
   - On mobile (`< 640px`), the brand container uses `w-full flex items-center justify-between`, placing the Renhet Studio logo on the far left, a centered vertical divider line (`h-12 w-px bg-[#fffdf3]/25`), and the two-line headline ("Follow the adventures.") right-aligned on the far right.
   - On desktop (`sm:`), it transitions back to `sm:w-auto sm:justify-start lg:mr-auto` with left-aligned headline text.
2. **Action pills edge-to-edge match (`w-full grid-cols-2`):**
   - The large CTA buttons (`Careers ↗` and `Blog ↗`) span the full container width with `w-full grid grid-cols-2 gap-2.5 sm:w-[260px] sm:gap-3`.
   - On desktop, both rows have an exact fixed width of 260px, aligning `Careers` with `X` on the left and `Blog` with `Itch.io` on the right.
3. **Harmonious icon spacing via `contents sm:flex`:**
   - On mobile, nesting the 5 social links in a dedicated inner `<div>` while docking the scroll-to-top button and divider outside it causes uneven gap clustering.
   - Applying `contents sm:flex sm:items-center sm:justify-between sm:w-[260px] sm:gap-2.5` unwraps the 5 social links on mobile so all 7 elements (5 social icons, 1 vertical divider, 1 scroll-to-top docked button) participate directly in the parent `flex w-full justify-between`. Every gap across the row is mathematically identical.
   - On desktop, the wrapper re-engages (`sm:flex`) to confine the 5 social links to exactly 260px before the docked utility button.

**Why it matters**

Leaving mobile elements in fixed-width desktop clusters creates unbalanced blank voids on the right side of phone screens. Conversely, hiding docked utility buttons on mobile causes floating action buttons to overlap interactive footer icons. Utilizing `display: contents` allows a single semantic DOM tree to seamlessly adapt from a segregated desktop grouping to a unified, full-width responsive grid.

**In this project**

`src/lib/components/SiteFooter.svelte` and `src/lib/components/ScrollToTop.svelte` coordinate this responsive alignment pattern.

**Tradeoffs / pitfalls**

When using `display: contents`, ensure any margins or borders on the wrapper are removed or transferred to direct children, as `contents` causes the browser to ignore the box model of the wrapper itself.

### Discreet, anti-cliché gameplay carousel in editorial layouts

**Simple explanation**

Multiple gameplay screenshots can be showcased inline within an editorial grid using an artisanal container with discreet, quiet navigation rather than heavy SaaS sliders with intrusive arrow boxes and drop shadows.

**How it works**

1. **Artisanal organic mask:** The carousel container retains the custom border radius (`border-radius: 37px 48px 44px 42px / 43px 40px 35px 44px`) so the image feels naturally framed rather than boxed into a generic card.
2. **CSP-compliant CSS transforms:** Slide position uses a `data-slide={currentSlide}` attribute mapped to CSS translation rules in `<style>` rather than dynamic inline `style="transform: ..."` which violates `style-src-attr: none`.
3. **Discreet controls:** Subtle semi-transparent circular buttons (`bg-[#1e2632]/50 hover:bg-[#1e2632]/80`) fade in only on hover on desktop, alongside a minimal pill capsule with small dot indicators at the bottom.
4. **Natural interactions:** Touch swipe support (`touchstart`/`touchend`) and arrow keyboard navigation (`<svelte:window onkeydown>`) provide effortless browsing. Centralized `<SoundProvider>` handles procedural audio clicks automatically.

**Why it matters**

Consolidating multiple gameplay moments into a discreet carousel keeps the landing page concise and editorial without repeating endless alternating image/text blocks.

**In this project**

`src/routes/games/beelze-pub/+page.svelte` replaces the repetitive dialogue section with a 4-slide discreet gameplay gallery (drink mixing, dialogue, regular customers, secret recipes).

**Tradeoffs / pitfalls**

Avoid attaching keyboard listeners or nonnegative `tabindex` to non-interactive `<div>` containers which trigger Svelte a11y warnings; place global key listeners on `<svelte:window>` guarded by hover state.

### Editorial pagination vs infinite scroll when using an interactive site footer

**Simple explanation**

Infinite scroll destroys access to footers and utility controls docked at the bottom of the page. An artisanal indie studio archive benefits far more from quiet, editorial pagination with explicit URL parameters.

**How it works**

1. **Footer protection:** The site features a rich footer with external links, studio navigation, and a floating scroll-to-top button. Infinite scroll triggers whenever the user approaches the bottom, perpetually pushing the footer away.
2. **Deterministic URL states:** Using `?page=2`, `?search=...`, and `?category=...` in SvelteKit keeps any page directly linkable, shareable, and crawlable by search engines without requiring client-side DOM restoration.
3. **Featured post pinning:** Page 1 showcases the latest post in a prominent editorial card plus 6 archival items; subsequent pages display a clean 7-item list without duplicating the featured post.

**Why it matters**

Preserves ergonomics and accessibility across devices while maintaining a relaxed, book-like browsing rhythm.

**In this project**

`src/routes/blog/+page.svelte` and `src/routes/blog/+page.server.ts` handle pagination (7 posts per page) with `[← Newer]` and `[Older →]` navigation, displaying total post counts and page progress.

**Tradeoffs / pitfalls**

Requires server-side bounds checking: invalid or out-of-range page numbers must clamp cleanly or redirect to the closest valid page. When a search filter is applied, pagination must recalculate based on filtered results.

### Debounced client search in Svelte 5 with URL synchronization

**Simple explanation**

Live search inputs should update results smoothly without making network requests on every keystroke, while keeping the URL in sync and preserving focus.

**How it works**

1. Instead of duplicating state with `$state(data.query)` and `$effect`, the input reads `data.query ?? ""` directly.
2. On `input`, a 300ms timer debounces navigation via `goto(targetUrl, { replaceState: true, keepFocus: true, noScroll: true })`.
3. Constructing URL search params without mutable `URLSearchParams` instances satisfies Svelte 5 and ESLint reactivity rules while preventing unnecessary history stack pollution.

**Why it matters**

Zero flicker, no loss of input focus, instantaneous back/forward browser navigation support, and zero linting warnings.

**In this project**

`src/routes/blog/+page.svelte` debounces search queries at 300ms and resets the active page to 1 upon each search update.

**Tradeoffs / pitfalls**

Always cancel the pending `clearTimeout` on component teardown (`$effect` cleanup or `onDestroy`) to prevent race conditions during rapid route transitions.

### Beware of overflow-x: hidden on page containers breaking position: sticky

**Simple explanation**

Applying `overflow-x: hidden` to a main container or layout wrapper disables `position: sticky` on all nested elements.

**How it works**

According to the CSS Overflow Module specification, if an element has `overflow-x: hidden` and `overflow-y: visible`, browsers automatically compute `overflow-y` to `auto` or `hidden`. This turns the container into an isolated scroll port. The sticky descendant will attempt to stick within that element's scroll context, but because user scrolling is driven by the window/document, the sticky element fails to track window scroll and scrolls off screen.

**Why it matters**

Editorial layouts frequently rely on sticky headlines or context panels that stay in view while long multi-column forms or narrative sections scroll alongside them.

**In this project**

In `src/routes/careers/+page.svelte`, the `<main>` tag had `overflow-x-hidden`, causing the left column (`Tell us what you would love to make.` with `lg:sticky lg:top-28`) to scroll away rather than sticking during form completion. Removing `overflow-x-hidden` from `<main>` (with horizontal viewport bounds handled globally in CSS) restored the sticky column.

**Tradeoffs / pitfalls**

If horizontal overflow clipping is strictly required on a specific section to avoid scrollbars from oversized background decorations, use `overflow-x: clip` instead of `overflow-x: hidden`. Unlike `hidden`, `overflow: clip` does not create an independent scroll container and therefore does not break `position: sticky`.

### Multi-axis procedural organic dividers (`OrganicDivider`)

**Simple explanation**

Procedural SVG dividers can adapt to both horizontal section breaks and vertical column separators by mapping Bézier curves along either axis while preserving an organic ink-wash texture.

**How it works**

`OrganicDivider.svelte` accepts an `orientation` prop (`"horizontal" | "vertical"`). For horizontal dividers, sample coordinates advance along the X axis (`0..1200`) with thickness modulated across Y in a `viewBox="0 0 1200 40"`. For vertical dividers, coordinates advance along the Y axis (`0..1200`) with thickness and organic drift applied across X in a `viewBox="0 0 40 1200"`. Setting `preserveAspectRatio="none"` allows the SVG to stretch seamlessly along its main axis while conforming to CSS container width or height.

**Why it matters**

Renhet Studio's design language strictly avoids rigid borders and generic cards ("No Cards" rule in `SPECS.md`). Replacing straight CSS borders (`border-l`, `w-[1px] bg-[#d6d5ca]`) with procedural ink lines ensures consistent handmade texture across both horizontal and vertical editorial boundaries.

**In this project**

`OrganicDivider.svelte` supports `orientation="vertical"` with flexible seeds (`seed="crew-vertical"`, `seed="beelze-vertical"`). It replaces the previous hairline divider in `src/lib/components/home/TheCrew.svelte` (between the team cloud and context panel) and the column border in `src/routes/games/beelze-pub/+page.svelte` (between the headline and narrative description).

**Tradeoffs / pitfalls**

When used in vertical mode inside CSS Grid or Flexbox, containers should specify `self-stretch` and explicit widths (e.g. `w-4` or `w-6`) to prevent zero-width collapses. Additionally, vertical dividers should be hidden on smaller viewports (`hidden lg:flex`) where multi-column layouts stack into single columns.

For horizontal dividers, `OrganicDivider` includes a default fallback margin (`mt-24 mb-16`) intended for spacious top-level page sections when no classes are provided. When using `OrganicDivider` within tighter editorial streams (such as dividing a featured post from an archive list, or between discussion entries), **always pass explicit margin classes directly to the component** (e.g. `class="my-2 sm:my-3 lg:my-4"`). Omitting the class or placing margins only on an outer wrapper `<div>` causes the default `mt-24 mb-16` to fire, producing unintentional 160px+ vertical voids.

### Isolating CSS keyframe animations from SVG transform attributes

**Simple explanation**
When you animate an SVG element with a CSS keyframe using `transform`, CSS overrides and replaces the entire SVG `transform="..."` attribute on that element. If the element relies on SVG attributes like `scale(...)` or `translate(...)` to fit into a viewBox, the animation will reset those transformations, causing the element to blow up to its unscaled size or jump positions.

**How it works**
Separate static spatial positioning from dynamic entrance animations by nesting SVG `<g>` groups. The inner `<g>` holds the static geometry transformations (`transform="translate(x, y) scale(s)"`) while the outer `<g>` holds the CSS animation class (`anim-solid`, `.anim-split-left`, etc.). Since CSS keyframes only modify the outer group, the inner group's scale and coordinates remain intact throughout the entire animation cycle.

**Why it matters**
Handcrafted SVG illustrations and vector icons often require scaling and positioning relative to typography and viewport containers. Without group nesting, simple entrance transitions like `translateY(-12px)` unintentionally clear the SVG's scale factor, resulting in severe visual glitches and layout overflow.

**In this project**
`src/lib/components/error/ErrorIllustration.svelte` uses outer animated groups (`.anim-solid`, `.anim-dashed`, `.anim-split-left`, `.anim-split-right`) around inner geometrically-transformed groups to smoothly animate the displaced and cracked artisan splash symbols over the error numbers `404.` and `500.`.

**Tradeoffs / pitfalls**
Be cautious with `transform-origin` when mixing SVG and CSS transforms. Leaving `transform-origin` unspecified or assuming standard HTML CSS origins can cause rotation or scaling around the SVG canvas origin `(0, 0)`. Using nested groups isolates the translation deltas and ensures `prefers-reduced-motion: reduce` can cleanly disable outer animation transforms without disturbing layout geometry.

### Visual vertical centering with floating fixed navbars

**Simple explanation**
When a floating navbar is positioned with `position: fixed` or `sticky`, it occupies visual space at the top of the viewport without consuming space in normal flex/grid document flow. Centering content naively in the remaining document flow (`justify-center` or equal `py`) causes it to appear visibly pushed toward the top of the screen because the navbar overlays the top margin.

**How it works**
Compensate for the fixed navbar's visual height (~80-96px in Renhet Studio) by balancing the top padding of the flex container against its bottom padding: `padding-top = navbarVisualHeight + padding-bottom`. When the flex child expands with `flex-1` and `my-auto`, the browser centers the content strictly within the visible stage between the bottom edge of the navbar and the top edge of the footer, yielding identical visual breathing room above and below.

**Why it matters**
Isolated standalone layouts like 404 and 5xx error boundaries need to feel balanced and intentional without requiring awkward full-screen hero wrappers or manual viewport height hacks that break across different screen aspect ratios.

**In this project**
`src/lib/components/error/ErrorContent.svelte` applies `flex-1 my-auto` with compensated top padding (`pt-36 sm:pt-44 md:pt-52` vs `pb-14 sm:pb-18 md:pb-24`) to center the artisan error art block and recovery buttons perfectly between `SiteHeader` and `SiteFooter`.

**Tradeoffs / pitfalls**
Always provide responsive padding steps (`sm:`, `md:`) rather than a single fixed pixel value so short mobile screens and ultra-wide desktop monitors maintain comfortable clearances. On mobile, ensure stacked buttons define a uniform width (`w-full max-w-[220px] sm:w-auto`) to avoid awkward ragged edges when action labels differ in length.

### Editorial authentication layouts & "no cards" framing

**Simple explanation**
Traditional SaaS login screens rely on high-contrast bordered floating card containers and stark split-screen marketing sidebars. In indie artisan design systems, authentication should integrate into the site's organic canvas, framed by typography, generous whitespace, and tactile controls without artificial card boxes.

**How it works**
The login view mounts within the universal site shell (`SiteHeader` at the top and `SiteFooter` with organic wave transitions at the bottom). Instead of wrapping form inputs in a rectangular floating card box with drop shadows, the form flows directly over the `#f6f1e8` paper canvas anchored by a subtle brand watermark (`renhet-symbol-dark.png` at 3.5% opacity). Inputs and buttons use the palette's cream (`#fffdf3`), warm border (`#d6d5ca`), and deep dark (`#344253`), with an official vector SVG icon (`IconGoogle`) rather than raw Unicode/text glyphs.

**Why it matters**
Enforcing the "No Cards" rule prevents the jarring feeling of landing on an alien template when leaving editorial content (like blog discussions) to sign in. Consistent global navigation and procedural audio remain accessible without fragmenting the design language.

**In this project**
`src/routes/login/+page.svelte` and `src/lib/components/LoginForm.svelte` use Paperlogy typography, warm paper tones, and responsive pill inputs. It replaces the old hardcoded 2-column SaaS layout and "Make. Share. Craft." gradient panel with a focused, cohesive experience.

**Tradeoffs / pitfalls**
Without a card container's background to separate form inputs from the page, inputs need clear, tactile borders (`border-2 border-[#d6d5ca]`) and defined focus rings (`focus:ring-4 focus:ring-[#8fb8d8]/20`) so interactive affordances remain unambiguous on the paper background.

### bfcache restoration and independent OAuth button states

**Simple explanation**
When an OAuth flow redirects to an external provider (like Google) and the user hits the browser Back button, the page is restored from the Back/Forward Cache (bfcache) with its previous in-memory JavaScript state intact. If the button was set to a disabled/pending state, it remains permanently frozen unless unhooked on page restoration.

**How it works**
Listen for the `pageshow` and `focus` events on `window`. Whenever the page is restored from bfcache or regains focus, reset `pendingAction` back to `null`. Furthermore, use discrete action states (e.g. `pendingAction = "google" | "email" | null`) instead of a single shared boolean so that clicking one auth provider does not display another provider's progress label or disrupt unrelated button text.

**Why it matters**
Users regularly cancel or navigate back from third-party login screens. If the original page stays locked in a "connecting" state, the user is trapped and cannot re-try signing in or enter an email without manually hard-refreshing the browser.

**In this project**
`src/lib/components/LoginForm.svelte` binds discrete states (`pendingAction === "google"` vs `pendingAction === "email"`) and registers a `pageshow` + `focus` listener during `onMount`. It replaces raw ellipsis text (`…`) with a dedicated vector icon (`IconReload` with `animate-spin`) and proper flex gap spacing.

**Tradeoffs / pitfalls**
Do not rely exclusively on `window.addEventListener("pageshow")`; listening to `focus` also covers scenarios where the auth window opens or closes in an external tab or popup. Ensure listeners are cleaned up during component unmount.

### Compact authenticated navigation dropdowns for fixed pill navbars

**Simple explanation**
When a floating pill navbar uses centered navigation links alongside user controls, laying out multiple buttons in a row (e.g., Dashboard, username, Sign out) consumes excessive horizontal space and inevitably collides with the centered links. Consolidating user actions into a single dropdown trigger preserves the visual balance of the navbar.

**How it works**
Replace inline authenticated links with a single interactive pill displaying the user's name and a chevron. Clicking toggles a floating contextual menu (`role="menu"`) styled with the studio aesthetic (frosted dark slate background `#4f5f70`/95, white border, soft blur). Listen to click-outside on `window` and the `Escape` key, and automatically close the menu on client navigation (`afterNavigate`) and window resize.

**Why it matters**
On fixed pill headers with absolutely centered elements (`left-1/2 -translate-x-1/2`), right-aligned action groups that grow with author privileges easily collide with navigation links (e.g., placing audio toggle buttons directly on top of "Careers"). A compact dropdown guarantees a predictable max-width (~160px) regardless of user role or action count.

**In this project**
`src/lib/components/SiteHeader.svelte` uses `IconChevronDown` with a rotational transition and renders an organic floating menu offering "Author Dashboard", "Account Settings", and a distinct "Sign out" action.

**Tradeoffs / pitfalls**
Always ensure the click-outside handler checks whether the click originated within `userMenuRef` before closing, and close the dropdown on both route navigation and viewport resize to avoid orphaned floating overlays.

# Security

### Validate return URLs by parsing them

**Simple explanation**
An address that starts with `/` is not always an internal path. Browsers can treat a slash followed by a backslash as an external URL.

**How it works**
Parse the requested return path against a fixed origin, then accept it only when the parsed origin still matches. Return the normalized path, query, and fragment so the redirect target cannot change interpretation later.

**In this project**
`src/lib/supabase/redirect.ts` checks the `next` parameter before the login page, login buttons, and auth callback use it.

**Tradeoffs / pitfalls**
Checking `startsWith("/")` and rejecting `//` alone misses backslash variants. Use one shared validator for every step in an authentication redirect flow.

### Framework-managed CSP and response security headers

**Simple explanation**
Content Security Policy restricts where scripts, styles, media, frames, and network connections may come from. SvelteKit can generate the correct nonce or hash policy for each rendering mode while a server hook adds the remaining response security headers.

**How it works**
`svelte.config.js` owns the CSP directives. `src/hooks.server.ts` adds HSTS, frame, content-type, referrer, opener, and permissions policies. Dynamic presentation uses classes or validated `data-*` attributes because the production `style-src-attr` policy blocks unapproved inline style attributes. Keep static declarations in stylesheet rules too, including SVG icon transforms and the application wrapper. Toggle classes for selection, opacity, and transforms; use `:nth-child()` rules for a finite staggered roster. SVG presentation attributes such as `fill` and `fill-opacity` do not require inline CSS.

**Why it matters**
Shared components can emit the same violation on every route, while SSR style attributes fail before hydration. Fix application components rather than broadly permitting `unsafe-inline`. Framework-generated markup may require one exact hash when no supported styling hook exists.

**In this project**
`SiteHeader.svelte` switches sound icon classes, `TheCrew.svelte` uses CSS for reveal and selection states, `OrganicDivider.svelte` accepts classes rather than a raw style string, and `src/app.html` uses the `contents` utility. The comment honeypot uses its existing stylesheet rule. `eslint.config.js` enforces `svelte/no-inline-styles`. `svelte.config.js` permits only the exact SHA-256 hash of the visually hidden style generated for SvelteKit's `#svelte-announcer`, with `unsafe-hashes` to enable attribute hash matching. This preserves screen-reader navigation announcements without modifying framework output.

**Tradeoffs / pitfalls**
Strict CSP can break new third-party embeds or inline styles unless their exact origins and rendering strategy are reviewed. Keep the allowlist narrow and verify response headers after deployment. `element.style.transform = value` and `style.setProperty()` are allowed CSSOM property updates, unlike setting the whole `style` attribute or `cssText` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src-attr)). Keep these direct updates for measured coordinates in cursors, parallax, navbar hero distance, and FLIP docking. The installed Svelte 5 transition runtime uses Web Animations, so `fade` and `fly` can remain. Check the production build in a browser on initial load, hydration, and interactions; development alone does not prove CSP compatibility. Extend the roster's stagger rules when adding members beyond its current twelve positions. Recheck the announcer hash after SvelteKit upgrades; whitespace changes its digest. That same exact style is permitted on any element, so keep this allowlist limited to the framework's fixed visually hidden declaration. Remove the exception when SvelteKit emits CSP-compatible announcer markup.

### Spreadsheet formula injection

**Simple explanation**
Spreadsheet cells beginning with `=`, `+`, `-`, or `@` can be interpreted as formulas instead of plain applicant text.

**In this project**
`integrations/google-apps-script/Code.gs` prefixes those values with an apostrophe before `appendRow`, preserving the submitted text as a literal value.

### Role-gated authentication and registration cutoffs via environment toggles

**Simple explanation**
When public features like commenting or community discussions are deactivated, public registration and non-admin sign-ins should be completely closed without breaking author workflows or requiring custom database migrations.

**How it works**
When `PUBLIC_ENABLE_COMMENTS` is not enabled (`!== "true"`), OTP sign-in passes `shouldCreateUser: false` to prevent Supabase from registering new email accounts. In `src/routes/auth/callback/+server.ts`, after completing authentication (via OAuth or Magic Link), the server checks the user's role in the `profiles` table. If the role is not `author` or `admin`, the session is immediately terminated via `locals.supabase.auth.signOut()` and redirected to `/login?error=restricted`. Additionally, protected pages (`/account`, `/login`) automatically clear active reader sessions if comments are closed.

**Why it matters**
OAuth providers like Google automatically provision accounts upon first login. Relying purely on client-side button hiding allows unauthorized readers to sign in via OAuth callbacks or direct endpoints. Server-side role inspection at the callback boundary guarantees that only studio creators and admins can establish authenticated sessions.

**In this project**
Enforced in `src/routes/auth/callback/+server.ts`, `src/routes/account/+page.server.ts`, `src/routes/login/+page.server.ts`, and `src/lib/components/LoginForm.svelte`.

**Tradeoffs / pitfalls**
Remember to revoke the session via `auth.signOut()` before issuing the redirect in the auth callback; otherwise, session cookies remain in the browser for subsequent requests.

### Aborting SvelteKit `use:enhance` actions with `cancel()`

**Simple explanation**
Calling `event.preventDefault()` inside an inline `onsubmit` handler does not cancel a SvelteKit form action managed by `use:enhance`. You must call the `cancel()` callback provided by `use:enhance`.

**How it works**
`use:enhance` intercepts form submissions asynchronously with `fetch` rather than standard browser navigation. `use:enhance` accepts a submit callback `({ cancel })`. Calling `cancel()` inside that function tells SvelteKit to immediately abort the submission before any network request is initiated.

**Why it matters**
Confirmation prompts (e.g. `confirm("Delete this story?")`) that rely on `event.preventDefault()` in `onsubmit` will fail: even if the user clicks "Cancel", `use:enhance` continues running and dispatches the delete action to the server, unintentionally destroying data.

**In this project**
Used on the story delete buttons in `src/routes/blog/dashboard/+page.svelte` to guarantee that clicking "Cancel" in the native confirmation prompt reliably halts the destructive action.

**Tradeoffs / pitfalls**
Never mix inline `onsubmit={(e) => e.preventDefault()}` with `use:enhance` for cancellation logic; always pass `use:enhance={({ cancel }) => { ... }}`.


### Soft delete pattern with instant editorial recovery

**Simple explanation**
Destructive database `DELETE` operations permanently remove rows, which cannot be recovered on managed cloud databases without superuser access or expensive PITR backups. A soft-delete flag (`deleted_at`) safely hides records from the public and author dashboards while enabling instant one-click restoration.

**How it works**
The `posts` table includes a `deleted_at timestamptz default null` column and an index on `(deleted_at)`.
1. **Public queries and RLS:** Public queries filter `.is("deleted_at", null)`. Row-Level Security policies restrict published visibility to rows where `deleted_at is null`.
2. **Partial unique indexes:** The global unique constraint on `slug` is converted to a partial unique index `where deleted_at is null`, allowing authors to reuse a URL slug if an older story was deleted.
3. **Soft-delete mutation:** Instead of calling `delete()`, the dashboard delete action calls `.update({ deleted_at: new Date().toISOString(), status: 'draft' })`.
4. **Editorial Trash and Safe Restoration:** In `src/routes/blog/dashboard/+page.server.ts`, the dashboard server load separates `posts` into active (`!p.deleted_at`) and `deletedPosts` (`Boolean(p.deleted_at)`). If `deletedPosts` exist, a subtle Trash section renders with:
   - "Restore as draft": resets `deleted_at = null` and sets `status = 'draft'` so the story never accidentally goes live to readers until re-reviewed.
   - "Delete permanently": calls `destroy` with a browser confirmation intercepted by `use:enhance`'s `cancel()`, permanently removing the row and cascading comments.

**Why it matters**
Accidental post deletions can happen due to misclicks or UI issues. Without expensive managed PITR backups, hard deletions in cloud-hosted PostgreSQL are catastrophic. Soft deletes guarantee zero data loss and empower authors to recover content without database intervention.

**In this project**
Implemented in `supabase/migrations/202611080001_soft_delete_posts.sql`, `src/lib/blog/data.ts`, `src/lib/blog/types.ts`, `src/routes/blog/dashboard/+page.server.ts`, and `src/routes/blog/dashboard/+page.svelte`.

**Tradeoffs / pitfalls**
Remember to add partial unique constraints on unique columns like `slug` so that soft-deleted rows do not block new records with identical slugs. Ensure all public endpoints, feeds, and sitemaps include the `.is("deleted_at", null)` condition.


### Preventing uncaught cookie mutations after SvelteKit response generation in `@supabase/ssr`

**Simple explanation**
When `@supabase/ssr` runs inside a SvelteKit server hook, background token refreshes can finish *after* SvelteKit has already generated and started streaming the HTTP response. Attempting to call `cookies.set(...)` at that point causes SvelteKit to throw, which crashes the entire Node.js server process if uncaught.

**How it works**
In `src/lib/supabase/server.ts`, wrap the `setAll` cookie handler with a `try...catch` block. When an un-awaited background token refresh fires `setAll` after `resolve(event)` has generated the response on public or static routes, the exception is safely caught and ignored rather than propagating into Node's unhandled promise rejection handler. Whenever the user accesses an authenticated route or performs a server action, `getCurrentUser()` or `getCurrentProfile()` is awaited during the page load lifecycle before the response starts, allowing `setAll` to persist the updated session cookies cleanly. In addition, configure `filterSerializedResponseHeaders` in `src/hooks.server.ts` to allow `content-range` and `x-supabase-api-*` headers through.

**Why it matters**
Without the `try...catch` block in `setAll`, any user opening the site with an expiring or stale Supabase cookie will cause SvelteKit to throw `Cannot use cookies.set(...) after the response has been generated`. Because this runs in an un-awaited background promise inside Supabase's auth state subscriber, it becomes an uncaught exception (`triggerUncaughtException`) that instantly terminates the server in development and production.

**In this project**
Implemented in `src/lib/supabase/server.ts` (`createClient`) and `src/hooks.server.ts` (`handle`).

**Tradeoffs / pitfalls**
Never call `await supabase.auth.getUser()` unconditionally inside `hooks.server.ts` on every request to prevent this; doing so forces a remote network roundtrip to Supabase on every single page view (including public readers browsing the homepage), degrading TTFB. Catching the late write in `setAll` keeps public routes ultra-fast while preserving cookie refresh on authenticated routes.


### Low-overhead frosted glass navbars without scroll-scrubbed blur interpolation

**Simple explanation**
Animating `backdrop-filter: blur(...)` dynamically along a scroll timeline forces the GPU to recompute the blur convolution kernel on every single scroll frame. Using a constant blur radius and only interpolating background opacity delivers a smooth frosted-glass look with high contrast transitions and minimal GPU overhead.

**How it works**
Define a static, moderate blur radius (`backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);`) on the navbar container rather than interpolating between different blur values inside `@keyframes nav-pill-scroll`. In the scroll-driven animation timeline, interpolate only compositor-friendly properties: `background-color` (e.g., from translucent `rgba(98, 115, 131, 0.45)` to solid `rgba(98, 115, 131, 0.92)`), `border-color`, and `box-shadow`. Keeping the translucent 45% base opacity ensures the contrast change when leaving the hero is dramatic and satisfying, while the 12px blur smoothly softens background elements into an elegant frosted glass aesthetic.

**Why it matters**
Continuously recalculating or interpolating blur radiuses on scroll produces compositor frame drops and battery drain on mobile devices and integrated GPUs. A fixed 12px blur paired with background opacity interpolation achieves tactile frosted glass without scroll performance penalties or losing the visual impact of the transition out of the hero.

**In this project**
Applied to `.nav-pill-dynamic` in `src/lib/components/SiteHeader.svelte`, maintaining `bg-[#627383]/45` in hero and transitioning to `bg-[#627383]/92` with a constant 12px blur (`backdrop-blur-md`).

**Tradeoffs / pitfalls**
Keep blur radiuses moderate (10px–14px) and constant to avoid GPU re-rasterization during scroll while maintaining a natural, subtle frosted glass effect.


### Chromium `backdrop-filter` failure caused by persistent `view-transition-name` on parent containers

**Simple explanation**
Applying `view-transition-name` to a parent container permanently breaks `backdrop-filter: blur(...)` on all child elements in Chromium (Chrome, Edge), causing the blur to render completely invisible (0% blur).

**How it works**
In the CSS View Transitions specification and Blink's compositor, any element carrying an active `view-transition-name` is promoted into an isolated paint surface (a new backdrop root with paint containment). When a child element attempts to use `backdrop-filter`, it can only sample pixels within its nearest backdrop root. Because the parent container has no background of its own and sits in an isolated layer, the child's backdrop filter samples an empty buffer, rendering as completely transparent without any blur effect.

**Why it matters**
Persistent rules like `.nav-shell { view-transition-name: site-header; }` in a global stylesheet will silently disable frosted-glass effects across the entire website for all Chromium users, regardless of how high the blur radius is configured.

**In this project**
Removed `.nav-shell { view-transition-name: site-header; }` from `src/app/globals.css`. This removes the isolated backdrop root, restoring the native `backdrop-filter: blur(20px)` on `.nav-pill-dynamic` across the entire document.

**Tradeoffs / pitfalls**
Never declare `view-transition-name` permanently on ancestors of elements that rely on `backdrop-filter`. If an element needs to be excluded from root route cross-fades, assign `view-transition-name` dynamically only during the navigation lifecycle in JavaScript, or let the element participate in the gentle root dissolve.


### Preventing sticky split-panel hover states on touch and mobile devices

**Simple explanation**
On touchscreens without hover capabilities, tapping an interactive panel fires simulated `mouseenter` events without any subsequent `mouseleave`. Guarding expansion state with media query pointer detection keeps split layouts balanced in a 50/50 state on mobile and avoids sticky distorted sections.

**How it works**
Query pointer and hover capabilities using `window.matchMedia("(hover: hover) and (pointer: fine)")` and listen for `change` events. When `canHover` is false, interaction handlers (`handlePanelEnter`, `onMouseMove`) immediately exit without modifying active panel states or transform positions, leaving the split panels in their neutral equilibrium. In addition, move CSS micro-interaction hover transforms (`group-hover:scale-...`, etc.) inside `@media (hover: hover) and (pointer: fine)` so that tap events do not trigger sticky CSS `:hover` states on touch devices.

**Why it matters**
Without this guard, tapping a panel on a mobile phone or tablet to navigate down into a section locks the clicked panel into its expanded/highlighted state and the other into its shrunken/dimmed state. When the user scrolls back up, the hero remains stuck in an asymmetric distortion rather than its intended balanced composition.

**In this project**
Implemented in `src/lib/components/home/HeroSplit.svelte`. `canHover` guards `handlePanelEnter`, `handlePanelLeave`, and `onMouseMove`. Scoped CSS hover rules for `.studio-logo-extrusion`, `.studio-slogan-wrap`, and `.hero-cta-button` are restricted to `@media (hover: hover) and (pointer: fine)`.

**Tradeoffs / pitfalls**
Do not rely exclusively on viewport width media queries (e.g. `max-width: 768px`) to disable hover states. Large touch devices like iPad Pro and touchscreen laptops have desktop-class viewport widths but lack true hover pointers. Testing `(hover: hover) and (pointer: fine)` accurately detects the presence of a primary pointing device across all screen dimensions.


### Contextual dual-state editor toolbar with clean functional clusters and popover menus

**Simple explanation**

Dense rich text editors often overwhelm authors with 30+ visible buttons split across multiple rows, many of which are disabled or irrelevant depending on whether the author is typing paragraphs or positioning images. A contextual dual-state toolbar presents a streamlined single row for prose editing that morphs into a dedicated media control center whenever an image, video, or embed is selected.

**How it works**

1. **State 1 — Normal Writing Toolbar:**
   - **History cluster:** Dedicated vector SVG buttons for `Undo` (<kbd>Ctrl+Z</kbd>) and `Redo` (<kbd>Ctrl+Y</kbd>) powered by reactive `editor.can().undo()` / `editor.can().redo()` state.
   - **Paragraph ▾ Dropdown:** Shows the active block format (`Paragraph`, `H1`, `H2`, `H3`, `Quote`) and opens a tidy popover with checkmarks.
   - **Inline formatting:** Snappy buttons for `B`, `I`, `U`, `S`, `Code`, and `Mark` (highlight).
   - **Lists ▾ Dropdown:** Unified menu grouping Bullet list, Numbered list, and Checklist with active selection indicators.
   - **Alignment:** Segmented controls for `Left`, `Center`, `Right`, and `Justify`.
   - **+ Insert ▾ Dropdown:** Cascading flyout submenus (`Link`, `Upload >`, `From url >`, `Table >`, `Separator >`).
   - **Media Drawer Toggle:** Tactile button showing total post media count badge.
2. **State 2 — Contextual Media Selected Toolbar:**
   - Automatically activates when `selectedMedia` is truthy (`editor.isActive(type)` or `NodeSelection`).
   - Replaces the text toolbar with:
     - `[Wrap L | No Wrap | Wrap R | Row]` segmented layout buttons.
     - `[Width Slider: 10% - 100%]` with tabular numeric percentage badge.
     - `[Replace ▾]` menu (upload replacement file or edit source URL) and `[Delete]` (<kbd>Ctrl+Z</kbd> undoable).
     - Dedicated `[Deselect]` close button to return to text editing.
3. **Parity and English Localization:** All labels, tooltips, placeholders, and aria attributes are in English, matching Renhet Studio's design conventions.

**Why it matters**

Writers spend 90% of their time writing words and 10% adjusting media. Surfacing image wrap and width sliders only when media is focused eliminates visual noise while writing, while grouping dozens of insertion tools into a single categorized `+ Insert` dropdown cuts vertical toolbar height by half.

**In this project**

Implemented in [RichEditor.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/RichEditor.svelte), [globals.css](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/app/globals.css), [IconUndo.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/icons/IconUndo.svelte), and [IconRedo.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/icons/IconRedo.svelte).

**Tradeoffs / pitfalls**

Ensure outside clicks (`handleWindowPointerDown`) and keyboard dismissals (<kbd>Escape</kbd>) close open toolbar menus without cancelling active text selections or blocking ProseMirror pointer transactions.


### Cascading flyout submenus and floating contextual table menu in rich text editor

**Simple explanation**

An insert dropdown with flat scrolling lists creates visual clutter and friction. Cascading hover submenus group related media, links, tables, and dividers into intuitive flyout branches. Moving destructive and contextual table controls out of the sticky toolbar into a floating bubble menu attached directly to the active table cell streamlines UX and prevents accidental deletions.

**How it works**

1. **Cascading Flyout Submenus with Viewport Edge Detection:**
   - The `+ Insert ▾` dropdown presents 5 concise categories: `Link`, `Upload >`, `From url >`, `Table (clickable) >`, and `Separator >`.
   - Hovering over a category triggers its flyout submenu via CSS (`:hover`) and Svelte rune state (`activeSubmenu`).
   - A dynamic boundary check (`rect.right + 220 > window.innerWidth`) evaluates whether the submenu will collide with the viewport edge. If space is tight on the right, it applies `.open-left`, flying out to the left instead of clipping.
   - An invisible CSS pseudo-element bridge (`::before`) connects the parent trigger to the submenu across visual spacing gaps, preventing accidental menu closure during diagonal mouse travel.
2. **Clickable Hybrid Parent for Tables:**
   - The `Table (clickable) >` row acts as a dual trigger: clicking the "Table" label directly inserts a default 3×3 table with headers, while clicking or hovering the chevron icon reveals options to insert a new table, add a row, or add a column.
3. **Floating Contextual Table Menu:**
   - When the cursor enters any table (`editor.isActive("table") && selection.empty`), a floating bubble menu appears anchored directly over the active cell (`rect = (cellEl ?? tableEl).getBoundingClientRect()`).
   - If text inside a cell is selected (`!selection.empty`), the text formatting bubble menu takes precedence to allow inline bold/italic editing without visual collision.
   - All buttons in the table floating menu intercept `pointerdown` via `event.preventDefault()` so the editor retains ProseMirror cell focus during row and column operations.
   - Actions provided: `+ Row Above`, `+ Row Below`, `Delete Row`, `+ Col Left`, `+ Col Right`, `Delete Col`, `Header` (toggle header row), and `Delete table` styled in danger red with `IconTrash`.
   - Deleting the table or last row/column instantly updates `editor.isActive("table")`, dismissing the floating menu cleanly.

**Why it matters**

Placing table controls in a sticky toolbar requires the author to look away from their data. Contextual floating menus put row/column manipulation and deletion right at the user's cursor. Separating upload sources (file upload vs URL embedding) into hover submenus reduces cognitive load while keeping every capability immediately accessible.

**In this project**

- Implemented in [RichEditor.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/RichEditor.svelte) with Svelte 5 runes (`$state`, `$derived`, `$props`).
- Styled in [globals.css](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/app/globals.css) with `.editor-dropdown-subitem-wrap`, `.editor-dropdown-submenu`, and `.editor-floating-table-menu`.
- Supported by [IconChevronRight.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/icons/IconChevronRight.svelte), [IconVideo.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/icons/IconVideo.svelte), and [IconTrash.svelte](file:///c:/Users/Pablo/Desktop/Poopshock/renhet-studio-web/src/lib/components/icons/IconTrash.svelte).

**Tradeoffs / pitfalls**

When using cascading submenus inside a parent popover, the parent popover must not have `overflow-y: auto` or `overflow: hidden`, or absolute child menus will be clipped. Ensure `onBlur` checks `relatedTarget?.closest("[data-floating-table-menu]")` so clicking table buttons does not prematurely close the menu before commands execute.
