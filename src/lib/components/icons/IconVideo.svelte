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
  <rect x="2" y="4" width="14" height="16" rx="3" />
  <polygon points="16 10 22 6 22 18 16 14" />
</svg>

