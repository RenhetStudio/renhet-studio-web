<script lang="ts">
  let {
    muted = false,
    size = 18,
    strokeWidth = 2,
    class: className = "",
  }: {
    muted?: boolean;
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
  class="inline-block transition-transform duration-200 {className}"
  aria-hidden="true"
>
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
  {#if muted}
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  {:else}
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  {/if}
</svg>
