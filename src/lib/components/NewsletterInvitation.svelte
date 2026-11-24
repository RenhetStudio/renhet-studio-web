<script lang="ts">
  import { onMount, tick } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import IconClose from "$lib/components/icons/IconClose.svelte";
  import IconMail from "$lib/components/icons/IconMail.svelte";
  import NewsletterSignup from "./NewsletterSignup.svelte";
  import {
    dismissNewsletterInvitation,
    newsletterPreferences,
    restoreNewsletterPreferences,
  } from "./newsletter-preferences.svelte";

  let ready = $state(false);
  let footerEndVisible = $state(false);
  let open = $state(false);
  let closeButton: HTMLButtonElement;
  let panel: HTMLElement;
  let opener: HTMLElement | undefined;
  let viewportOffset = $state(0);

  const showLauncher = $derived(
    ready && !open && !footerEndVisible &&
      !newsletterPreferences.subscribed && !newsletterPreferences.dismissed,
  );

  afterNavigate(({ from, to }) => {
    if (!from || from.url.pathname === to?.url.pathname) return;
    open = false;
  });

  onMount(() => {
    restoreNewsletterPreferences();
    const footerEnd = document.querySelector("[data-newsletter-footer-end]");
    if (!footerEnd) {
      ready = true;
      return;
    }

    const footerObserver = new IntersectionObserver(([entry]) => {
      footerEndVisible = entry.isIntersecting;
      ready = true;
    });
    footerObserver.observe(footerEnd);
    return () => footerObserver.disconnect();
  });

  $effect(() => {
    const viewport = window.visualViewport;
    if (!open || !viewport) return;

    function updateViewport() {
      if (!viewport) return;
      const { height, offsetTop } = viewport;
      const offset = Math.max(0, document.documentElement.clientHeight - height - offsetTop);
      viewportOffset = offset;
      panel.style.setProperty("--viewport-height", height ? `${height}px` : "");
      panel.style.setProperty("--viewport-offset", `${offset}px`);
    }

    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
    };
  });

  async function openPanel(trigger: HTMLElement) {
    opener = trigger;
    open = true;
    await tick();
    if (open) closeButton.focus({ preventScroll: true });
  }

  export function openFromLink(event: MouseEvent & { currentTarget: HTMLAnchorElement }) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void openPanel(event.currentTarget);
  }

  async function closePanel() {
    open = false;
    await tick();
    if (opener?.getClientRects().length && !opener.closest("[inert]")) opener.focus({ preventScroll: true });
    else document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
  }

  function dismissLauncher() {
    dismissNewsletterInvitation();
    document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
  }

  function handleEscape(event: KeyboardEvent) {
    if (!open || event.defaultPrevented || event.key !== "Escape") return;
    if (!panel.contains(document.activeElement)) return;
    event.preventDefault();
    void closePanel();
  }
</script>

<svelte:window onkeydown={handleEscape} />

<div inert={!showLauncher} class="invitation launcher-container z-40" class:is-visible={showLauncher}>
  <div class="launcher flex items-center rounded-full bg-[#344253]/90 text-[#fffdf3] shadow-md ring-1 ring-inset ring-[#fffdf3]/40 backdrop-blur-md">
    <button
      type="button"
      aria-label="Count me in for the newsletter"
      aria-controls="newsletter-panel"
      aria-expanded={open}
      onclick={(event) => void openPanel(event.currentTarget)}
      class="inline-flex h-[var(--floating-control-size)] cursor-pointer items-center rounded-full text-sm font-bold transition-colors duration-200 hover:bg-[#fffdf3] hover:text-[#344253] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3]"
    >
      <span class="grid size-[var(--floating-control-size)] shrink-0 place-items-center">
        <IconMail size={16} strokeWidth={3} />
      </span>
      <span class="launcher-extra" aria-hidden="true">
        <span class="overflow-hidden whitespace-nowrap"><span class="pr-3">Count me in</span></span>
      </span>
    </button>
    <div class="launcher-extra">
      <div class="overflow-hidden">
        <button
          type="button"
          aria-label="Dismiss newsletter invitation"
          onclick={dismissLauncher}
          class="launcher-dismiss grid size-[var(--floating-control-size)] cursor-pointer place-items-center rounded-full transition-colors duration-200 hover:bg-[#fffdf3]/15 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#fffdf3]"
        >
          <IconClose size={14} />
        </button>
      </div>
    </div>
  </div>
