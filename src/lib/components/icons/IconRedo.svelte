<script lang="ts">
  let {
    size = 16,
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
  class="inline-block {className}"
  aria-hidden="true"
>
  <path d="M21 7v6h-6" />
  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
</svg>

