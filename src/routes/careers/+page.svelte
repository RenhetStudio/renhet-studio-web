<script lang="ts">
  import { enhance } from "$app/forms";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconPlus from "$lib/components/icons/IconPlus.svelte";
  import IconChevronDown from "$lib/components/icons/IconChevronDown.svelte";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();
</script>

<svelte:head>
  <title>Careers | Renhet Studio</title>
  <meta name="description" content="Join Renhet Studio and help us build friendly, detailed game worlds." />
  <link rel="canonical" href="https://www.renhetstudio.com/careers" />
  <meta property="og:title" content="Careers | Renhet Studio" />
  <meta
    property="og:description"
    content="Make warm worlds with a tiny, international crew. We care about thoughtful craft, kind collaboration, and games full of personality."
  />
  <meta property="og:url" content="https://www.renhetstudio.com/careers" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://www.renhetstudio.com/renhet-logo-dark.png" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="min-h-screen w-full max-w-full bg-[#f6f1e8] text-[#4f5f70]">
  <!-- Floating Site Header (renders solid immediately on non-hero pages) -->
  <SiteHeader />

  <!-- 1. Editorial Split Header -->
  <section
    class="px-5 pt-28 pb-14 sm:px-8 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20 lg:px-10"
    aria-labelledby="careers-title"
  >
    <div class="mx-auto max-w-[1440px]">
      <!-- Dominant Page Title -->
      <h1
        id="careers-title"
        class="text-[clamp(3.5rem,8vw,7.5rem)] font-black leading-[0.88] tracking-tight text-[#4f5f70]"
      >
        Careers.
      </h1>

      <!-- Asymmetric Editorial Split Manifesto -->
      <div class="mt-8 grid grid-cols-1 items-start gap-8 sm:mt-10 sm:gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <!-- Left: Statement Headline -->
        <div>
          <h2 class="text-[clamp(2.2rem,4.5vw,4.2rem)] font-black leading-[0.96] tracking-tight text-[#4f5f70]">
            Make warm worlds with a tiny, international crew.
          </h2>
        </div>

        <!-- Right: Manifesto Description & Direct CTAs -->
        <div class="flex flex-col items-start gap-6 sm:gap-8">
          <p class="text-lg font-bold leading-relaxed text-[#627383] sm:text-xl md:text-[22px]">
            We care about thoughtful craft, kind collaboration, and games full of personality. If that sounds like your kind of place, say hello.
          </p>

          <div class="flex flex-wrap items-center gap-4">
            <!-- Jump to open positions -->
            <a
              href="#openings"
              class="group inline-flex h-[52px] items-center gap-2.5 rounded-full border-2 border-transparent bg-[#4f5f70] px-7 text-base font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] hover:shadow-[0_8px_24px_rgba(52,66,83,0.25)] active:translate-y-0"
            >
              <span>View open roles</span>
              <IconArrow direction="down" size={16} />
            </a>

            <!-- Jump to open application form -->
            <a
              href="?role=open-application#apply"
              class="group inline-flex h-[52px] items-center gap-2.5 rounded-full border-2 border-[#4f5f70]/30 bg-[#fffdf3] px-7 text-base font-black text-[#4f5f70] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4f5f70] hover:bg-[#f6f1e8] active:translate-y-0"
            >
              <span>Introduce yourself</span>
              <IconArrow direction="right" size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. Openings Section (Single crisp border-t separating from header, zero duplicate hairlines) -->
  <section
    id="openings"
    class="border-t border-[#d6d5ca] px-5 py-14 sm:px-8 sm:py-16 md:py-20 lg:px-10"
    aria-labelledby="openings-title"
  >
    <div class="mx-auto max-w-[1440px]">
      <div class="mb-10 max-w-3xl">
        <h2
          id="openings-title"
          class="text-[clamp(2.6rem,6vw,5.5rem)] font-black leading-[0.92] tracking-tight text-[#4f5f70]"
        >
          Find your place.
        </h2>
        <p class="mt-4 text-base font-bold leading-relaxed text-[#627383] sm:text-lg">
          Roles appear here as soon as they are published. No perfect match? Our open application is always active.
        </p>
      </div>

      <!-- Published Roles List or Clean Empty State -->
      {#await data.positions}
        <div class="border-t border-[#d6d5ca] py-10">
          <p class="text-base font-bold text-[#627383]" role="status">Loading open roles…</p>
        </div>
      {:then positions}
        {#if positions.length === 0}
          <!-- Clean, editorial empty state with direct CTA to open application below -->
          <div class="border-t border-[#d6d5ca] pt-10 sm:pt-12">
            <div class="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div class="max-w-2xl">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-black tracking-widest text-[#718191] uppercase">
                    Open Application
                  </span>
                  <span class="inline-flex items-center rounded-full bg-[#8fb8d8]/25 px-2.5 py-0.5 text-xs font-black text-[#344253]">
                    Always open
                  </span>
                </div>
                <h3 class="mt-3 text-2xl font-black text-[#4f5f70] sm:text-3xl md:text-4xl">
                  Show us what you make.
                </h3>
                <p class="mt-3 text-base font-bold leading-relaxed text-[#627383] sm:text-lg">
                  We don't have any specific open roles listed right now, but our open application is always active. Artists, developers, designers, audio people, producers, and specialists are all welcome.
                </p>
              </div>

              <a
                href="?role=open-application#apply"
                class="group inline-flex h-[52px] shrink-0 items-center gap-2.5 rounded-full border-2 border-transparent bg-[#4f5f70] px-7 text-base font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] hover:shadow-[0_8px_24px_rgba(52,66,83,0.25)] active:translate-y-0"
              >
                <span>Introduce yourself</span>
                <IconArrow direction="down" size={16} />
              </a>
            </div>
          </div>
        {:else}
          <!-- Published Roles Accordion -->
          <div class="border-t border-[#d6d5ca]">
            {#each positions as position, index}
              <details class="group border-b border-[#d6d5ca]">
                <summary class="grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] sm:grid-cols-[4rem_minmax(0,1fr)_minmax(12rem,0.6fr)_2.5rem] items-center gap-4 py-6 sm:py-7 cursor-pointer list-none transition-colors duration-200 hover:bg-[#b8d4f0]/15 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f5f70]/40">
                  <span class="text-xs font-black tracking-widest text-[#718191] uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span class="flex flex-col gap-1">
                    <strong class="text-xl font-black text-[#4f5f70] transition-colors duration-200 group-hover:text-[#344253] sm:text-2xl md:text-3xl">
                      {position.title}
                    </strong>
                    <span class="text-xs font-extrabold text-[#718191] sm:text-sm">
                      {position.department}
                    </span>
                  </span>
                  <span class="hidden text-right text-xs font-extrabold text-[#718191] sm:block sm:text-sm">
                    {position.location} · {position.type}
                  </span>
                  <span class="flex justify-end" aria-hidden="true">
                    <IconPlus size={20} class="text-[#4f5f70] transition-transform duration-200 group-open:rotate-45" />
                  </span>
                </summary>

                <div class="grid grid-cols-1 gap-8 py-6 pl-10 pr-2 sm:pl-16 sm:pr-6 md:grid-cols-3 border-t border-[#d6d5ca]/60">
                  <p class="col-span-full text-base font-bold leading-relaxed text-[#627383] sm:text-lg">
                    {position.summary}
                  </p>

                  {#if position.responsibilities.length}
                    <div>
                      <h4 class="mb-3 text-sm font-black tracking-wider text-[#344253] uppercase">
                        What you'll do
                      </h4>
                      <ul class="space-y-2 pl-4 text-sm font-bold leading-relaxed text-[#627383] list-disc marker:text-[#8fb8d8]">
                        {#each position.responsibilities as item}
                          <li>{item}</li>
                        {/each}
                      </ul>
                    </div>
                  {/if}

                  {#if position.requirements.length}
                    <div>
                      <h4 class="mb-3 text-sm font-black tracking-wider text-[#344253] uppercase">
                        What you bring
                      </h4>
                      <ul class="space-y-2 pl-4 text-sm font-bold leading-relaxed text-[#627383] list-disc marker:text-[#8fb8d8]">
                        {#each position.requirements as item}
                          <li>{item}</li>
                        {/each}
                      </ul>
                    </div>
                  {/if}

                  {#if position.niceToHave.length}
                    <div>
                      <h4 class="mb-3 text-sm font-black tracking-wider text-[#344253] uppercase">
                        Lovely extras
                      </h4>
                      <ul class="space-y-2 pl-4 text-sm font-bold leading-relaxed text-[#627383] list-disc marker:text-[#8fb8d8]">
                        {#each position.niceToHave as item}
                          <li>{item}</li>
                        {/each}
                      </ul>
                    </div>
                  {/if}

                  <div class="col-span-full pt-4">
                    <a
                      href={`?role=${position.slug}#apply`}
                      class="group inline-flex h-[44px] items-center gap-2 rounded-full border-2 border-transparent bg-[#4f5f70] px-5 text-sm font-black text-[#fffdf3] shadow-[0_2px_8px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] active:translate-y-0"
                    >
                      <span>Apply for this role</span>
                      <IconArrow direction="down" size={14} />
                    </a>
                  </div>
                </div>
              </details>
            {/each}
          </div>

          <!-- Spontaneous note under published roles (framed by whitespace, zero duplicate borders) -->
          <div class="mt-10 sm:mt-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-black tracking-widest text-[#718191] uppercase">Spontaneous</span>
                <span class="rounded-full bg-[#8fb8d8]/25 px-2.5 py-0.5 text-xs font-black text-[#344253]">Always open</span>
              </div>
              <h3 class="mt-2 text-xl sm:text-2xl font-black text-[#4f5f70]">Show us what you make.</h3>
              <p class="mt-1 text-sm sm:text-base font-bold text-[#627383]">Don't see your craft above? We are always eager to meet thoughtful creators.</p>
            </div>
            <a
              href="?role=open-application#apply"
              class="group inline-flex h-[48px] shrink-0 items-center gap-2 rounded-full border-2 border-[#4f5f70]/30 bg-[#fffdf3] px-6 text-sm font-black text-[#4f5f70] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4f5f70] hover:bg-[#f6f1e8] active:translate-y-0"
            >
              <span>Introduce yourself</span>
              <IconArrow direction="down" size={14} />
            </a>
          </div>
        {/if}
      {/await}
    </div>
  </section>

  <!-- 3. Application Form Section (Single crisp border-t separating from openings, Card-free layout) -->
  <section
    id="apply"
    class="border-t border-[#d6d5ca] px-5 py-14 sm:px-8 sm:py-16 md:py-20 lg:px-10"
    aria-labelledby="apply-title"
  >
    <div class="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(18rem,0.55fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
      <!-- Left Column: Editorial Sticky Intro -->
      <div class="lg:sticky lg:top-28">
        <h2
          id="apply-title"
          class="text-[clamp(2.6rem,5.5vw,5.5rem)] font-black leading-[0.92] tracking-tight text-[#4f5f70]"
        >
          Tell us what you would love to make.
        </h2>
      </div>

      <!-- Right Column: Card-Free Pure Editorial Form -->
      <div>
        {#if form?.status === "success"}
          <!-- Card-Free Success State -->
          <div class="border-l-4 border-[#8fb8d8] bg-[#fffdf3]/80 p-8 sm:p-10 rounded-2xl" role="status">
            <p class="text-xs font-black tracking-widest text-[#718191] uppercase">Sent successfully</p>
            <h3 class="mt-2 text-2xl sm:text-3xl font-black text-[#4f5f70]">
              We have your application.
            </h3>
            <p class="mt-4 text-base font-bold leading-relaxed text-[#627383] sm:text-lg">
              {form.message}
            </p>
          </div>
        {:else}
          <form
            method="POST"
            use:enhance
            class="flex flex-col"
          >
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Position select (wide) -->
              <label class="flex flex-col gap-2 sm:col-span-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">Applying for</span>
                <div class="relative flex items-center">
                  {#await data.positions}
                    <select
                      name="positionId"
                      required
                      class="h-[52px] w-full appearance-none rounded-xl border border-[#d6d5ca] bg-[#fffdf3] pl-4 pr-12 font-bold text-[#344253] outline-none transition-all duration-180 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
                    >
                      <option value="open-application">Open application</option>
                    </select>
                  {:then positions}
                    <select
                      name="positionId"
                      value={positions.some((position) => position.slug === data.requestedRole) ? data.requestedRole : "open-application"}
                      required
                      class="h-[52px] w-full appearance-none rounded-xl border border-[#d6d5ca] bg-[#fffdf3] pl-4 pr-12 font-bold text-[#344253] outline-none transition-all duration-180 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 cursor-pointer"
                    >
                      <option value="open-application">Open application</option>
                      {#each positions as position}
                        <option value={position.slug}>{position.title}</option>
                      {/each}
                    </select>
                  {/await}
                  <span class="pointer-events-none absolute right-4 flex items-center text-[#4f5f70]">
                    <IconChevronDown size={18} strokeWidth={2.4} />
                  </span>
                </div>
                {#if form?.errors?.positionId}
                  <span class="text-xs font-extrabold text-[#9a3e45]">{form.errors.positionId[0]}</span>
                {/if}
              </label>

              <!-- Name -->
              <label class="flex flex-col gap-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">Name</span>
                <input
                  name="name"
                  autocomplete="name"
                  required
                  maxlength="120"
                  class="h-[52px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
                />
                {#if form?.errors?.name}
                  <span class="text-xs font-extrabold text-[#9a3e45]">{form.errors.name[0]}</span>
                {/if}
              </label>

              <!-- Email -->
              <label class="flex flex-col gap-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">Email</span>
                <input
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  maxlength="254"
                  class="h-[52px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
                />
                {#if form?.errors?.email}
                  <span class="text-xs font-extrabold text-[#9a3e45]">{form.errors.email[0]}</span>
                {/if}
              </label>

              <!-- Location / Timezone (wide) -->
              <label class="flex flex-col gap-2 sm:col-span-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">Location / time zone</span>
                <input
                  name="location"
                  autocomplete="address-level2"
                  required
                  maxlength="120"
                  placeholder="e.g. Berlin, CET or Remote, UTC-5"
                  class="h-[52px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 placeholder:text-[#718191]/60 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
                />
              </label>

              <!-- Portfolio URL -->
              <label class="flex flex-col gap-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">Portfolio URL</span>
                <input
                  name="portfolioUrl"
                  type="url"
                  inputmode="url"
                  maxlength="500"
                  placeholder="https://"
                  class="h-[52px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 placeholder:text-[#718191]/60 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
                />
                {#if form?.errors?.portfolioUrl}
                  <span class="text-xs font-extrabold text-[#9a3e45]">{form.errors.portfolioUrl[0]}</span>
                {/if}
              </label>

              <!-- CV / Resume URL -->
              <label class="flex flex-col gap-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">CV / résumé URL</span>
                <input
                  name="resumeUrl"
                  type="url"
                  inputmode="url"
                  maxlength="500"
                  placeholder="https://"
                  class="h-[52px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 placeholder:text-[#718191]/60 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
                />
              </label>

              <!-- LinkedIn URL (wide) -->
              <label class="flex flex-col gap-2 sm:col-span-2">
                <span class="flex items-center gap-2 text-xs font-black tracking-wider text-[#344253] uppercase">
                  <span>LinkedIn URL</span>
                  <span class="text-[11px] font-bold text-[#718191] normal-case">(Optional)</span>
                </span>
                <input
                  name="linkedinUrl"
                  type="url"
                  inputmode="url"
                  maxlength="500"
                  placeholder="https://"
                  class="h-[52px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] px-4 font-bold text-[#344253] outline-none transition-all duration-180 placeholder:text-[#718191]/60 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30"
                />
              </label>

              <!-- Message (wide) -->
              <label class="flex flex-col gap-2 sm:col-span-2">
                <span class="text-xs font-black tracking-wider text-[#344253] uppercase">Tell us about yourself</span>
                <textarea
                  name="message"
                  required
                  minlength="20"
                  maxlength="5000"
                  rows="6"
                  placeholder="What do you love making, and why would Renhet Studio be a good fit?"
                  class="rounded-xl border border-[#d6d5ca] bg-[#fffdf3] p-4 font-bold text-[#344253] outline-none transition-all duration-180 placeholder:text-[#718191]/60 focus:border-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]/30 resize-y"
                ></textarea>
                {#if form?.errors?.message}
                  <span class="text-xs font-extrabold text-[#9a3e45]">{form.errors.message[0]}</span>
                {/if}
              </label>
            </div>

            <!-- Consent Checkbox -->
            <label class="mt-6 flex items-start gap-3 cursor-pointer select-none">
              <input
                name="consent"
                type="checkbox"
                required
                class="mt-1 h-4 w-4 rounded border border-[#d6d5ca] text-[#4f5f70] accent-[#4f5f70] focus:ring-2 focus:ring-[#8fb8d8]"
              />
              <span class="text-xs font-bold leading-relaxed text-[#627383] sm:text-sm">
                I agree that Renhet Studio may store and review my information for recruitment.
              </span>
            </label>

            <!-- Honeypot -->
            <label class="hidden" aria-hidden="true">
              Website
              <input name="website" tabindex="-1" autocomplete="off" />
            </label>

            {#if form?.message}
              <p class="mt-4 text-sm font-extrabold text-[#9a3e45]" role="alert">
                {form.message}
              </p>
            {/if}

            <!-- Submit Button (Primary standard 52px button without icon drift animation) -->
            <div class="mt-8">
              <button
                type="submit"
                class="group inline-flex h-[52px] items-center gap-2.5 rounded-full border-2 border-transparent bg-[#4f5f70] px-8 text-base font-black text-[#fffdf3] shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] hover:shadow-[0_8px_24px_rgba(52,66,83,0.25)] active:translate-y-0 cursor-pointer disabled:cursor-wait disabled:opacity-60"
              >
                <span>Send application</span>
                <IconArrow direction="right" size={16} />
              </button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  </section>

  <SiteFooter />
</main>
