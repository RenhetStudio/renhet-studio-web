<script lang="ts">
  let {
    size = 18,
    class: className = "",
  }: {
    size?: number;
    class?: string;
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="currentColor"
  class="inline-block transition-transform duration-200 {className}"
  aria-hidden="true"
>
  <!-- Tactile chunky upward arrow with rounded joints -->
  <path
    d="M3.22 10.91a1.5 1.5 0 0 1 0-2.12l7-7a1.5 1.5 0 0 1 2.12 0l7 7a1.5 1.5 0 0 1-2.12 2.12L13.5 6.62V20a1.5 1.5 0 0 1-3 0V6.62L6.34 10.91a1.5 1.5 0 0 1-2.12 0Z"
  />
</svg>

