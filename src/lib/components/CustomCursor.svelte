<script lang="ts">
  import { onMount } from "svelte";

  let dotEl = $state<HTMLDivElement | null>(null);
  let ringEl = $state<HTMLDivElement | null>(null);

  let isHovered = $state(false);
  let isPointerActive = $state(false);
  let isHidden = $state(true);

  onMount(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) {
      return;
    }

    isPointerActive = true;

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (isHidden) isHidden = false;

      // Use left/top (centered via CSS transform: translate(-50%,-50%)) — no inline style conflicts
      if (dotEl) {
        dotEl.style.left = `${targetX}px`;
        dotEl.style.top = `${targetY}px`;
      }

      const target = e.target as HTMLElement | null;
      isHovered = !!target?.closest("a, button, [role='button'], input, [role='tab'], .badge-stamp");
    };

    const onMouseLeave = () => {
      isHidden = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    let animId: number;
    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      if (ringEl) {
        ringEl.style.left = `${ringX}px`;
        ringEl.style.top = `${ringY}px`;
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animId);
    };
  });
</script>

{#if isPointerActive}
  <!-- Leading small dot: centered via .cursor-dot CSS class -->
  <div
    bind:this={dotEl}
    class="cursor-dot pointer-events-none fixed z-[9999] h-2 w-2 rounded-full bg-[#4f5f70] transition-opacity duration-200 {isHidden
      ? 'opacity-0'
      : 'opacity-80'}"
    aria-hidden="true"
  ></div>

  <!-- Trailing reactive ring: centered via .cursor-ring CSS class -->
  <div
    bind:this={ringEl}
    class="cursor-ring pointer-events-none fixed z-[9998] rounded-full border border-[#4f5f70]/40 transition-[width,height,opacity,background-color] duration-200 ease-out {isHidden
      ? 'opacity-0'
      : 'opacity-100'} {isHovered
      ? 'h-11 w-11 border-[#4f5f70] bg-[#b8d4f0]/25'
      : 'h-7 w-7 bg-transparent'}"
    aria-hidden="true"
  ></div>
{/if}

<style>
  /* Centering applied purely via CSS — no inline transform that JS could override */
  .cursor-dot,
  .cursor-ring {
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
  }
</style>