</div>

<section
  bind:this={panel}
  id="newsletter-panel"
  aria-labelledby="newsletter-panel-title"
  inert={!open}
  class="invitation panel z-50 rounded-3xl border-2 border-[#fffdf3] bg-[#4f5f70]/95 p-4 text-[#fffdf3] shadow-[0_16px_40px_rgba(30,40,55,0.35)] ring-1 ring-[#fffdf3]/30 backdrop-blur-xl sm:p-5"
  class:is-visible={open}
  class:keyboard-open={viewportOffset > 0}
>
  <div class="mb-3 flex items-start justify-between gap-3">
    <div>
      <h2 id="newsletter-panel-title" class="text-xl leading-tight font-black">Newsletter</h2>
      <p class="mt-1 text-sm font-semibold text-[#fffdf3]/90">Good things are worth sharing.</p>
    </div>
    <button
      bind:this={closeButton}
      type="button"
      aria-label="Close newsletter form"
      onclick={closePanel}
      class="-mt-1 -mr-1 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-[#fffdf3]/30 bg-[#fffdf3]/10 transition-colors duration-200 hover:bg-[#fffdf3]/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fffdf3]"
    >
      <IconClose size={16} />
    </button>
  </div>
  <NewsletterSignup compact onSuccess={async () => {
    if (!open || (document.activeElement !== document.body && !panel.contains(document.activeElement))) return;
    await tick();
    if (open) closeButton.focus({ preventScroll: true });
  }} />
</section>

<style>
  .invitation {
    position: fixed;
    left: max(var(--floating-edge-gap), env(safe-area-inset-left, 0px));
    bottom: var(--floating-bottom);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(0.75rem) scale(0.96);
    transform-origin: bottom left;
    transition:
      opacity 240ms ease,
      transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
      visibility 0s 280ms;
  }

  .invitation.is-visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: none;
    transition:
      opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (width < 40rem), (hover: none) and (pointer: coarse) and (height < 40rem) {
    .launcher-container {
      display: none;
    }
  }

  .launcher-extra {
    display: grid;
    grid-template-columns: var(--launcher-extra-track, 0fr);
    transition: grid-template-columns 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .launcher-dismiss {
    opacity: var(--launcher-dismiss-opacity, 0);
  }

  .launcher:has(:focus-visible) {
    --launcher-extra-track: 1fr;
    --launcher-dismiss-opacity: 1;
  }

  @media (hover: hover) and (pointer: fine) {
    .launcher:hover {
      --launcher-extra-track: 1fr;
      --launcher-dismiss-opacity: 1;
    }
  }

  .panel {
    --bottom-gap: calc(var(--floating-bottom) + var(--floating-control-size) + 0.25rem);
    bottom: calc(var(--bottom-gap) + var(--viewport-offset, 0px));
    width: min(26rem, calc(100% - max(var(--floating-edge-gap), env(safe-area-inset-left, 0px)) - max(var(--floating-edge-gap), env(safe-area-inset-right, 0px))));
    max-height: calc(var(--viewport-height, 100dvh) - var(--bottom-gap) - 0.75rem);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .panel.keyboard-open {
    --bottom-gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .panel:not(.keyboard-open) {
      --bottom-gap: var(--floating-bottom);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .invitation,
    .invitation.is-visible {
      transform: none;
      transition: none;
    }

    .launcher-extra {
      transition: none;
    }
  }
</style>
