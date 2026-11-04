<script lang="ts">
  let { country = "es", class: className = "" }: { country?: string; class?: string } = $props();
</script>

<span
  class="country-flag-badge inline-flex shrink-0 items-center overflow-hidden rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.2)] ring-1 ring-white/20 {className}"
  title={country.toUpperCase()}
  aria-label={`Flag of ${country.toUpperCase()}`}
>
  {#if country === "es"}
    <!-- Spain -->
    <svg viewBox="0 0 750 500" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="750" height="500" fill="#c60b1e" />
      <rect y="125" width="750" height="250" fill="#ffc400" />
    </svg>
  {:else if country === "cz"}
    <!-- Czech Republic -->
    <svg viewBox="0 0 900 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#d7141a" />
      <rect width="900" height="300" fill="#ffffff" />
      <polygon points="0,0 450,300 0,600" fill="#11457e" />
    </svg>
  {:else if country === "us"}
    <!-- USA -->
    <svg viewBox="0 0 741 390" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="741" height="390" fill="#b22234" />
      <path d="M0,30H741M0,90H741M0,150H741M0,210H741M0,270H741M0,330H741" stroke="#ffffff" stroke-width="30" />
      <rect width="296" height="210" fill="#3c3b6e" />
    </svg>
  {:else if country === "tr"}
    <!-- Turkey -->
    <svg viewBox="0 0 1200 800" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="800" fill="#e30a17" />
      <circle cx="480" cy="400" r="200" fill="#ffffff" />
      <circle cx="530" cy="400" r="160" fill="#e30a17" />
      <polygon points="730,400 650,370 680,450 630,410 710,430" fill="#ffffff" />
    </svg>
  {:else if country === "pt"}
    <!-- Portugal -->
    <svg viewBox="0 0 600 400" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#da291c" />
      <rect width="240" height="400" fill="#046a38" />
      <circle cx="240" cy="200" r="50" fill="#ffc400" />
      <circle cx="240" cy="200" r="32" fill="#ffffff" />
    </svg>
  {:else if country === "nl"}
    <!-- Netherlands -->
    <svg viewBox="0 0 900 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#ae1c28" />
      <rect y="200" width="900" height="200" fill="#ffffff" />
      <rect y="400" width="900" height="200" fill="#21468b" />
    </svg>
  {:else if country === "ua"}
    <!-- Ukraine -->
    <svg viewBox="0 0 900 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="300" fill="#0057b7" />
      <rect y="300" width="900" height="300" fill="#ffd700" />
    </svg>
  {:else if country === "fi"}
    <!-- Finland -->
    <svg viewBox="0 0 900 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="600" fill="#ffffff" />
      <rect x="250" width="150" height="600" fill="#002f6c" />
      <rect y="225" width="900" height="150" fill="#002f6c" />
    </svg>
  {:else if country === "au"}
    <!-- Australia -->
    <svg viewBox="0 0 1200 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="600" fill="#00008b" />
      <rect width="600" height="300" fill="#012169" />
      <path d="M0,0 L600,300 M600,0 L0,300" stroke="#ffffff" stroke-width="60" />
      <path d="M0,0 L600,300 M600,0 L0,300" stroke="#c8102e" stroke-width="40" />
      <path d="M300,0 V300 M0,150 H600" stroke="#ffffff" stroke-width="100" />
      <path d="M300,0 V300 M0,150 H600" stroke="#c8102e" stroke-width="60" />
      <circle cx="300" cy="450" r="45" fill="#ffffff" />
      <circle cx="900" cy="450" r="30" fill="#ffffff" />
      <circle cx="800" cy="250" r="25" fill="#ffffff" />
      <circle cx="950" cy="180" r="25" fill="#ffffff" />
      <circle cx="1050" cy="270" r="25" fill="#ffffff" />
    </svg>
  {:else if country === "gb"}
    <!-- UK -->
    <svg viewBox="0 0 1200 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="600" fill="#012169" />
      <path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#ffffff" stroke-width="120" />
      <path d="M0,0 L1200,600 M1200,0 L0,600" stroke="#c8102e" stroke-width="80" />
      <path d="M600,0 V600 M0,300 H1200" stroke="#ffffff" stroke-width="200" />
      <path d="M600,0 V600 M0,300 H1200" stroke="#c8102e" stroke-width="120" />
    </svg>
  {:else if country === "it"}
    <!-- Italy -->
    <svg viewBox="0 0 900 600" class="h-2.5 w-3.5 object-cover" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="600" fill="#009246" />
      <rect x="300" width="300" height="600" fill="#ffffff" />
      <rect x="600" width="300" height="600" fill="#ce2b37" />
    </svg>
  {:else}
    <!-- Generic Fallback -->
    <span class="inline-block h-2.5 w-3.5 bg-white/30"></span>
  {/if}
</span>

