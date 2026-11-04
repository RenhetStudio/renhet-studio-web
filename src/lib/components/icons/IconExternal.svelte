<script lang="ts">
  let {
    size = 14,
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
  fill="currentColor"
  class="inline-block {className}"
  aria-hidden="true"
>
  <!-- Tactile filled external link: bold solid arrow + solid rounded tray -->
  <path
    d="M13.5 3a1.5 1.5 0 0 0 0 3H16l-7.29 7.29a1.5 1.5 0 1 0 2.12 2.12L18 8.12V10.5a1.5 1.5 0 0 0 3 0V4.5A1.5 1.5 0 0 0 19.5 3h-6Z"
  />
  <path
    d="M5 6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-4.5a1.5 1.5 0 0 0-3 0v4a0.5 0.5 0 0 1-0.5 0.5H5.5a0.5 0.5 0 0 1-0.5-0.5V9.5a0.5 0.5 0 0 1 0.5-0.5h4a1.5 1.5 0 0 0 0-3H5Z"
  />
</svg>
