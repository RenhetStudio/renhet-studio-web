<script lang="ts">
  import { page } from "$app/state";
  import { scrollDockState } from "./scrollDock.svelte";
  import IconArrowUp from "$lib/components/icons/IconArrowUp.svelte";

  let scrollY = $state(0);
  let isVisible = $derived(scrollY > 400 && !scrollDockState.isDocked);
  let floatingBtnEl: HTMLDivElement | null = $state(null);
  let isAnimating = $state(false);

  $effect(() => {
    // Re-evaluate whenever the route changes (SvelteKit client navigation)
    void page.url.pathname;

    const footerBtn = document.getElementById("footer-scroll-to-top");
    if (!footerBtn || !floatingBtnEl) return;

    let initialized = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0]?.isIntersecting ?? false;
        if (!floatingBtnEl || isAnimating) return;

        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // If page is loaded while already scrolled into the footer:
        if (!initialized) {
          initialized = true;
          if (isIntersecting) {
            scrollDockState.isDocked = true;
            return;
          }
        }

        if (isIntersecting && !scrollDockState.isDocked) {
          // If floating button wasn't even visible yet (e.g. short page), dock without animation
          if (prefersReducedMotion || scrollY <= 400) {
            scrollDockState.isDocked = true;
            return;
          }

          // FLIP docking animation: Floating button glides into Footer button
          const first = floatingBtnEl.getBoundingClientRect();
          const last = footerBtn.getBoundingClientRect();

          const dx = first.left - last.left;
          const dy = first.top - last.top;

          isAnimating = true;

          // Set footer button to starting position (matching floating button's position)
          footerBtn.style.transition = "none";
          footerBtn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
          footerBtn.style.opacity = "1";
          footerBtn.style.pointerEvents = "auto";
          footerBtn.getBoundingClientRect(); // force reflow

          // Floating button vanishes immediately (no ghost duplicate)
          scrollDockState.isDocked = true;

          const currentFooterBtn = footerBtn;
          requestAnimationFrame(() => {
            currentFooterBtn.style.transition =
              "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
            currentFooterBtn.style.transform = "translate3d(0, 0, 0)";

            const handleTransitionEnd = (e: TransitionEvent) => {
              if (
                e.target !== currentFooterBtn ||
                e.propertyName !== "transform"
              )
                return;
              currentFooterBtn.removeEventListener(
                "transitionend",
                handleTransitionEnd
              );
              currentFooterBtn.style.transform = "";
              currentFooterBtn.style.transition = "";
              currentFooterBtn.style.opacity = "";
              currentFooterBtn.style.pointerEvents = "";
              isAnimating = false;
            };

            currentFooterBtn.addEventListener(
              "transitionend",
              handleTransitionEnd
            );

            // Fallback timeout in case transitionend does not fire
            setTimeout(() => {
              currentFooterBtn.removeEventListener(
                "transitionend",
                handleTransitionEnd
              );
              currentFooterBtn.style.transform = "";
              currentFooterBtn.style.transition = "";
              currentFooterBtn.style.opacity = "";
              currentFooterBtn.style.pointerEvents = "";
              isAnimating = false;
            }, 460);
          });
        } else if (!isIntersecting && scrollDockState.isDocked) {
          if (prefersReducedMotion) {
            scrollDockState.isDocked = false;
            return;
          }

          // FLIP undocking animation: Footer button glides back to Floating position
          const first = footerBtn.getBoundingClientRect();
          isAnimating = true;

          // Footer button hides immediately
          scrollDockState.isDocked = false;

          requestAnimationFrame(() => {
            if (!floatingBtnEl) {
              isAnimating = false;
              return;
            }

            const currentFloatingEl = floatingBtnEl;
            const last = currentFloatingEl.getBoundingClientRect();
            const dx = first.left - last.left;
            const dy = first.top - last.top;

            currentFloatingEl.style.transition = "none";
            currentFloatingEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
            currentFloatingEl.style.opacity = "1";
            currentFloatingEl.getBoundingClientRect(); // force reflow

            requestAnimationFrame(() => {
              currentFloatingEl.style.transition =
                "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
              currentFloatingEl.style.transform = "translate3d(0, 0, 0)";

              const handleTransitionEnd = (e: TransitionEvent) => {
                if (
                  e.target !== currentFloatingEl ||
                  e.propertyName !== "transform"
                )
                  return;
                currentFloatingEl.removeEventListener(
                  "transitionend",
                  handleTransitionEnd
                );
                currentFloatingEl.style.transform = "";
                currentFloatingEl.style.transition = "";
                currentFloatingEl.style.opacity = "";
                isAnimating = false;
              };

              currentFloatingEl.addEventListener(
                "transitionend",
                handleTransitionEnd
              );

              setTimeout(() => {
                currentFloatingEl.removeEventListener(
                  "transitionend",
                  handleTransitionEnd
                );
                currentFloatingEl.style.transform = "";
                currentFloatingEl.style.transition = "";
                currentFloatingEl.style.opacity = "";
                isAnimating = false;
              }, 460);
            });
          });
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(footerBtn);
    return () => observer.disconnect();
  });

  const scrollToTop = () => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };
</script>

<svelte:window bind:scrollY />

<div
  bind:this={floatingBtnEl}
  class="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8 {isVisible
    ? 'pointer-events-auto opacity-100 scale-100'
    : 'pointer-events-none opacity-0 scale-90'}"
  style={scrollDockState.isDocked
    ? "opacity: 0; pointer-events: none; transition: none;"
    : "transition: opacity 250ms ease, scale 250ms ease;"}
>
  <button
    type="button"
    onclick={scrollToTop}
    class="group flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border border-[#fffdf3]/40 bg-[#4f5f70]/95 text-[#fffdf3] shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fffdf3] hover:text-[#4f5f70] hover:border-[#fffdf3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fffdf3] active:translate-y-0 active:scale-95"
    aria-label="Scroll back to top"
    title="Scroll to top"
  >
    <IconArrowUp
      size={16}
      class="transition-transform duration-200 group-hover:-translate-y-0.5"
    />
  </button>
</div>
