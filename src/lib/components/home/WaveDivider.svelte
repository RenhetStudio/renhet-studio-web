<script lang="ts">
  let {
    class: className = "",
  }: {
    class?: string;
  } = $props();
</script>

<div
  class="relative h-24 w-full overflow-hidden leading-none bg-[#8fb8d8] {className}"
  aria-hidden="true"
>
  <!-- Layer 1: Slow back wave -->
  <div class="wave-layer wave-layer-back">
    <svg
      viewBox="0 0 2400 120"
      preserveAspectRatio="none"
      class="h-full w-[2400px]"
    >
      <path
        d="M0,45 C300,10 600,80 900,45 C1200,10 1500,80 1800,45 C2100,10 2400,80 2400,45 L2400,120 L0,120 Z"
        fill="#b8d4f0"
        opacity="0.38"
      />
    </svg>
  </div>

  <!-- Layer 2: Medium wave -->
  <div class="wave-layer wave-layer-middle">
    <svg
      viewBox="0 0 2400 120"
      preserveAspectRatio="none"
      class="h-full w-[2400px]"
    >
      <path
        d="M0,60 C350,90 650,25 950,60 C1250,95 1550,25 1850,60 C2150,95 2400,35 2400,60 L2400,120 L0,120 Z"
        fill="#b8d4f0"
        opacity="0.6"
      />
    </svg>
  </div>

  <!-- Layer 3: Foreground wave solid fill matching page paper (#f6f1e8) -->
  <div class="wave-layer wave-layer-front">
    <svg
      viewBox="0 0 2400 120"
      preserveAspectRatio="none"
      class="h-full w-[2400px]"
    >
      <path
        d="M0,50 C320,15 640,85 960,50 C1280,15 1600,85 1920,50 C2240,15 2400,75 2400,50 L2400,120 L0,120 Z"
        fill="#f6f1e8"
      />
    </svg>
  </div>
</div>

<style>
  .wave-layer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 100%;
    display: flex;
    will-change: transform;
    pointer-events: none;
  }

  .wave-layer-back {
    animation: wave-slide 24s linear infinite;
  }

  .wave-layer-middle {
    animation: wave-slide-reverse 17s linear infinite;
  }

  .wave-layer-front {
    animation: wave-slide 12s linear infinite;
  }

  @keyframes wave-slide {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }

  @keyframes wave-slide-reverse {
    0% {
      transform: translate3d(-50%, 0, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave-layer {
      animation: none !important;
    }
  }
</style>
