<script lang="ts">
  import { onMount } from "svelte";

  let mouseX = $state(-100);
  let mouseY = $state(-100);
  let ringX = $state(-100);
  let ringY = $state(-100);
  let isHovered = $state(false);
  let isPointerActive = $state(false);
  let isHidden = $state(true);

  onMount(() => {
    // Check if device supports fine hover (desktop mouse)
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) {
      return;
    }

    isPointerActive = true;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (isHidden) isHidden = false;

      // Check if hovering over link/button/clickable
      const target = e.target as HTMLElement | null;
      isHovered = !!target?.closest("a, button, [role='button'], input, .badge-stamp");
    };

    const onMouseLeave = () => {
      isHidden = true;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Smooth trailing physics via lerp
    let animId: number;
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
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
    class="pointer-events-none fixed z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4f5f70] transition-opacity duration-200 {isHidden
      ? 'opacity-0'
      : 'opacity-80'}"
    style="left: {mouseX}px; top: {mouseY}px;"
    aria-hidden="true"
  ></div>

  <!-- Trailing reactive ring -->
  <div
    class="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4f5f70]/40 transition-all duration-200 ease-out {isHidden
      ? 'opacity-0'
      : 'opacity-100'} {isHovered
      ? 'h-11 w-11 border-[#4f5f70] bg-[#b8d4f0]/25 scale-110'
      : 'h-7 w-7 bg-transparent'}"
    style="left: {ringX}px; top: {ringY}px;"
    aria-hidden="true"
  ></div>
{/if}
