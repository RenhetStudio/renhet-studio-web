<script lang="ts">
  import { onMount } from "svelte";

  let dotEl = $state<HTMLDivElement | null>(null);
  let ringEl = $state<HTMLDivElement | null>(null);

  let isHovered = $state(false);
  let isPointerActive = $state(false);
  let isHidden = $state(true);

  onMount(() => {
    // Only activate for devices with mouse/fine pointer and without reduced motion
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

      // Update leading dot position immediately via CSSOM transform
      if (dotEl) {
        dotEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      isHovered = !!target?.closest("a, button, [role='button'], input, [role='tab'], .badge-stamp");
    };

    const onMouseLeave = () => {
      isHidden = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Smooth trailing physics via lerp
    let animId: number;
    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      if (ringEl) {
        ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
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
  <!-- Leading small dot -->
  <div
    bind:this={dotEl}
    class="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4f5f70] transition-opacity duration-200 {isHidden
      ? 'opacity-0'
      : 'opacity-80'}"
    aria-hidden="true"
  ></div>

  <!-- Trailing reactive ring -->
  <div
    bind:this={ringEl}
    class="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4f5f70]/40 transition-all duration-200 ease-out {isHidden
      ? 'opacity-0'
      : 'opacity-100'} {isHovered
      ? 'h-11 w-11 border-[#4f5f70] bg-[#b8d4f0]/25 scale-110'
      : 'h-7 w-7 bg-transparent'}"
    aria-hidden="true"
  ></div>
{/if}
