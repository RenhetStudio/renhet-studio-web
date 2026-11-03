<script lang="ts">
  let {
    size = 20,
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
  class="inline-block {className}"
  aria-hidden="true"
>
  <path
    d="M3.5 4h17a1.5 1.5 0 0 1 1.5 1.5v2.8a2.5 2.5 0 0 1-1.3 2.2 2.5 2.5 0 0 1-2.4-.2 2.5 2.5 0 0 1-3.6.5 2.5 2.5 0 0 1-2.7 0 2.5 2.5 0 0 1-3.6-.5 2.5 2.5 0 0 1-2.4.2A2.5 2.5 0 0 1 2 8.3V5.5A1.5 1.5 0 0 1 3.5 4Zm-.5 8.2a4 4 0 0 0 3 1.2c1.2 0 2.3-.5 3-1.4.7.9 1.8 1.4 3 1.4s2.3-.5 3-1.4a4 4 0 0 0 3 1.4 4 4 0 0 0 3-1.2V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.8ZM8 15h2v2H8zm6 0h2v2h-2z"
  />
</svg>
