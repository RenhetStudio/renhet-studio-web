<script lang="ts">
  let {
    class: className = "",
  }: {
    class?: string;
  } = $props();
</script>

<div
  class="pointer-events-none select-none {className}"
  aria-hidden="true"
>
  <svg
    viewBox="0 0 180 120"
    fill="currentColor"
    class="h-auto w-full text-[#8fb8d8]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Droplet 1 (left, tilted oval) -->
    <path
      d="M 50 42 C 55 37 61 40 65 46 C 69 52 69 59 64 64 C 59 69 52 67 48 62 C 44 57 45 47 50 42 Z"
    />
    <!-- Droplet 2 (center/right, elongated droplet) -->
    <path
      d="M 94 18 C 100 17 105 21 105 29 C 105 38 101 49 97 56 C 93 62 87 60 87 51 C 87 42 88 26 94 18 Z"
    />
    <!-- Fully organic star/splash body emerging from bottom with zero straight edges -->
    <path
      d="M 16 120 C 14 96 16 84 26 76 C 36 68 48 76 60 77 C 72 78 78 68 86 68 C 94 68 100 78 110 76 C 122 73 134 58 146 50 C 158 42 168 48 168 62 C 168 76 156 94 144 104 C 136 110 132 115 130 120 C 90 124 50 124 16 120 Z"
    />
  </svg>
</div>
