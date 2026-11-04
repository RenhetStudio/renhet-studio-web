<script lang="ts">
  import IconExternal from "$lib/components/icons/IconExternal.svelte";

  interface CrewMember {
    name: string;
    role: string;
    country: string;
    href?: string;
  }

  const team: CrewMember[] = [
    { name: "Miguel", role: "Founder, Producer & Programmer", country: "Spain", href: "https://www.bitemdev.com/" },
    { name: "Vaclav", role: "Publishing Advisor", country: "Czech Republic", href: "https://www.linkedin.com/in/vaclavkorycanek/" },
    { name: "Todd", role: "Narrative Designer", country: "USA", href: "https://nat20.mal.plus/technical-portfolio/" },
    { name: "Pablo", role: "QA & Gameplay Polish Specialist", country: "Spain", href: "https://www.pablogozalvez.com/" },
    { name: "Burakcan", role: "Game Designer", country: "Turkey", href: "https://www.artstation.com/george_akil" },
    { name: "Paulo", role: "Game Designer & Technical Artist", country: "Spain / Portugal", href: "https://view.genially.com/69788574df8490ea6fd02246" },
    { name: "Maurice", role: "UI/UX Designer", country: "USA", href: "https://www.linkedin.com/in/mauricebirchard/" },
    { name: "Daniël", role: "Music Composer", country: "The Netherlands", href: "https://daniel-otten.bandcamp.com/" },
    { name: "Denys", role: "Sound Designer", country: "Ukraine", href: "https://drive.google.com/drive/folders/1eBPnpS1N5JXDlTUpv92ci_UVk8KwPmSo" },
    { name: "Anton", role: "3D Artist", country: "Finland" },
    { name: "Naomi", role: "3D Animator", country: "Australia", href: "https://www.artstation.com/naoface" },
    { name: "Ole", role: "Concept Artist", country: "The Netherlands" },
    { name: "Freya", role: "Marketer & Writer", country: "UK", href: "https://www.linkedin.com/in/freya-clinton-06383134a/" },
    { name: "Luca", role: "Marketer", country: "Italy", href: "https://drive.google.com/file/d/1heCc9AVpGwAMI5p9Fi_N91vu-Nn-2FFq/view?usp=drivesdk" },
  ];
</script>

<section id="crew" class="px-5 py-24 sm:px-8 md:py-32 lg:px-10" aria-labelledby="crew-title">
  <div class="mx-auto max-w-[1440px]">
    <!-- Large Section Headline matching "Our first game is out now." -->
    <div class="mb-12 sm:mb-16">
      <h2
        id="crew-title"
        class="text-[clamp(2.6rem,6vw,6rem)] font-black leading-[0.92] tracking-normal text-[#4f5f70]"
      >
        The crew.
      </h2>
    </div>

    <!-- Clean Editorial Registry List -->
    <ul class="m-0 list-none border-t-2 border-[#d6d5ca] p-0">
      {#each team as member}
        <li class="border-b border-[#d6d5ca]">
          {#if member.href}
            <a
              href={member.href}
              target="_blank"
              rel="noreferrer"
              class="group grid grid-cols-1 items-center gap-2 py-4 px-2 transition-all duration-200 hover:bg-[#b8d4f0]/18 sm:grid-cols-[1.1fr_1.5fr_0.9fr] sm:gap-6 sm:py-5 sm:px-4"
            >
              <!-- Member Name -->
              <div class="flex items-center gap-2.5">
                <span class="text-xl font-black text-[#4f5f70] transition-colors duration-200 group-hover:text-[#344253] sm:text-2xl">
                  {member.name}
                </span>
                <span class="opacity-0 transition-opacity duration-200 group-hover:opacity-60">
                  <IconExternal size={13} class="text-[#4f5f70]" />
                </span>
              </div>

              <!-- Role -->
              <div class="text-sm font-bold text-[#627383] sm:text-base">
                {member.role}
              </div>

              <!-- Country -->
              <div class="text-xs font-bold text-[#718191] sm:text-sm sm:text-right">
                {member.country}
              </div>
            </a>
          {:else}
            <div
              class="grid grid-cols-1 items-center gap-2 py-4 px-2 sm:grid-cols-[1.1fr_1.5fr_0.9fr] sm:gap-6 sm:py-5 sm:px-4"
            >
              <!-- Member Name -->
              <div class="text-xl font-black text-[#4f5f70] sm:text-2xl">
                {member.name}
              </div>

              <!-- Role -->
              <div class="text-sm font-bold text-[#627383] sm:text-base">
                {member.role}
              </div>

              <!-- Country -->
              <div class="text-xs font-bold text-[#718191] sm:text-sm sm:text-right">
                {member.country}
              </div>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</section>
