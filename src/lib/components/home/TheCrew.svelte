<script lang="ts">
  import { onMount } from "svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";

  interface CrewMember {
    name: string;
    role: string;
    country: string;
    href?: string;
  }

  const initialTeam: CrewMember[] = [
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

  let team = $state<CrewMember[]>(initialTeam);
  let selectedIndex = $state<number>(0);
  let hoveredIndex = $state<number | null>(null);
  let leaveTimeout: ReturnType<typeof setTimeout> | null = null;

  onMount(() => {
    // Randomize member order on each entry to symbolize that everyone holds equal weight
    const shuffled = [...initialTeam];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    team = shuffled;

    // Also select a random member initially from the shuffled roster
    selectedIndex = Math.floor(Math.random() * shuffled.length);
  });

  let activeIndex = $derived(hoveredIndex !== null ? hoveredIndex : selectedIndex);
  let activeMember = $derived(team[activeIndex]);
  let activeNumber = $derived(String(activeIndex + 1).padStart(2, "0") + " / 14");

  const onHover = (index: number) => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      leaveTimeout = null;
    }
    hoveredIndex = index;
  };

  const onLeave = () => {
    // 70ms buffer to prevent flickering while moving cursor between names
    leaveTimeout = setTimeout(() => {
      hoveredIndex = null;
    }, 70);
  };

  const onSelect = (index: number) => {
    selectedIndex = index;
    hoveredIndex = index;
  };

  const onKeydown = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(index);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % team.length;
      onSelect(next);
      const nextEl = document.getElementById(`crew-btn-${next}`);
      nextEl?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + team.length) % team.length;
      onSelect(prev);
      const prevEl = document.getElementById(`crew-btn-${prev}`);
      prevEl?.focus();
    }
  };
</script>

