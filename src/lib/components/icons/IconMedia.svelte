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
  class="inline-block {className}"
  aria-hidden="true"
>
  <rect x="3" y="3" width="18" height="18" rx="4" />
  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
  <polyline points="21 15 16 10 5 21" />
</svg>

