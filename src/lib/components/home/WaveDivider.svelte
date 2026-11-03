<script lang="ts">
  let {
    fillColor = "#f6f1e8",
    inverted = false,
    class: className = "",
  }: {
    fillColor?: string;
    inverted?: boolean;
    class?: string;
  } = $props();
</script>

<!--
  Seamless animated wave divider.
  viewBox="0 0 200 100", SVG width: 200%.
  Contains 2 identical 100-unit periods.
  translate3d(-50%, 0, 0) slides exactly 1 period → 100% seamless infinite loop.
  Container is transparent — zero background overlay to avoid cutting background sections.
  When inverted={true}, scaleY(-1) flips the wave so it crests downwards.
-->
<div
  class="wave-root relative w-full overflow-hidden leading-none pointer-events-none {inverted ? 'wave-inverted' : ''} {className}"
  aria-hidden="true"
>
  <!-- Layer 1: Slow back wave (gentle ripple) -->
  <svg
    class="wave wave-back absolute bottom-0 left-0 h-full"
    viewBox="0 0 200 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,65 C16,45 34,85 50,65 C66,45 84,85 100,65 C116,45 134,85 150,65 C166,45 184,85 200,65 L200,100 L0,100 Z"
      fill={fillColor}
      opacity="0.3"
    />
  </svg>

  <!-- Layer 2: Medium wave -->
  <svg
    class="wave wave-mid absolute bottom-0 left-0 h-full"
    viewBox="0 0 200 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,70 C14,50 36,90 50,70 C64,50 86,90 100,70 C114,50 136,90 150,70 C164,50 186,90 200,70 L200,100 L0,100 Z"
      fill={fillColor}
      opacity="0.5"
    />
  </svg>

  <!-- Layer 3: Solid foreground wave -->
  <svg
    class="wave wave-front absolute bottom-0 left-0 h-full"
    viewBox="0 0 200 100"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0,60 C12,40 38,80 50,60 C62,40 88,80 100,60 C112,40 138,80 150,60 C162,40 188,80 200,60 L200,100 L0,100 Z"
      fill={fillColor}
    />
  </svg>
</div>

<style>
  .wave-root {
    height: 72px;
  }

  @media (min-width: 640px) {
    .wave-root {
      height: 96px;
    }
  }

  .wave-inverted {
    transform: scaleY(-1);
  }

  .wave {
    width: 200%;
    will-change: transform;
    pointer-events: none;
  }

  .wave-back {
    animation: wave-fwd 26s linear infinite;
  }

  .wave-mid {
    animation: wave-rev 19s linear infinite;
  }

  .wave-front {
    animation: wave-fwd 13s linear infinite;
  }

  @keyframes wave-fwd {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-50%, 0, 0);
    }
  }

  @keyframes wave-rev {
    from {
      transform: translate3d(-50%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave {
      animation: none !important;
    }
  }
</style>
