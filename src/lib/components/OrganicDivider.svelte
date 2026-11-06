<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    class?: string;
    seed?: string | number;
    randomOnMount?: boolean;
  }

  let {
    class: className = "",
    seed = "default",
    randomOnMount = false,
  }: Props = $props();

  let nonce = $state<number | null>(null);

  // Aleatoriedad reproducible a partir de una semilla
  function createRandom(value: string | number) {
    let hash = 2166136261;

    for (const char of String(value)) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }

    let state = hash >>> 0;

    return () => {
      state += 0x6d2b79f5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  type Point = { x: number; y: number };

  // Convierte puntos en curvas Bézier suaves
  function smoothCurve(points: Point[], start = false) {
    let d = start
      ? `M ${points[0].x} ${points[0].y}`
      : `L ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }

  function generatePath(value: string | number) {
    const random = createRandom(value);

    const xs = [
      0, 25, 90, 160, 240, 340, 440, 540, 640, 740, 840, 940, 1040, 1120, 1175,
      1200,
    ];

    let drift = 0;

    const center = xs.map((x) => {
      // Variación gradual, sin cambios bruscos
      drift = drift * 0.55 + (random() - 0.5) * 4;

      // Extremos estrechos y centro ligeramente más grueso
      const envelope = Math.sin((Math.PI * x) / 1200);
      const thickness = envelope * (3.5 + random() * 2.8);

      const y = 23.5 + drift;

      return { x, y, thickness };
    });

    const top = center.map((p) => ({
      x: p.x,
      y: p.y - p.thickness,
    }));

    const bottom = center
      .map((p) => ({
        x: p.x,
        y: p.y + p.thickness,
      }))
      .reverse();

    return smoothCurve(top, true) + " " + smoothCurve(bottom) + " Z";
  }

  // La primera renderización coincide en servidor y cliente
  let path = $derived(generatePath(nonce === null ? seed : `${seed}-${nonce}`));

  onMount(() => {
    if (randomOnMount) {
      nonce = Math.random();
    }
  });
</script>

<div
  class="pointer-events-none select-none overflow-hidden {className} mt-24 mb-16"
  aria-hidden="true"
>
  <svg
    viewBox="0 0 1200 40"
    width="100%"
    height="36"
    preserveAspectRatio="none"
    class="block h-6 w-full sm:h-7 lg:h-9"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} fill="#4F5F70" fill-opacity="0.09" />
  </svg>
</div>