<section id="crew" class="px-5 py-20 sm:px-8 md:py-28 lg:px-10" aria-labelledby="crew-title">
  <div class="mx-auto max-w-[1440px]">
    <!-- Header: Dominant title + Secondary introduction -->
    <div class="mb-12 sm:mb-16">
      <h2
        id="crew-title"
        class="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-tight text-[#4f5f70]"
      >
        The crew.
      </h2>
      <p class="mt-4 text-base font-semibold leading-relaxed text-[#627383] sm:text-lg max-w-xl">
        As many countries as talents.
      </p>
    </div>

    <!-- Main Editorial Layout: Typographic Names Cloud (72%) + Hairline + Context Panel (28%) — NO CARDS -->
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_auto_340px] lg:gap-12 xl:grid-cols-[1fr_auto_380px] xl:gap-14">
      
      <!-- Typographic Names Cloud -->
      <div
        class="flex flex-wrap items-center gap-y-4 text-[clamp(1.75rem,2.8vw,2.4rem)] font-black leading-tight sm:gap-y-6 select-none"
        role="region"
        aria-label="Renhet Studio team members"
      >
        {#each team as member, i}
          {@const isCurrent = i === activeIndex}
          {@const isPinned = i === selectedIndex}

          <div class="inline-flex items-center">
            <button
              id={`crew-btn-${i}`}
              type="button"
              class="group relative cursor-pointer rounded-md px-2.5 py-0.5 text-left font-black transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f5f70]/50"
              style:background-color={isCurrent ? "rgba(79, 95, 112, 0.08)" : isPinned ? "rgba(79, 95, 112, 0.04)" : "transparent"}
              onmouseenter={() => onHover(i)}
              onmouseleave={onLeave}
              onfocus={() => onHover(i)}
              onblur={onLeave}
              onclick={() => onSelect(i)}
              onkeydown={(e) => onKeydown(e, i)}
              aria-pressed={isPinned}
              aria-label={`${member.name}, ${member.role}`}
            >
              <!-- Name text with smooth contrast adjustment -->
              <span
                class="relative z-10 text-[#4f5f70] transition-opacity duration-200"
                style:opacity={isCurrent || hoveredIndex === null ? "1" : "0.45"}
              >
                {member.name}
              </span>

              <!-- Sliding underline -->
              <span
                class="pointer-events-none absolute -bottom-0.5 left-2 right-2 h-[2px] origin-left bg-[#4f5f70] transition-transform duration-200 ease-out"
                style:transform={isCurrent || isPinned ? "scaleX(1)" : "scaleX(0)"}
                aria-hidden="true"
              ></span>
            </button>

            <!-- Subtle centered dot separator (never wraps separately from the name) -->
            {#if i < team.length - 1}
              <span
                class="mx-3 select-none text-xl font-bold text-[#718191]/40 sm:mx-4 sm:text-2xl"
                aria-hidden="true"
              >
                ·
              </span>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Vertical Hairline Divider (Desktop) -->
      <div class="hidden self-stretch bg-[#d6d5ca] lg:block lg:w-[1px] lg:min-h-[200px]" aria-hidden="true"></div>

      <!-- Contextual Panel (Desktop: 100% Card-free, pure editorial text directly on paper canvas) -->
      <aside
        class="hidden lg:flex relative min-h-[180px] w-full flex-col justify-start pt-1"
        aria-live="polite"
      >
        <div class="transition-opacity duration-200 ease-out">
          <h3 class="text-3xl font-black tracking-tight text-[#4f5f70] m-0">
            {activeMember.name}
          </h3>

          <p class="mt-2 text-base font-semibold leading-snug text-[#627383] m-0">
            {activeMember.role}
          </p>

          <div class="mt-3.5 flex items-center gap-1.5 text-sm font-semibold text-[#718191]">
            <svg class="h-4 w-4 shrink-0 text-[#718191]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 21c-4.418 0-8-5.373-8-12a8 8 0 1116 0c0 6.627-3.582 12-8 12zM12 11a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <span>{activeMember.country}</span>
          </div>

          {#if activeMember.href}
            <div class="mt-5">
              <a
                href={activeMember.href}
                target="_blank"
                rel="noreferrer"
                class="group inline-flex items-center gap-1.5 border-b border-[#4f5f70]/40 pb-0.5 text-xs font-bold uppercase tracking-wider text-[#4f5f70] transition-colors hover:border-[#4f5f70] hover:text-[#344253]"
                aria-label={`View ${activeMember.name}'s portfolio (opens in new tab)`}
              >
                <span>View portfolio</span>
                <IconExternal size={12} class="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          {/if}
        </div>
      </aside>
    </div>

    <!-- Contextual Info (Mobile & Tablet: 100% Card-free, pure editorial typography below hairline) -->
    <div
      class="mt-8 border-t border-[#d6d5ca] pt-6 lg:hidden min-h-[140px] flex flex-col justify-between"
      aria-live="polite"
    >
      <div>
        <div class="mb-1.5 flex items-center justify-between text-[11px] font-mono font-bold text-[#718191]">
          <span>{activeNumber}</span>
          <span class="font-sans font-bold uppercase tracking-wider text-[#718191]/80">Tap a name</span>
        </div>

        <h3 class="text-2xl font-black tracking-tight text-[#4f5f70] m-0">
          {activeMember.name}
        </h3>

        <p class="mt-1 text-sm font-semibold text-[#627383] m-0">
          {activeMember.role}
        </p>

        <div class="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#718191]">
          <svg class="h-3.5 w-3.5 text-[#718191] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21c-4.418 0-8-5.373-8-12a8 8 0 1116 0c0 6.627-3.582 12-8 12zM12 11a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <span>{activeMember.country}</span>
        </div>
      </div>

      {#if activeMember.href}
        <div class="mt-4">
          <a
            href={activeMember.href}
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1.5 border-b border-[#4f5f70]/40 pb-0.5 text-xs font-bold uppercase tracking-wider text-[#4f5f70] transition-colors hover:border-[#4f5f70] hover:text-[#344253]"
            aria-label={`View ${activeMember.name}'s portfolio`}
          >
            <span>View portfolio</span>
            <IconExternal size={11} class="opacity-80" />
          </a>
        </div>
      {/if}
    </div>

    <!-- Bottom Hairline & Micro-Guide (Desktop only; completely removed on mobile) -->
    <div class="hidden items-center gap-3 border-t border-[#d6d5ca] pt-5 mt-14 sm:mt-20 text-xs font-medium text-[#718191] md:flex">
      <svg class="h-4 w-4 shrink-0 stroke-[1.8] text-[#718191]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="3" width="12" height="18" rx="6" />
        <path d="M12 7v4" />
      </svg>
      <span>Hover to explore the team.</span>
    </div>
  </div>
</section>
