<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { scrollDockState } from "./scrollDock.svelte";
  import IconArrowUp from "$lib/components/icons/IconArrowUp.svelte";

  let scrollY = $state(0);
  let isVisible = $derived(scrollY > 400 && !scrollDockState.isDocked);
  let floatingBtnEl: HTMLDivElement | null = $state(null);
  let isAnimating = false;

  let animTimeout: ReturnType<typeof setTimeout> | null = null;
  let animCleanup: (() => void) | null = null;

  function cancelActiveAnimation() {
    if (animTimeout) {
      clearTimeout(animTimeout);
      animTimeout = null;
    }
    if (animCleanup) {
      animCleanup();
      animCleanup = null;
    }
    isAnimating = false;
  }

  function cleanupFloating() {
    if (!floatingBtnEl) return;
    floatingBtnEl.style.transition = "";
    floatingBtnEl.style.transform = "";
    floatingBtnEl.style.opacity = "";
    floatingBtnEl.style.visibility = "";
    floatingBtnEl.style.pointerEvents = "";
  }

  function cleanupFooter(btn: HTMLElement | null) {
    if (!btn) return;
    btn.style.transition = "";
    btn.style.transform = "";
    btn.style.opacity = "";
    btn.style.pointerEvents = "";
  }

  function checkFooterIntersection(): boolean {
    const footerBtn = document.getElementById("footer-scroll-to-top");
    if (!footerBtn) return false;
    const rect = footerBtn.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  function dock(animated = true) {
    if (scrollDockState.isDocked && !isAnimating) return;
    const footerBtn = document.getElementById("footer-scroll-to-top");
    if (!footerBtn || !floatingBtnEl) {
      scrollDockState.isDocked = true;
      return;
    }

    cancelActiveAnimation();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      !animated ||
      prefersReducedMotion ||
      scrollY <= 400 ||
      scrollDockState.isScrollingToTop
    ) {
      scrollDockState.isDocked = true;
      cleanupFloating();
      cleanupFooter(footerBtn);
      return;
    }

    // FLIP: Measure current positions
    const first = floatingBtnEl.getBoundingClientRect();
    const last = footerBtn.getBoundingClientRect();
    const dx = first.left - last.left;
    const dy = first.top - last.top;

    scrollDockState.isDocked = true;
    floatingBtnEl.classList.remove("is-visible");
    floatingBtnEl.classList.add("is-docked");
    cleanupFloating();

    isAnimating = true;
    footerBtn.style.transition = "none";
    footerBtn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    footerBtn.style.opacity = "1";
    footerBtn.style.pointerEvents = "auto";
    footerBtn.getBoundingClientRect(); // force reflow

    const currentFooter = footerBtn;
    let onEnd: ((e?: TransitionEvent) => void) | null = null;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!currentFooter) return;
        currentFooter.style.transition =
          "transform 380ms cubic-bezier(0.22, 1, 0.36, 1)";
        currentFooter.style.transform = "translate3d(0, 0, 0)";

        onEnd = (e?: TransitionEvent) => {
          if (e && e.propertyName !== "transform") return;
          if (animCleanup) animCleanup();
          animCleanup = null;
          if (animTimeout) {
            clearTimeout(animTimeout);
            animTimeout = null;
          }
          cleanupFooter(currentFooter);
          cleanupFloating();
          isAnimating = false;
          verifyState();
        };

        animCleanup = () => {
          if (onEnd) currentFooter.removeEventListener("transitionend", onEnd);
        };
        currentFooter.addEventListener("transitionend", onEnd);
        animTimeout = setTimeout(() => {
          if (onEnd) onEnd();
        }, 420);
      });
    });
  }

  function undock(animated = true) {
    if (!scrollDockState.isDocked && !isAnimating) return;
    const footerBtn = document.getElementById("footer-scroll-to-top");
    if (!footerBtn || !floatingBtnEl) {
      scrollDockState.isDocked = false;
      return;
    }

    cancelActiveAnimation();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      !animated ||
      prefersReducedMotion ||
      scrollY <= 400 ||
      scrollDockState.isScrollingToTop
    ) {
      scrollDockState.isDocked = false;
      cleanupFooter(footerBtn);
      cleanupFloating();
      return;
    }

    // FLIP: Measure current positions
    const first = footerBtn.getBoundingClientRect();
    scrollDockState.isDocked = false;
    cleanupFooter(footerBtn);

    floatingBtnEl.classList.remove("is-docked", "is-hidden");
    floatingBtnEl.classList.add("is-visible");
    cleanupFloating();

    const last = floatingBtnEl.getBoundingClientRect();
    const startTop = Math.min(first.top, window.innerHeight + 30);
    const dx = first.left - last.left;
    const dy = startTop - last.top;

    isAnimating = true;
    floatingBtnEl.style.visibility = "visible";
    floatingBtnEl.style.opacity = "1";
    floatingBtnEl.style.pointerEvents = "auto";
    floatingBtnEl.style.transition = "none";
    floatingBtnEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    floatingBtnEl.getBoundingClientRect(); // force reflow

    const currentFloating = floatingBtnEl;
    let onEnd: ((e?: TransitionEvent) => void) | null = null;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!currentFloating) return;
        currentFloating.style.transition =
          "transform 380ms cubic-bezier(0.22, 1, 0.36, 1)";
        currentFloating.style.transform = "translate3d(0, 0, 0)";

        onEnd = (e?: TransitionEvent) => {
          if (e && e.propertyName !== "transform") return;
          if (animCleanup) animCleanup();
          animCleanup = null;
          if (animTimeout) {
            clearTimeout(animTimeout);
            animTimeout = null;
          }
          cleanupFloating();
          isAnimating = false;
          verifyState();
        };

        animCleanup = () => {
          if (onEnd)
            currentFloating.removeEventListener("transitionend", onEnd);
        };
        currentFloating.addEventListener("transitionend", onEnd);
        animTimeout = setTimeout(() => {
          if (onEnd) onEnd();
        }, 420);
      });
    });
  }

  function verifyState() {
    if (isAnimating || scrollDockState.isScrollingToTop) return;
    const inView = checkFooterIntersection();
    if (inView && !scrollDockState.isDocked) {
      dock(true);
    } else if (!inView && scrollDockState.isDocked) {
      undock(true);
    }
  }

  onMount(() => {
    scrollY = window.scrollY;
    if (checkFooterIntersection()) {
      scrollDockState.isDocked = true;
    }

    const footerBtn = document.getElementById("footer-scroll-to-top");
    let observer: IntersectionObserver | null = null;

    if (footerBtn) {
      observer = new IntersectionObserver(
        (entries) => {
          if (scrollDockState.isScrollingToTop || isAnimating) return;
          const isIntersecting = entries[0]?.isIntersecting ?? false;
          if (isIntersecting && !scrollDockState.isDocked) {
            dock(true);
          } else if (!isIntersecting && scrollDockState.isDocked) {
            undock(true);
          }
        },
        { threshold: 0 },
      );
      observer.observe(footerBtn);
    }

    const onScroll = () => {
      scrollY = window.scrollY;
      if (scrollDockState.isScrollingToTop) {
        if (scrollY <= 10) {
          scrollDockState.isScrollingToTop = false;
        }
        return;
      }
      if (!isAnimating) {
        verifyState();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelActiveAnimation();
    };
  });

  afterNavigate(() => {
    cancelActiveAnimation();
    scrollDockState.isDocked = false;
    scrollDockState.isScrollingToTop = false;
    cleanupFloating();
    const footerBtn = document.getElementById("footer-scroll-to-top");
    cleanupFooter(footerBtn);
  });

  const scrollToTop = () => {
    cancelActiveAnimation();
    scrollDockState.isScrollingToTop = true;
    scrollDockState.isDocked = false;

    const footerBtn = document.getElementById("footer-scroll-to-top");
    cleanupFooter(footerBtn);
    cleanupFloating();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };
</script>

<div
  bind:this={floatingBtnEl}
  class="scroll-floating-container fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8"
  class:is-visible={isVisible}
  class:is-hidden={!isVisible}
  class:is-docked={scrollDockState.isDocked}
>
  <button
    type="button"
    onclick={scrollToTop}
    class="group flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-full border border-[#fffdf3]/40 bg-[#344253]/90 text-[#fffdf3] shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fffdf3] hover:text-[#344253] hover:border-[#fffdf3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fffdf3] active:translate-y-0 active:scale-95"
    aria-label="Scroll back to top"
    title="Scroll to top"
  >
    <IconArrowUp size={16} />
  </button>
</div>

<style>
  .scroll-floating-container {
    will-change: opacity, transform;
  }

  .scroll-floating-container.is-visible {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    pointer-events: auto;
    transition:
      opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .scroll-floating-container.is-hidden {
    opacity: 0;
    transform: translate3d(0, 20px, 0) scale(0.82);
    pointer-events: none;
    transition:
      opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* Docked state: Must vanish INSTANTLY in frame 0 (no ghost fadeout or slide) */
  .scroll-floating-container.is-docked {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(1);
    pointer-events: none;
    visibility: hidden;
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-floating-container.is-visible,
    .scroll-floating-container.is-hidden {
      transition: opacity 200ms ease !important;
      transform: none !important;
    }
  }
</style>
