<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    class?: string;
    seed?: string | number;
    randomOnMount?: boolean;
    orientation?: "horizontal" | "vertical";
    color?: string;
    opacity?: number | string;
    style?: string;
  }

  let {
    class: className = "",
    seed = "default",
    randomOnMount = false,
    orientation = "horizontal",
    color = "#4F5F70",
    opacity,
    style: styleAttr = "",
  }: Props = $props();

  let nonce = $state<number | null>(null);

  let resolvedOpacity = $derived(
    opacity !== undefined ? opacity : orientation === "vertical" ? 0.12 : 0.09,
  );

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

  function generatePath(
    value: string | number,
    orientationMode: "horizontal" | "vertical",
  ) {
    const random = createRandom(value);

    const steps = [
      0, 25, 90, 160, 240, 340, 440, 540, 640, 740, 840, 940, 1040, 1120, 1175,
      1200,
    ];

    let drift = 0;

    const center = steps.map((coord) => {
      // Variación gradual, sin cambios bruscos
      drift = drift * 0.55 + (random() - 0.5) * 4;

      // Extremos estrechos y centro ligeramente más grueso
      const envelope = Math.sin((Math.PI * coord) / 1200);
      const thickness = envelope * (3.5 + random() * 2.8);

      const cross = 20 + drift;

      return { coord, cross, thickness };
    });

    if (orientationMode === "horizontal") {
      const top = center.map((p) => ({
        x: p.coord,
        y: p.cross - p.thickness,
      }));

      const bottom = center
        .map((p) => ({
          x: p.coord,
          y: p.cross + p.thickness,
        }))
        .reverse();

      return smoothCurve(top, true) + " " + smoothCurve(bottom) + " Z";
    } else {
      const left = center.map((p) => ({
        x: p.cross - p.thickness,
        y: p.coord,
      }));

      const right = center
        .map((p) => ({
          x: p.cross + p.thickness,
          y: p.coord,
        }))
        .reverse();

      return smoothCurve(left, true) + " " + smoothCurve(right) + " Z";
    }
  }

  // La primera renderización coincide en servidor y cliente
  let path = $derived(
    generatePath(nonce === null ? seed : `${seed}-${nonce}`, orientation),
  );

  onMount(() => {
    if (randomOnMount) {
      nonce = Math.random();
    }
  });
</script>

{#if orientation === "horizontal"}
  <div
    class="pointer-events-none select-none overflow-hidden {className} {!className || (!className.includes('mt-') && !className.includes('my-') && !className.includes('m-')) ? 'mt-24 mb-16' : ''}"
    style={styleAttr}
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
      <path d={path} fill={color} fill-opacity={resolvedOpacity} />
    </svg>
  </div>
{:else}
  <div
    class="pointer-events-none select-none overflow-hidden {className.includes('absolute') ? '' : 'relative self-stretch'} {className}"
    style={styleAttr}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 40 1200"
      preserveAspectRatio="none"
      class="absolute inset-0 h-full w-full"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} fill={color} fill-opacity={resolvedOpacity} />
    </svg>
  </div>
{/if}
