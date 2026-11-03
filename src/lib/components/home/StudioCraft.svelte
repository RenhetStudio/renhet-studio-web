<script lang="ts">
  import { sound } from "$lib/audio/soundEffects";
  import IconSparkle from "$lib/components/icons/IconSparkle.svelte";
</script>

<section id="craft" class="relative px-5 py-16 sm:px-8 md:py-24 lg:px-12" aria-labelledby="craft-title">
  <div class="mx-auto max-w-6xl">
    <div class="grid items-center gap-8 rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-8 md:grid-cols-[1.3fr_0.7fr] md:p-12 lg:gap-14">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-[#d6d5ca] bg-[#f6f1e8] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4f5f70]">
          <IconSparkle size={13} class="text-[#8fb8d8]" />
          <span>Our Approach</span>
        </div>

        <h2 id="craft-title" class="mt-4 text-3xl font-black tracking-tight text-[#344253] sm:text-4xl">
          Warm, handmade things.
        </h2>

        <p class="mt-4 text-base font-semibold leading-relaxed text-[#627383] sm:text-lg">
          We are a distributed collective of artists, designers, and programmers building games that feel tactile and personal. No rushed templates or corporate layers—just small, passionate teams focused on original art, responsive mechanics, and cozy worlds.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <span class="rounded-full bg-[#f6f1e8] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#4f5f70]">
            Hand-Drawn &bull; 2D/3D
          </span>
          <span class="rounded-full bg-[#f6f1e8] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#4f5f70]">
            Original Soundtracks
          </span>
          <span class="rounded-full bg-[#f6f1e8] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#4f5f70]">
            Worldwide Remote Team
          </span>
        </div>
      </div>

      <!-- Tactile Studio Stamp (Handcrafted accent) -->
      <div class="flex justify-center md:justify-end">
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="badge-stamp relative flex h-48 w-48 rotate-[-1.5deg] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#8fb8d8] bg-[#f6f1e8] p-4 text-center shadow-sm transition-transform duration-300 hover:rotate-0 hover:scale-105"
          onmouseenter={() => sound.playHover(480)}
        >
          <img
            src="/renhet-symbol-dark.png"
            alt="Renhet Studio Mark"
            width="56"
            height="56"
            class="h-14 w-14 object-contain opacity-80"
          />
          <span class="mt-3 text-xs font-black tracking-widest text-[#344253] uppercase">Renhet Studio</span>
          <span class="text-[11px] font-bold text-[#718191]">Est. Worldwide</span>
        </div>
      </div>
    </div>
  </div>
</section>
