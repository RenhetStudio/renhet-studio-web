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

### Unified hero detection with data-hero and CSS Scroll-Driven Animations

**Simple explanation**

Floating navigation bars should adapt to whether a page has a hero section without hardcoding lists of route paths, and they should load immediately in their correct visual state without flashes or unwanted transition animations.

**How it works**

Instead of checking specific URL paths or maintaining route sets, any page featuring a hero section tags its hero container with the `data-hero` attribute.

1. **At the CSS level:** The navigation pill uses CSS Scroll-Driven Animations (`animation-timeline: scroll()`) scoped with `:root:has([data-hero])`. Because the browser's style and layout engine evaluates `:has([data-hero])` directly on the SSR HTML before first paint:
   - On initial load at `scrollY = 0`, it paints the transparent hero navbar immediately without an entry transition.
   - On page reload deep into the page (`scrollY > 70vh`), the compositor evaluates 100% scroll progress and paints the solid navbar immediately.
   - Pages without `data-hero` match `:root:not(:has([data-hero]))`, statically rendering the solid navbar and full wordmark logo without enabling scroll timelines.
2. **At the JavaScript level:** Client-side visibility checks use `document.querySelector<HTMLElement>("[data-hero]")`. When `rect.bottom > 80` changes, Svelte drives the discrete 300ms morph animation between the compact symbol and the full wordmark logo.

**Why it matters**

Hardcoding route lists (such as `Set(["/", "/blog", "/careers"])`) is brittle and requires manual updates whenever routes or hero sections change. Relying strictly on client hydration to toggle navbar states causes visual flashes or jarring transitions on initial load, while using cookies or server load functions to sync scroll position introduces unnecessary network and server overhead.

**In this project**

`src/lib/components/SiteHeader.svelte` detects `[data-hero]` dynamically. Hero sections in `src/lib/components/home/HeroSplit.svelte`, `src/routes/blog/+page.svelte`, and `src/routes/careers/+page.svelte` are marked with `data-hero`. Non-hero pages like `src/routes/games/beelze-pub/+page.svelte` and `src/routes/account/+page.svelte` omit it.

**Tradeoffs / pitfalls**

CSS `:has()` and `animation-timeline: scroll()` are supported in modern evergreen browsers. For older browsers without scroll-driven animation support, `@supports not (animation-timeline: scroll())` falls back to standard CSS transitions toggled by JavaScript state. The logo morphing animation retains a discrete 300ms CSS transition rather than scrubbing continuously along scroll progress to preserve its snappy, deliberate feel.

### Mathematical 2-period SVGs for seamless infinite wave dividers

**Simple explanation**

Infinite animated wave dividers should loop continuously without visual seam tears, stutters, or subpixel rounding cracks between stacked colored sections.

**How it works**

The wave path is defined inside an SVG `viewBox="0 0 200 100"` with exactly two mathematically identical repeating periods ($x = 0..100$ and $x = 100..200$) with $C^1$ continuity at inflection points. Hardware-accelerated CSS `transform: translate3d(-50%, 0, 0)` shifts the SVG by exactly one period. When the animation resets to `0%`, the visual geometry is identical, creating a seamless infinite loop.

To prevent hairline cracks caused by subpixel rounding on retina/high-DPI screens or zoom changes, vertical bleed (`-top-20`, `-bottom-20`) extends the SVG bounding box to completely cover seam joints.

**Why it matters**

Single-period SVGs or percentage approximations cause jarring visual jumps on each animation cycle. Unpadded SVG containers leave 1px subpixel rendering gaps where the background peeks through between dark and light sections.

**In this project**

`src/lib/components/home/WaveDivider.svelte` provides seamless 3-layer wave dividers, with an inverted variant (`scaleY(-1)`) used as a shoreline transition in `src/lib/components/SiteFooter.svelte` and on hero bottoms in `/blog` and `/careers`.

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

If the source element fades out with a CSS transition while the target element moves, both elements will temporarily be visible simultaneously (creating a ghost clone). The handoff must be instantaneous. Additionally, verify `prefers-reduced-motion` to disable transforms for users who request minimal motion, and guard against route navigation by invalidating the observer when the page changes.

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
`svelte.config.js` owns the CSP directives. `src/hooks.server.ts` adds HSTS, frame, content-type, referrer, opener, and permissions policies. Dynamic presentation uses classes or validated `data-*` attributes because `style-src-attr 'none'` blocks inline style attributes.

**Tradeoffs / pitfalls**
Strict CSP can break new third-party embeds or inline styles unless their exact origins and rendering strategy are reviewed. Keep the allowlist narrow and verify response headers after deployment.

### Spreadsheet formula injection

**Simple explanation**
Spreadsheet cells beginning with `=`, `+`, `-`, or `@` can be interpreted as formulas instead of plain applicant text.

**In this project**
`integrations/google-apps-script/Code.gs` prefixes those values with an apostrophe before `appendRow`, preserving the submitted text as a literal value.
