<script lang="ts">
  import { onMount } from "svelte";

  let {
    topColor = "#8fb8d8",
    bottomColor = "#f6f1e8",
    class: className = "",
  }: {
    topColor?: string;
    bottomColor?: string;
    class?: string;
  } = $props();

  let rootEl = $state<HTMLDivElement | null>(null);

  // Set background via JS DOM (CSP: style-src-attr none blocks template style={} but allows el.style)
  onMount(() => {
    if (rootEl) rootEl.style.backgroundColor = topColor;
  });

  $effect(() => {
    if (rootEl) rootEl.style.backgroundColor = topColor;
  });
</script>

<!--
  Seamless wave divider.
  SVG is width:200% (2 full periods across viewBox 0-200).
  Animation shifts exactly -50% → one period → perfectly seamless loop.
  topColor = background of the container (colour above the waves)
  bottomColor = fill of the waves (colour below the waves, matches section below)
-->
<div
  bind:this={rootEl}
  class="wave-root relative w-full overflow-hidden leading-none {className}"
  aria-hidden="true"
>
  <!-- Back wave (slowest, semi-transparent) -->
  <svg
    class="wave wave-back absolute bottom-0 left-0 h-full"
    viewBox="0 0 200 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,65 C16,45 34,85 50,65 C66,45 84,85 100,65 C116,45 134,85 150,65 C166,45 184,85 200,65 L200,100 L0,100 Z"
      fill={bottomColor}
      opacity="0.35"
    />
  </svg>

  <!-- Mid wave -->
  <svg
    class="wave wave-mid absolute bottom-0 left-0 h-full"
    viewBox="0 0 200 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,70 C14,50 36,90 50,70 C64,50 86,90 100,70 C114,50 136,90 150,70 C164,50 186,90 200,70 L200,100 L0,100 Z"
      fill={bottomColor}
      opacity="0.6"
    />
  </svg>

  <!-- Front wave (solid, matches bottomColor exactly) -->
  <svg
    class="wave wave-front absolute bottom-0 left-0 h-full"
    viewBox="0 0 200 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,60 C12,40 38,80 50,60 C62,40 88,80 100,60 C112,40 138,80 150,60 C162,40 188,80 200,60 L200,100 L0,100 Z"
      fill={bottomColor}
    />
  </svg>
</div>

<style>
  .wave-root {
    height: 96px;
  }

  /* Each SVG spans 2 full periods wide so shifting -50% = exactly 1 period = seamless */
  .wave {
    width: 200%;
    will-change: transform;
    pointer-events: none;
  }

  .wave-back {
    animation: wave-fwd 24s linear infinite;
  }

  .wave-mid {
    animation: wave-rev 17s linear infinite;
  }

  .wave-front {
    animation: wave-fwd 12s linear infinite;
  }

  @keyframes wave-fwd {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-50%, 0, 0); }
  }

  @keyframes wave-rev {
    from { transform: translate3d(-50%, 0, 0); }
    to   { transform: translate3d(0, 0, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave {
      animation: none !important;
    }
  }
</style>
