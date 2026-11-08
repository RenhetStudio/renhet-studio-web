<script lang="ts">
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import LoginForm from "$lib/components/LoginForm.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const isFromBlog = $derived(data.next.startsWith("/blog"));
  const returnLabel = $derived(
    isFromBlog ? "Return to the blog" : "Return to home"
  );
  const returnHref = $derived(
    data.next === "/login" || data.next === "" ? "/" : data.next
  );
</script>

<svelte:head>
  <title>Sign in | Renhet Studio</title>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<main
  class="flex min-h-screen w-full max-w-full flex-col justify-between overflow-x-hidden bg-[#f6f1e8] text-[#4f5f70]"
>
  <!-- Floating Site Header (renders solid immediately on non-hero pages) -->
  <SiteHeader />

  <!-- Authentication Section (with compensated padding for the floating navbar) -->
  <section
    class="relative isolate z-10 mx-auto my-auto flex flex-1 w-full max-w-md flex-col items-center justify-center px-5 pt-36 pb-16 text-center sm:px-8 sm:pt-44 sm:pb-20 md:pt-48 md:pb-24"
    aria-labelledby="login-title"
  >
    <!-- Background atmospheric watermark: Renhet 12-point Sun symbol -->
    <div
      class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <img
        src="/renhet-symbol-dark.png"
        alt=""
        width="480"
        height="480"
        class="w-[300px] select-none opacity-[0.035] sm:w-[440px]"
      />
    </div>

    <div class="relative z-10 w-full">
      <!-- Dominant Headline in Paperlogy -->
      <h1
        id="login-title"
        class="text-[clamp(2.6rem,6vw,4rem)] font-black leading-[0.92] tracking-tight text-[#344253]"
      >
        Sign in.
      </h1>

      <!-- Concise Purposeful Copy -->
      <p
        class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#617283] sm:text-base"
      >
        Use Google or a one-time email link to sign in to the studio.
      </p>

      <!-- Auth Form -->
      <div class="mt-8 sm:mt-10">
        <LoginForm
          nextPath={data.next}
          initialError={data.error}
          commentsEnabled={data.commentsEnabled}
        />
      </div>

      <!-- Return link -->
      <div class="mt-8">
        <a
          href={returnHref}
          class="inline-flex items-center gap-2 text-sm font-bold text-[#527a98] transition-colors hover:text-[#344253]"
        >
          <IconArrow direction="left" size={13} />
          <span>{returnLabel}</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Global Footer with organic wave divider -->
  <SiteFooter />
</main>
