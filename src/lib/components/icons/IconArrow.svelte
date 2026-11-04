<script lang="ts">
  let {
    direction = "right",
    size = 18,
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
  fill="currentColor"
  class="inline-block transition-transform duration-200 {rotation} {className}"
  aria-hidden="true"
>
  <!-- Tactile chunky filled arrow with rounded joints -->
  <path
    d="M13.09 3.22a1.5 1.5 0 0 1 2.12 0l7 7a1.5 1.5 0 0 1 0 2.12l-7 7a1.5 1.5 0 0 1-2.12-2.12L17.38 13.5H4a1.5 1.5 0 0 1 0-3h13.38l-4.29-4.16a1.5 1.5 0 0 1 0-2.12Z"
  />
</svg>
