<script lang="ts">
  let {
    size = 14,
    strokeWidth = 2.4,
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
  <path d="m9 18 6-6-6-6" />
</svg>

