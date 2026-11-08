<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import ErrorIllustration from "./ErrorIllustration.svelte";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconReload from "$lib/components/icons/IconReload.svelte";

  let {
    status = 404,
  }: {
    status?: number;
  } = $props();

  const isNotFound = $derived(status === 404);
  const variant = $derived<"not-found" | "server-error">(
    isNotFound ? "not-found" : "server-error"
  );

  let isRetrying = $state(false);

  const handleRetry = async () => {
    if (isRetrying) return;
    isRetrying = true;
    try {
      await invalidateAll();
    } catch {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } finally {
      isRetrying = false;
    }
  };
</script>

<section
  class="relative z-10 mx-auto flex flex-1 w-full max-w-[840px] flex-col items-center justify-center text-center px-5 sm:px-8 lg:px-10 pt-36 pb-14 sm:pt-44 sm:pb-18 md:pt-52 md:pb-24 my-auto"
  aria-labelledby="error-title"
>
  <!-- 1. Art Block: Authentic Paperlogy-9Black Number + Handcrafted Renhet Splash -->
  <ErrorIllustration {variant} code={status} />

  <!-- 2. Dominant Page Title matching the exact typography & Slate Ink (#4f5f70) of the rest of the site -->
  <h1
    id="error-title"
    class="mt-6 sm:mt-8 text-[clamp(2.75rem,6.2vw,4.8rem)] font-black leading-[0.92] tracking-tight text-[#4f5f70]"
  >
    {isNotFound ? "Lost between builds." : "Something went sideways."}
  </h1>

  <!-- 3. Minimal Concise Description in Muted Slate (#627383) -->
  <p
    class="mt-4 max-w-[540px] text-base sm:text-lg md:text-[20px] font-bold leading-relaxed text-[#627383]"
  >
    {isNotFound
      ? "We couldn't find the page you're looking for."
      : "We couldn't load this page. Please try again."}
  </p>

  <!-- 4. Recovery Actions: Tactile Indie Pill Buttons matching GameSpotlight & Careers -->
  <div class="mt-7 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
    {#if isNotFound}
      <!-- 404 Primary Action: Back to home with tactile Arrow Back icon -->
      <a
        href="/"
        class="inline-flex h-[52px] w-full max-w-[220px] sm:w-auto items-center justify-center gap-2.5 rounded-full border-2 border-transparent bg-[#4f5f70] px-7 text-base font-black text-[#fffdf3] whitespace-nowrap shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] hover:shadow-[0_8px_24px_rgba(52,66,83,0.25)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#344253] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]"
      >
        <IconArrow direction="left" size={16} />
        <span>Back to home</span>
      </a>

      <!-- 404 Secondary Action: See our games (direct anchor to #game on home) -->
      <a
        href="/#game"
        class="inline-flex h-[52px] items-center justify-center text-base sm:text-[17px] font-black text-[#4f5f70] underline underline-offset-4 decoration-2 decoration-[#4f5f70]/40 transition-colors duration-200 hover:text-[#344253] hover:decoration-[#344253] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#344253] focus-visible:rounded-sm"
      >
        <span>See our games</span>
      </a>
    {:else}
      <!-- 5xx Primary Action: Try again -->
      <button
        type="button"
        onclick={handleRetry}
        disabled={isRetrying}
        class="inline-flex h-[52px] w-full max-w-[220px] sm:w-auto items-center justify-center gap-2.5 rounded-full border-2 border-transparent bg-[#4f5f70] px-7 text-base font-black text-[#fffdf3] whitespace-nowrap shadow-[0_4px_16px_rgba(79,95,112,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#344253] hover:shadow-[0_8px_24px_rgba(52,66,83,0.25)] active:translate-y-0 disabled:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#344253] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8] cursor-pointer"
      >
        <IconReload size={18} strokeWidth={2.4} class={isRetrying ? "animate-spin" : ""} />
        <span>Try again</span>
      </button>

      <!-- 5xx Secondary Action: Back to home (outlined pill) with tactile Arrow Back icon -->
      <a
        href="/"
        class="inline-flex h-[52px] w-full max-w-[220px] sm:w-auto items-center justify-center gap-2.5 rounded-full border-2 border-[#4f5f70] bg-transparent px-7 text-base font-black text-[#4f5f70] whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:border-[#344253] hover:bg-[#4f5f70]/8 hover:text-[#344253] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#344253] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f1e8]"
      >
        <IconArrow direction="left" size={16} />
        <span>Back to home</span>
      </a>
    {/if}
  </div>
</section>
