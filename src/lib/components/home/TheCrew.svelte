<script lang="ts">
  import { sound } from "$lib/audio/soundEffects";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconSparkle from "$lib/components/icons/IconSparkle.svelte";

  interface CrewMember {
    name: string;
    role: string;
    country: string;
    href?: string;
    rotation: number;
  }

  const team: CrewMember[] = [
    { name: "Miguel", role: "Founder, Producer & Programmer", country: "Spain", href: "https://www.bitemdev.com/", rotation: -0.7 },
    { name: "Vaclav", role: "Publishing Advisor", country: "Czech Republic", href: "https://www.linkedin.com/in/vaclavkorycanek/", rotation: 0.6 },
    { name: "Todd", role: "Narrative Designer", country: "USA", href: "https://nat20.mal.plus/technical-portfolio/", rotation: -0.5 },
    { name: "Pablo", role: "QA & Gameplay Polish Specialist", country: "Spain", href: "https://www.pablogozalvez.com/", rotation: 0.8 },
    { name: "Burakcan", role: "Game Designer", country: "Turkey", href: "https://www.artstation.com/george_akil", rotation: -0.6 },
    { name: "Paulo", role: "Game Designer & Technical Artist", country: "Spain / Portugal", href: "https://view.genially.com/69788574df8490ea6fd02246", rotation: 0.5 },
    { name: "Maurice", role: "UI/UX Designer", country: "USA", href: "https://www.linkedin.com/in/mauricebirchard/", rotation: -0.8 },
    { name: "Daniël", role: "Music Composer", country: "The Netherlands", href: "https://daniel-otten.bandcamp.com/", rotation: 0.4 },
    { name: "Denys", role: "Sound Designer", country: "Ukraine", href: "https://drive.google.com/drive/folders/1eBPnpS1N5JXDlTUpv92ci_UVk8KwPmSo", rotation: -0.5 },
    { name: "Anton", role: "3D Artist", country: "Finland", rotation: 0.7 },
    { name: "Naomi", role: "3D Animator", country: "Australia", href: "https://www.artstation.com/naoface", rotation: -0.65 },
    { name: "Ole", role: "Concept Artist", country: "The Netherlands", rotation: 0.55 },
    { name: "Freya", role: "Marketer & Writer", country: "UK", href: "https://www.linkedin.com/in/freya-clinton-06383134a/", rotation: -0.45 },
    { name: "Luca", role: "Marketer", country: "Italy", href: "https://drive.google.com/file/d/1heCc9AVpGwAMI5p9Fi_N91vu-Nn-2FFq/view?usp=drivesdk", rotation: 0.65 },
  ];
</script>

<section id="crew" class="relative px-5 py-20 sm:px-8 md:py-28 lg:px-12" aria-labelledby="crew-title">
  <div class="mx-auto max-w-6xl">
    <!-- Header -->
    <div class="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div class="inline-flex items-center gap-2 rounded-full border border-[#d6d5ca] bg-[#fffdf3] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#4f5f70]">
          <IconSparkle size={13} class="text-[#8fb8d8]" />
          <span>The Team</span>
        </div>
        <h2 id="crew-title" class="mt-3 text-3xl font-black tracking-tight text-[#344253] sm:text-4xl md:text-5xl">
          The crew.
        </h2>
      </div>

      <p class="max-w-md text-sm font-semibold text-[#627383] sm:text-base">
        Fourteen makers collaborating remotely across 11 countries to build detailed indie worlds.
      </p>
    </div>

    <!-- Craft Badge Board -->
    <div class="crew-board grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each team as member, i}
        {#if member.href}
          <a
            href={member.href}
            target="_blank"
            rel="noreferrer"
            class="crew-badge group relative flex flex-col justify-between rounded-2xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-5 shadow-sm transition-all duration-300 hover:border-[#8fb8d8] hover:bg-[#b8d4f0]/20 hover:shadow-md"
            style="--badge-rot: {member.rotation}deg;"
            onmouseenter={() => sound.playHover(480 + (i % 7) * 40)}
            onclick={() => sound.playPop(600)}
          >
            <div>
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-xl font-black text-[#344253] transition-colors group-hover:text-[#2d3a48]">
                  {member.name}
                </h3>
                <span class="text-[#8fb8d8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <IconExternal size={14} />
                </span>
              </div>
              <p class="mt-1 text-sm font-bold text-[#627383]">
                {member.role}
              </p>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-[#d6d5ca]/60 pt-3 text-xs font-bold text-[#718191]">
              <span class="rounded-md bg-[#f6f1e8] px-2 py-0.5 text-[11px] font-bold text-[#4f5f70]">
                {member.country}
              </span>
              <span class="text-[11px] text-[#8fb8d8] group-hover:underline">
                Portfolio
              </span>
            </div>
          </a>
        {:else}
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            class="crew-badge relative flex flex-col justify-between rounded-2xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-5 shadow-sm transition-all duration-300 hover:border-[#8fb8d8] hover:bg-[#b8d4f0]/15"
            style="--badge-rot: {member.rotation}deg;"
            onmouseenter={() => sound.playHover(480 + (i % 7) * 40)}
          >
            <div>
              <h3 class="text-xl font-black text-[#344253]">
                {member.name}
              </h3>
              <p class="mt-1 text-sm font-bold text-[#627383]">
                {member.role}
              </p>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-[#d6d5ca]/60 pt-3 text-xs font-bold text-[#718191]">
              <span class="rounded-md bg-[#f6f1e8] px-2 py-0.5 text-[11px] font-bold text-[#4f5f70]">
                {member.country}
              </span>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</section>

<style>
  .crew-badge {
    transform: rotate(var(--badge-rot, 0deg));
  }

  .crew-badge:hover {
    transform: rotate(0deg) translateY(-3px) scale(1.02);
  }

  @media (prefers-reduced-motion: reduce) {
    .crew-badge {
      transform: none !important;
    }
  }
</style>
