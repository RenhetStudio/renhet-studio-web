<script lang="ts">
  let {
    direction = "right",
    size = 18,
    strokeWidth = 2.2,
    class: className = "",
  }: {
    direction?: "right" | "left" | "up" | "down" | "up-right";
    size?: number;
    strokeWidth?: number;
    class?: string;
  } = $props();

  const rotation = $derived(
    direction === "left"
      ? "rotate-180"
      : direction === "up"
        ? "-rotate-90"
        : direction === "down"
          ? "rotate-90"
          : direction === "up-right"
            ? "-rotate-45"
            : ""
  );
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="inline-block transition-transform duration-200 {rotation} {className}"
  aria-hidden="true"
>
  <path d="M5 12h14" />
  <path d="m12 5 7 7-7 7" />
</svg>
