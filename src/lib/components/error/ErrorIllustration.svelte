<script lang="ts">
  let {
    variant = "not-found",
    code = 404,
    class: className = "",
  }: {
    variant?: "not-found" | "server-error";
    code?: number | string;
    class?: string;
  } = $props();

  // Artisan splash silhouette faithfully traced from Renhet Studio symbol
  const symbolPath =
    "M 184 25 C 186.2 27.8, 192.2 34.7, 196 43 C 199.8 51.3, 204.3 68.7, 207 75 C 209.7 81.3, 211.5 78.2, 212 81 C 212.5 83.8, 207.7 84.7, 210 92 C 212.3 99.3, 222.2 115.2, 226 125 C 229.8 134.8, 230.7 146.7, 233 151 C 235.3 155.3, 237.2 154.5, 240 151 C 242.8 147.5, 245.3 136.7, 250 130 C 254.7 123.3, 260.8 116.5, 268 111 C 275.2 105.5, 286.8 103.0, 293 97 C 299.2 91.0, 301.2 79.5, 305 75 C 308.8 70.5, 313.7 71.8, 316 70 C 318.3 68.2, 317.3 64.8, 319 64 C 320.7 63.2, 323.0 66.5, 326 65 C 329.0 63.5, 335.0 57.5, 337 55 C 339.0 52.5, 336.7 51.0, 338 50 C 339.3 49.0, 342.5 48.0, 345 49 C 347.5 50.0, 353.2 51.3, 353 56 C 352.8 60.7, 344.8 72.2, 344 77 C 343.2 81.8, 348.3 82.2, 348 85 C 347.7 87.8, 342.8 91.2, 342 94 C 341.2 96.8, 345.5 97.3, 343 102 C 340.5 106.7, 330.0 114.0, 327 122 C 324.0 130.0, 326.5 143.8, 325 150 C 323.5 156.2, 319.7 155.3, 318 159 C 316.3 162.7, 317.5 167.8, 315 172 C 312.5 176.2, 304.8 180.0, 303 184 C 301.2 188.0, 298.5 194.5, 304 196 C 309.5 197.5, 329.8 194.2, 336 193 C 342.2 191.8, 334.3 190.5, 341 189 C 347.7 187.5, 367.8 184.2, 376 184 C 384.2 183.8, 384.3 187.7, 390 188 C 395.7 188.3, 402.3 185.7, 410 186 C 417.7 186.3, 429.7 187.7, 436 190 C 442.3 192.3, 446.7 197.3, 448 200 C 449.3 202.7, 446.5 205.3, 444 206 C 441.5 206.7, 438.0 203.2, 433 204 C 428.0 204.8, 419.0 208.5, 414 211 C 409.0 213.5, 405.5 217.8, 403 219 C 400.5 220.2, 401.2 216.5, 399 218 C 396.8 219.5, 393.7 225.7, 390 228 C 386.3 230.3, 380.0 230.5, 377 232 C 374.0 233.5, 373.8 236.3, 372 237 C 370.2 237.7, 374.0 232.2, 366 236 C 358.0 239.8, 330.8 255.2, 324 260 C 317.2 264.8, 323.7 263.5, 325 265 C 326.3 266.5, 325.3 261.7, 332 269 C 338.7 276.3, 353.2 298.5, 365 309 C 376.8 319.5, 395.2 326.2, 403 332 C 410.8 337.8, 410.7 340.2, 412 344 C 413.3 347.8, 412.8 352.8, 411 355 C 409.2 357.2, 404.7 357.2, 401 357 C 397.3 356.8, 397.2 358.8, 389 354 C 380.8 349.2, 361.2 333.5, 352 328 C 342.8 322.5, 342.2 323.3, 334 321 C 325.8 318.7, 309.3 316.0, 303 314 C 296.7 312.0, 298.5 310.0, 296 309 C 293.5 308.0, 290.2 307.3, 288 308 C 285.8 308.7, 282.8 305.3, 283 313 C 283.2 320.7, 288.2 342.0, 289 354 C 289.8 366.0, 289.2 378.2, 288 385 C 286.8 391.8, 282.5 392.8, 282 395 C 281.5 397.2, 284.8 392.2, 285 398 C 285.2 403.8, 284.7 422.8, 283 430 C 281.3 437.2, 277.7 439.8, 275 441 C 272.3 442.2, 270.5 445.0, 267 437 C 263.5 429.0, 261.7 408.3, 254 393 C 246.3 377.7, 226.7 358.2, 221 345 C 215.3 331.8, 221.7 318.2, 220 314 C 218.3 309.8, 213.2 316.2, 211 320 C 208.8 323.8, 209.7 332.7, 207 337 C 204.3 341.3, 197.8 343.0, 195 346 C 192.2 349.0, 194.5 351.7, 190 355 C 185.5 358.3, 175.0 359.3, 168 366 C 161.0 372.7, 155.3 387.2, 148 395 C 140.7 402.8, 130.3 409.3, 124 413 C 117.7 416.7, 113.3 418.2, 110 417 C 106.7 415.8, 104.2 408.5, 104 406 C 103.8 403.5, 108.5 404.2, 109 402 C 109.5 399.8, 106.2 399.2, 107 393 C 107.8 386.8, 110.2 373.0, 114 365 C 117.8 357.0, 127.3 352.5, 130 345 C 132.7 337.5, 128.7 327.7, 130 320 C 131.3 312.3, 135.0 305.3, 138 299 C 141.0 292.7, 144.7 286.2, 148 282 C 151.3 277.8, 161.5 273.8, 158 274 C 154.5 274.2, 134.8 281.5, 127 283 C 119.2 284.5, 117.7 284.5, 111 283 C 104.3 281.5, 91.7 274.8, 87 274 C 82.3 273.2, 85.2 277.7, 83 278 C 80.8 278.3, 77.7 275.8, 74 276 C 70.3 276.2, 70.0 279.2, 61 279 C 52.0 278.8, 26.7 277.0, 20 275 C 13.3 273.0, 19.8 269.3, 21 267 C 22.2 264.7, 23.8 262.7, 27 261 C 30.2 259.3, 35.7 259.2, 40 257 C 44.3 254.8, 49.8 249.5, 53 248 C 56.2 246.5, 56.8 249.5, 59 248 C 61.2 246.5, 63.0 241.0, 66 239 C 69.0 237.0, 74.0 237.5, 77 236 C 80.0 234.5, 81.2 231.0, 84 230 C 86.8 229.0, 88.5 231.7, 94 230 C 99.5 228.3, 111.2 221.8, 117 220 C 122.8 218.2, 134.0 229.2, 129 219 C 124.0 208.8, 99.5 173.2, 87 159 C 74.5 144.8, 61.0 140.3, 54 134 C 47.0 127.7, 46.2 124.8, 45 121 C 43.8 117.2, 45.5 113.0, 47 111 C 48.5 109.0, 50.3 108.7, 54 109 C 57.7 109.3, 60.3 108.0, 69 113 C 77.7 118.0, 87.3 130.7, 106 139 C 124.7 147.3, 170.0 163.7, 181 163 C 192.0 162.3, 173.2 141.8, 172 135 C 170.8 128.2, 174.7 127.5, 174 122 C 173.3 116.5, 168.5 106.8, 168 102 C 167.5 97.2, 170.8 96.2, 171 93 C 171.2 89.8, 168.3 86.5, 169 83 C 169.7 79.5, 174.2 79.7, 175 72 C 175.8 64.3, 172.7 44.7, 174 37 C 175.3 29.3, 181.3 28.0, 183 26 C 184.7 24.0, 181.8 22.2, 184 25 Z";

  // Angular zigzag fracture clipping paths for 5xx
  const clipLeft =
    "M -50 -50 L 238 -50 L 232 100 L 254 180 L 228 260 L 254 350 L 232 520 L -50 520 Z";
  const clipRight =
    "M 520 -50 L 250 -50 L 244 100 L 266 180 L 240 260 L 266 350 L 244 520 L 520 520 Z";

  const codeDisplay = $derived(String(code).endsWith(".") ? String(code) : `${code}.`);
