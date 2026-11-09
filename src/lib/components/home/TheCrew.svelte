<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";
  import CountryFlag from "$lib/components/home/CountryFlag.svelte";

  interface CrewMember {
    name: string;
    role: string;
    country: string;
    href?: string;
  }

  const COUNTRY_CODES: Record<string, string[]> = {
    Spain: ["es"],
    "Czech Republic": ["cz"],
    "Spain / Portugal": ["es", "pt"],
    USA: ["us"],
    "The Netherlands": ["nl"],
    Ukraine: ["ua"],
    Finland: ["fi"],
    Australia: ["au"],
    England: ["england"],
    Italy: ["it"],
  };

  function getCountryCodes(country: string): string[] {
    return COUNTRY_CODES[country] ?? [];
  }

  const initialTeam: CrewMember[] = [
    {
      name: "Miguel",
      role: "Founder, Producer & Programmer",
      country: "Spain",
      href: "https://www.bitemdev.com/",
    },
    {
      name: "Vaclav",
      role: "Publishing Advisor",
      country: "Czech Republic",
      href: "https://www.linkedin.com/in/vaclavkorycanek/",
    },
    {
      name: "Pablo",
      role: "QA & Gameplay Polish Specialist",
      country: "Spain",
      href: "https://www.pablogozalvez.com/",
    },
    {
      name: "Paulo",
      role: "Game Designer & Technical Artist",
      country: "Spain / Portugal",
      href: "https://view.genially.com/69788574df8490ea6fd02246",
    },
    {
      name: "Maurice",
      role: "UI/UX Designer",
      country: "USA",
      href: "https://www.linkedin.com/in/mauricebirchard/",
    },
    {
      name: "Daniël",
      role: "Music Composer",
      country: "The Netherlands",
      href: "https://daniel-otten.bandcamp.com/",
    },
    {
      name: "Denys",
      role: "Sound Designer",
      country: "Ukraine",
      href: "https://drive.google.com/drive/folders/1eBPnpS1N5JXDlTUpv92ci_UVk8KwPmSo",
    },
    { name: "Anton", role: "3D Artist", country: "Finland" },
    {
      name: "Naomi",
      role: "3D Animator",
      country: "Australia",
      href: "https://www.artstation.com/naoface",
    },
    { name: "Ole", role: "Concept Artist", country: "The Netherlands" },
    {
      name: "Freya",
      role: "Marketer & Writer",
      country: "England",
      href: "https://www.linkedin.com/in/freya-clinton-06383134a/",
    },
    {
      name: "Luca",
      role: "Marketer",
      country: "Italy",
      href: "https://drive.google.com/file/d/1heCc9AVpGwAMI5p9Fi_N91vu-Nn-2FFq/view?usp=drivesdk",
    },
  ];

  let team = $state<CrewMember[]>(initialTeam);
  let selectedIndex = $state<number>(0);
  let hoveredIndex = $state<number | null>(null);
  let leaveTimeout: ReturnType<typeof setTimeout> | null = null;

  let isPrepared = $state(false);
  let isVisible = $state(false);
  let sectionEl = $state<HTMLElement | null>(null);

  let shouldAnimate = $derived(isPrepared && isVisible);

  onMount(() => {
    // 1. Randomize member order to symbolize that everyone holds equal weight
    const shuffled = [...initialTeam];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    team = shuffled;

    // 2. Select a random member initially from the shuffled roster
    selectedIndex = Math.floor(Math.random() * shuffled.length);

    // 3. Mark as prepared only after fonts are ready (or fast fallback) and the next frame paints the shuffled roster
    const fontReadyPromise =
      typeof document !== "undefined" && document.fonts?.ready
        ? document.fonts.ready
        : Promise.resolve();

    Promise.race([
      fontReadyPromise,
      new Promise((resolve) => setTimeout(resolve, 250)),
    ]).then(() => {
      requestAnimationFrame(() => {
        isPrepared = true;
      });
    });

    // 4. Viewport entrance detection: reveal once intersecting
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          isVisible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  });

  let activeIndex = $derived(
    hoveredIndex !== null ? hoveredIndex : selectedIndex,
  );
  let activeMember = $derived(team[activeIndex]);

  const onHover = (index: number) => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
      leaveTimeout = null;
    }
    hoveredIndex = index;
  };

  const onLeave = () => {
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

<section
  id="crew"
  bind:this={sectionEl}
  class="px-5 pt-14 pb-0 sm:px-8 sm:pt-16 sm:pb-0 md:pt-20 md:pb-0 lg:px-10"
  aria-labelledby="crew-title"
>
  <div class="mx-auto max-w-[1440px]">
    <!-- Header: Dominant title -->
    <div class="mb-8 sm:mb-10">
      <h2
        id="crew-title"
        class="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-tight text-[#4f5f70]"
      >
        The crew.
      </h2>
    </div>

    <!-- Main Editorial Layout: Typographic Names Cloud (72%) + Hairline + Context Panel (28%) — NO CARDS -->
    <div
      class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_auto_340px] lg:gap-12 xl:grid-cols-[1fr_auto_380px] xl:gap-14"
    >
      <!-- Typographic Names Cloud: content-start ensures compact, natural line spacing without stretching -->
      <div
        class="flex flex-wrap content-start items-center gap-y-3 sm:gap-y-3.5 lg:gap-y-4 text-[clamp(1.75rem,2.8vw,2.4rem)] font-black leading-tight select-none min-h-0 lg:min-h-[240px]"
        role="region"
        aria-label="Renhet Studio team members"
      >
        {#each team as member, i (member.name)}
          {@const isCurrent = i === activeIndex}
          {@const isPinned = i === selectedIndex}

          <div
            class="crew-member-item inline-flex items-center"
            style={shouldAnimate
              ? `opacity: 1; transform: translate3d(0, 0, 0); transition-delay: ${i * 45}ms;`
              : "opacity: 0; transform: translate3d(0, 16px, 0); pointer-events: none;"}
          >
            <button
              id={`crew-btn-${i}`}
              type="button"
              class="group relative cursor-pointer rounded-md px-2.5 py-0.5 text-left font-black transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f5f70]/50"
              style:background-color={isCurrent
                ? "rgba(79, 95, 112, 0.08)"
                : isPinned
                  ? "rgba(79, 95, 112, 0.04)"
                  : "transparent"}
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
                style:opacity={isCurrent || hoveredIndex === null
                  ? "1"
                  : "0.45"}
              >
                {member.name}
              </span>

              <!-- Sliding underline -->
              <span
                class="pointer-events-none absolute -bottom-0.5 left-2 right-2 h-[2px] origin-left bg-[#4f5f70] transition-transform duration-200 ease-out"
                style:transform={isCurrent || isPinned
                  ? "scaleX(1)"
                  : "scaleX(0)"}
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

      <!-- Organic Vertical Divider (Desktop) -->
      <OrganicDivider
        orientation="vertical"
        seed="crew-vertical"
        randomOnMount
        class="hidden lg:block self-stretch w-2.5 transition-opacity duration-500 ease-out"
        style={shouldAnimate
          ? "opacity: 1; transition-delay: 150ms;"
          : "opacity: 0;"}
      />

      <!-- Contextual Panel (Desktop: 100% Card-free, vertically centered beside names cloud) -->
      <aside
        class="hidden lg:flex relative self-stretch w-full flex-col justify-center transition-opacity duration-500 ease-out"
        style={shouldAnimate
          ? "opacity: 1; transition-delay: 200ms;"
          : "opacity: 0;"}
        aria-live="polite"
      >
        <div class="crew-detail-grid w-full">
          {#key activeMember.name}
            <div
              in:fade={{ duration: 150, delay: 50 }}
              out:fade={{ duration: 90 }}
              class="crew-detail-content flex flex-col items-start w-full"
            >
              <!-- Name + Slash + Country Flag & Label -->
              <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <h3
                  class="text-[clamp(1.75rem,2.2vw,2.3rem)] font-black leading-none tracking-tight text-[#4f5f70] m-0"
                >
                  {activeMember.name}
                </h3>
                <span
                  class="text-base font-bold text-[#8a98a5]/50 select-none"
                  aria-hidden="true"
                >
                  /
                </span>
                <span
                  class="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#718191]"
                >
                  {#each getCountryCodes(activeMember.country) as code}
                    <CountryFlag country={code} class="h-2.5 w-3.5" />
                  {/each}
                  <span>{activeMember.country}</span>
                </span>
              </div>

              <!-- Role Description (Reserved height prevents CLS across 1 vs 2 line titles) -->
              <p
                class="mt-2 min-h-[44px] text-[15px] sm:text-base font-semibold leading-snug text-[#627383] m-0"
              >
                {activeMember.role}
              </p>

              <!-- Discreet Portfolio Text Link (Reserved height to prevent layout shift) -->
              <div class="mt-3.5 min-h-[26px] flex items-center">
                {#if activeMember.href}
                  <a
                    href={activeMember.href}
                    target="_blank"
                    rel="noreferrer"
                    class="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#4f5f70] underline underline-offset-4 decoration-[#8fb8d8] transition-colors hover:text-[#344253] hover:decoration-[#4f5f70]"
                    aria-label={`View ${activeMember.name}'s portfolio (opens in new tab)`}
                  >
                    <span>View portfolio</span>
                    <IconArrow size={11} direction="up-right" />
                  </a>
                {/if}
              </div>
            </div>
          {/key}
        </div>
      </aside>
    </div>

    <!-- Organic Divider (Mobile & Tablet) -->
    <OrganicDivider
      orientation="horizontal"
      seed="crew-mobile-divider"
      randomOnMount
      class="lg:hidden mt-6 mb-5 sm:mt-8 sm:mb-6 transition-opacity duration-500 ease-out"
      style={shouldAnimate
        ? "opacity: 1; transition-delay: 175ms;"
        : "opacity: 0;"}
    />

    <!-- Contextual Info (Mobile & Tablet: 100% Card-free, left-aligned matching 'The crew.' gutter) -->
    <div
      class="lg:hidden w-full min-h-[120px] flex flex-col items-start justify-start text-left transition-opacity duration-500 ease-out"
      style={shouldAnimate
        ? "opacity: 1; transition-delay: 200ms;"
        : "opacity: 0;"}
      aria-live="polite"
    >
      <div class="crew-detail-grid w-full">
        {#key activeMember.name}
          <div
            in:fade={{ duration: 150, delay: 50 }}
            out:fade={{ duration: 90 }}
            class="crew-detail-content flex flex-col items-start text-left w-full"
          >
            <!-- Name + Slash + Country Flag & Label -->
            <div
              class="flex flex-wrap items-baseline justify-start gap-x-2.5 gap-y-1"
            >
              <h3
                class="text-2xl sm:text-[28px] font-black tracking-tight text-[#4f5f70] leading-tight m-0"
              >
                {activeMember.name}
              </h3>
              <span
                class="text-sm font-bold text-[#8a98a5]/50 select-none"
                aria-hidden="true"
              >
                /
              </span>
              <span
                class="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#718191]"
              >
                {#each getCountryCodes(activeMember.country) as code}
                  <CountryFlag country={code} class="h-2.5 w-3.5" />
                {/each}
                <span>{activeMember.country}</span>
              </span>
            </div>

            <!-- Role -->
            <p
              class="mt-1.5 text-sm sm:text-[15px] font-semibold leading-snug text-[#627383] m-0 text-left"
            >
              {activeMember.role}
            </p>

            <!-- Discreet Portfolio Link -->
            <div class="mt-3 min-h-[26px] flex items-center justify-start">
              {#if activeMember.href}
                <a
                  href={activeMember.href}
                  target="_blank"
                  rel="noreferrer"
                  class="group inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#4f5f70] underline underline-offset-4 decoration-[#8fb8d8] transition-colors hover:text-[#344253] hover:decoration-[#4f5f70]"
                  aria-label={`View ${activeMember.name}'s portfolio`}
                >
                  <span>View portfolio</span>
                  <IconArrow size={11} direction="up-right" />
                </a>
              {/if}
            </div>
          </div>
        {/key}
      </div>
    </div>

    <!-- Organic section divider: compact margin on mobile to avoid dead whitespace -->
    <OrganicDivider
      randomOnMount
      class="mt-8 mb-8 sm:mt-12 sm:mb-10 lg:mt-24 lg:mb-16"
    />
  </div>
</section>

<style>
  .crew-member-item {
    transition:
      opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
      transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: opacity, transform;
  }

  .crew-detail-grid {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .crew-detail-grid > :global(*) {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  @media (prefers-reduced-motion: reduce) {
    .crew-member-item {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
