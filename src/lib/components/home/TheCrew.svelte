<script lang="ts">
  import { onMount } from "svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import OrganicDivider from "$lib/components/OrganicDivider.svelte";

  interface CrewMember {
    name: string;
    role: string;
    country: string;
    href?: string;
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
      country: "UK",
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

      <!-- Contextual Panel (Desktop: 100% Card-free, pure editorial text directly on paper canvas) -->
      <aside
        class="hidden lg:flex relative min-h-[200px] w-full flex-col justify-start pt-1 transition-opacity duration-500 ease-out"
        style={shouldAnimate
          ? "opacity: 1; transition-delay: 200ms;"
          : "opacity: 0;"}
        aria-live="polite"
      >
        <div class="transition-opacity duration-200 ease-out">
          <h3 class="text-3xl font-black tracking-tight text-[#4f5f70] m-0">
            {activeMember.name}
          </h3>

          <p
            class="mt-2 min-h-[48px] text-base font-semibold leading-snug text-[#627383] m-0"
          >
            {activeMember.role}
          </p>

          <div
            class="mt-3.5 flex items-center gap-1.5 text-sm font-semibold text-[#718191]"
          >
            <svg
              class="h-4 w-4 shrink-0 text-[#718191]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21c-4.418 0-8-5.373-8-12a8 8 0 1116 0c0 6.627-3.582 12-8 12zM12 11a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            <span>{activeMember.country}</span>
          </div>

          <!-- Reserved slot for portfolio link to prevent height shifts -->
          <div class="mt-5 min-h-[26px]">
            {#if activeMember.href}
              <a
                href={activeMember.href}
                target="_blank"
                rel="noreferrer"
                class="group inline-flex items-center gap-1.5 border-b border-[#4f5f70]/40 pb-0.5 text-xs font-bold uppercase tracking-wider text-[#4f5f70] transition-colors hover:border-[#4f5f70] hover:text-[#344253]"
                aria-label={`View ${activeMember.name}'s portfolio (opens in new tab)`}
              >
                <span>View portfolio</span>
                <IconArrow size={11} direction="up-right" />
              </a>
            {/if}
          </div>
        </div>
      </aside>
    </div>

    <!-- Organic Divider (Mobile & Tablet) -->
    <OrganicDivider
      orientation="horizontal"
      seed="crew-mobile-divider"
      randomOnMount
      class="lg:hidden mt-5 mb-4 sm:mt-6 sm:mb-5 transition-opacity duration-500 ease-out"
      style={shouldAnimate
        ? "opacity: 1; transition-delay: 175ms;"
        : "opacity: 0;"}
    />

    <!-- Contextual Info (Mobile & Tablet: 100% Card-free, aligned with names, concise editorial metadata) -->
    <div
      class="lg:hidden px-2.5 min-h-[96px] flex flex-col justify-start transition-opacity duration-500 ease-out"
      style={shouldAnimate
        ? "opacity: 1; transition-delay: 200ms;"
        : "opacity: 0;"}
      aria-live="polite"
    >
      <div class="transition-opacity duration-200 ease-out">
        <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-[#4f5f70] m-0">
          {activeMember.name}
        </h3>

        <p
          class="mt-1 text-sm sm:text-base font-semibold leading-snug text-[#627383] m-0"
        >
          {activeMember.role}
        </p>

        <div
          class="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm font-semibold text-[#718191]"
        >
          <div class="flex items-center gap-1.5">
            <svg
              class="h-3.5 w-3.5 text-[#718191] shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21c-4.418 0-8-5.373-8-12a8 8 0 1116 0c0 6.627-3.582 12-8 12zM12 11a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            <span>{activeMember.country}</span>
          </div>

          {#if activeMember.href}
            <span class="text-[#718191]/40 select-none" aria-hidden="true">·</span>
            <a
              href={activeMember.href}
              target="_blank"
              rel="noreferrer"
              class="inline-flex items-center gap-1.5 border-b border-[#4f5f70]/40 pb-0.5 text-xs font-bold uppercase tracking-wider text-[#4f5f70] transition-colors hover:border-[#4f5f70] hover:text-[#344253]"
              aria-label={`View ${activeMember.name}'s portfolio`}
            >
              <span>View portfolio</span>
              <IconArrow size={11} direction="up-right" />
            </a>
          {/if}
        </div>
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

  @media (prefers-reduced-motion: reduce) {
    .crew-member-item {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
</style>