</script>

<div class="relative mx-auto flex w-full max-w-[540px] items-center justify-center select-none {className}">
  <!-- Layer 1: Dashed outline behind (404 only, shifted right) -->
  {#if variant === "not-found"}
    <div class="pointer-events-none absolute -top-8 sm:-top-12 md:-top-14 left-1/2 -translate-x-[22%] z-0 w-[140px] sm:w-[175px] md:w-[195px] h-[140px] sm:h-[175px] md:h-[195px] anim-dashed">
      <svg
        viewBox="0 0 475 475"
        class="h-full w-full rotate-4 overflow-visible"
        aria-hidden="true"
      >
        <path
          d={symbolPath}
          fill="none"
          stroke="#8FB8D8"
          stroke-width="8"
          stroke-dasharray="16 14"
          opacity="0.65"
        />
      </svg>
    </div>
  {/if}

  <!-- Layer 2: Main Error Number rendered in Paperlogy-9Black (100% brand typography match) -->
  <div
    class="relative z-10 text-[clamp(6rem,19vw,9.8rem)] font-black leading-none tracking-[-0.04em] text-[#4f5f70] anim-number select-none"
  >
    {codeDisplay}
  </div>

  <!-- Layer 3: Solid / Split Artisan Splash in front, overlapping the top edge -->
  {#if variant === "not-found"}
    <!-- 404: Solid blue splash + 3 accents, shifted top-left -->
    <div class="pointer-events-none absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-[74%] z-20 w-[160px] sm:w-[200px] md:w-[230px] h-[160px] sm:h-[200px] md:h-[230px] anim-solid">
      <svg
        viewBox="0 0 260 260"
        class="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <!-- Scaled splash shape -->
        <g transform="translate(40, 20) scale(0.42)">
          <path d={symbolPath} fill="#8FB8D8" />
        </g>
        <!-- 3 Accent lines at top-left -->
        <g stroke="#8FB8D8" stroke-width="5" stroke-linecap="round" class="anim-accents">
          <line x1="32" y1="56" x2="16" y2="42" />
          <line x1="52" y1="38" x2="42" y2="18" />
          <line x1="78" y1="28" x2="78" y2="6" />
        </g>
      </svg>
    </div>
  {:else}
    <!-- 500: Parted blue splash with jagged crack + 2 accents -->
    <div class="pointer-events-none absolute -top-10 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 z-20 w-[160px] sm:w-[200px] md:w-[230px] h-[160px] sm:h-[200px] md:h-[230px]">
      <svg
        viewBox="0 0 260 260"
        class="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="crack-left">
            <path d={clipLeft} />
          </clipPath>
          <clipPath id="crack-right">
            <path d={clipRight} />
          </clipPath>
        </defs>

        <!-- Left half with jagged edge -->
        <g class="anim-split-left">
          <g transform="translate(30, 20) scale(0.42)">
            <g transform="translate(-7, -4) rotate(-1 240 240)" clip-path="url(#crack-left)">
              <path d={symbolPath} fill="#8FB8D8" />
            </g>
          </g>
        </g>

        <!-- Right half with jagged edge -->
        <g class="anim-split-right">
          <g transform="translate(30, 20) scale(0.42)">
            <g transform="translate(7, 4) rotate(1 240 240)" clip-path="url(#crack-right)">
              <path d={symbolPath} fill="#8FB8D8" />
            </g>
          </g>
        </g>

        <!-- 2 Accent lines at top-right -->
        <g stroke="#8FB8D8" stroke-width="5" stroke-linecap="round" class="anim-accents">
          <line x1="205" y1="44" x2="225" y2="30" />
          <line x1="228" y1="62" x2="248" y2="50" />
        </g>
      </svg>
    </div>
  {/if}
</div>

<style>
  @keyframes errorFadeIn {
    0% {
      opacity: 0;
      transform: translateY(6px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes errorSlideDown {
    0% {
      opacity: 0;
      transform: translateY(-12px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes errorDashedIn {
    0% {
      opacity: 0;
      transform: translate(6px, -8px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  @keyframes errorSplitLeft {
    0% {
      opacity: 0;
      transform: translate(-10px, -6px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  @keyframes errorSplitRight {
    0% {
      opacity: 0;
      transform: translate(10px, 6px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  @keyframes errorAccentsIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .anim-number {
    animation: errorFadeIn 380ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .anim-solid {
    animation: errorSlideDown 520ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
  }

  .anim-dashed {
    animation: errorDashedIn 520ms cubic-bezier(0.16, 1, 0.3, 1) 240ms both;
  }

  .anim-split-left {
    animation: errorSplitLeft 540ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
  }

  .anim-split-right {
    animation: errorSplitRight 540ms cubic-bezier(0.16, 1, 0.3, 1) 120ms both;
  }

  .anim-accents {
    animation: errorAccentsIn 420ms cubic-bezier(0.16, 1, 0.3, 1) 280ms both;
  }

  @media (prefers-reduced-motion: reduce) {
    .anim-number,
    .anim-solid,
    .anim-dashed,
    .anim-split-left,
    .anim-split-right,
    .anim-accents {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
</style>
