# Agent Guidelines for Renhet Studio Web

This repository is the official website for **Renhet Studio**, built with **SvelteKit 2**, **Svelte 5 (Runes)**, and **Tailwind CSS v4**.

---

## 1. Technical Stack & Conventions

* **Framework:** SvelteKit 2.x with Vite.
* **Component Model:** Svelte 5 with Runes exclusively (`$state`, `$derived`, `$props`, `$effect`).
  * Do **NOT** use Svelte 4 legacy syntax (`export let`, `$: reactiveDeclarations`, `beforeUpdate`, `afterUpdate`).
  * Do **NOT** assume Next.js conventions; this is pure SvelteKit.
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`).
* **Type Safety:** TypeScript strict mode. Always verify code with `npm run check` (`svelte-check`) — 0 errors and 0 warnings required.

---

## 2. Design System & Anti-Cliché Rules (from `SPECS.md`)

* **Authentic Indie Palette:** Paper canvas (`#f6f1e8`), Pond Blue (`#8fb8d8`), Sky Blue (`#b8d4f0`), Slate Ink (`#4f5f70`), Deep Dark (`#344253`), Cream (`#fffdf3`).
* **Typography:** Paperlogy (`static/fonts/Paperlogy-*.woff2`) as primary font.
* **"No Cards" Rule:** Sections are framed by typography, whitespace, and organic dividers — **never** by artificial card boxes or bordered containers. (The sole exception is the artisan stamps in *The Crew*).
* **No Fluff / Concise Copy:** Every line of copy must be purposeful and minimal. Avoid marketing filler, SaaS clichés, or rhetorical questions.
* **Vector Icons Only (No Unicode / Emojis):** Never use Unicode arrows or emojis (`←`, `→`, `↗`, `✨`, `🚀`). Always use or create dedicated SVG components in `src/lib/components/icons/`.

---

## 3. Mandatory Architectural Patterns

### 3.1. Standardized Hero Detection (`[data-hero]`)
* **Rule:** **NEVER** hardcode lists of routes (e.g. `const HERO_ROUTES = new Set(...)`) to detect hero sections.
* **Pattern:** Any page featuring a hero section tags its hero container with the `data-hero` attribute (`<section id="hero" data-hero>` or `<header class="...-hero" data-hero>`).
* **Detection:**
  * **JavaScript:** `document.querySelector<HTMLElement>("[data-hero]")` and `rect.bottom > 80`.
  * **CSS:** `:global(:root:has([data-hero]))` for hero-active styling, and `:global(:root:not(:has([data-hero])))` for non-hero pages (e.g. `/games/beelze-pub`, `/account`).

### 3.2. Initial Load & Scroll State (No Flash)
* When styling elements that change on scroll (e.g. floating navbar):
  * Use native CSS Scroll-Driven Animations (`animation-timeline: scroll()`) where CSS can evaluate state prior to first paint.
  * Do **NOT** use cookies, server layout loaders, or inline `<head>` scripts to synchronize scroll state.
  * Always verify both cases:
    1. Initial load at top of page (`scrollY = 0`): must paint the transparent/hero style immediately without an entry animation.
    2. Page reload while scrolled down (`scrollY > 0`): must paint the solid style immediately without snapping or jumping.

### 3.3. Preserving Established User Experiences
* Do **NOT** replace discrete, snappy user-experience transitions (e.g. the 300ms logo morphing between symbol and wordmark) with continuous scroll-scrubbed animations unless explicitly instructed.
* Reserve layout space in morphing components to prevent Cumulative Layout Shift (CLS).

### 3.4. Procedural Audio
* All interactive click sounds use synthesized Web Audio API procedural sound in `src/lib/audio/soundEffects.ts`.
* Click-only interaction; no hover sounds. Random frequency jitter (`480Hz ± 60Hz`) ensures natural acoustics.

---

## 4. Documentation & Learnings Standard (CRITICAL)

To prevent regression, repeated mistakes, and architectural drift:

1. **Consult `LEARNINGS.md` First:** Before proposing or implementing complex solutions for animations, audio, navigation, CSP, or integrations, review `LEARNINGS.md` and `SPECS.md`.
2. **Document Every Significant Technique:** When you solve a non-trivial edge case, introduce an architectural standard, or fix a tricky interaction:
   * **Always add an entry to [LEARNINGS.md](LEARNINGS.md)** under the appropriate section.
   * Follow the standard 5-part format:
     - `**Simple explanation**`
     - `**How it works**`
     - `**Why it matters**`
     - `**In this project**`
     - `**Tradeoffs / pitfalls**`
3. **Keep Code Clean:** Write clean, standard code with concise comments. Put the detailed architectural rationale and learnings in `LEARNINGS.md`, not in long inline code comments.
4. **Clean Up Obsolete Documents:** When a design document, task checklist, or roadmap plan is fully implemented and concluded, remove it to keep the repository tidy and accurate.
