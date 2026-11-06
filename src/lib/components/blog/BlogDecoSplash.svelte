<script lang="ts">
  let {
    class: className = "",
  }: {
    class?: string;
  } = $props();
</script>

<div class="pointer-events-none select-none {className}" aria-hidden="true">
  <svg
    viewBox="0 0 220 220"
    fill="currentColor"
    class="h-full w-full text-[#cfe0eb]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Organic hand-drawn 5-lobed splash / starfish inspired by the Renhet identity mark -->
    <path
      d="M 108 72
         C 112 55 125 28 142 16
         C 156 6 172 12 178 28
         C 183 41 174 62 158 76
         C 152 82 146 86 148 94
         C 158 96 182 92 198 100
         C 214 108 218 126 208 140
         C 198 154 178 152 160 144
         C 148 138 140 142 136 150
         C 132 162 138 186 132 200
         C 126 214 108 218 96 210
         C 84 202 82 180 86 162
         C 88 152 82 144 74 142
         C 60 140 34 154 18 146
         C 4 138 2 120 12 108
         C 22 96 46 98 64 96
         C 76 94 82 86 82 78
         C 80 62 64 42 68 26
         C 72 12 90 8 102 18
         C 112 28 106 54 108 72 Z"
    />
  </svg>
</div>
