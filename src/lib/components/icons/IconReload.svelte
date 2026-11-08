<script lang="ts">
  let {
    size = 18,
    strokeWidth = 2.2,
    class: className = "",
  }: {
    size?: number;
    strokeWidth?: number;
    class?: string;
  } = $props();
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
  class="inline-block shrink-0 transition-transform duration-200 {className}"
  aria-hidden="true"
>
  <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
  <polyline points="21 3 21 8 16 8" />
</svg>

