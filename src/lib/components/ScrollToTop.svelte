<script lang="ts">
  import IconArrowUp from "$lib/components/icons/IconArrowUp.svelte";
  import { sound } from "$lib/audio/soundEffects";

  let scrollY = $state(0);
  let isVisible = $derived(scrollY > 400);

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
</script>

<svelte:window bind:scrollY />

<div
  class="fixed bottom-6 right-6 z-40 transition-all duration-300 sm:bottom-8 sm:right-8 {isVisible
    ? 'pointer-events-auto translate-y-0 opacity-100 scale-100'
    : 'pointer-events-none translate-y-4 opacity-0 scale-90'}"
>
  <button
    type="button"
    onclick={scrollToTop}
    class="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-[#fffdf3] bg-[#4f5f70] text-[#fffdf3] shadow-[0_10px_30px_rgba(30,42,54,0.35)] ring-1 ring-[#fffdf3]/50 backdrop-blur-md transition-all duration-300 hover:bg-[#3d4b58] hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(30,42,54,0.45)] hover:ring-[#fffdf3]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fffdf3] active:translate-y-0 active:scale-95"
    aria-label="Scroll back to top"
    title="Scroll to top"
  >
    <IconArrowUp
      size={18}
      class="text-[#fffdf3] transition-transform duration-200 group-hover:-translate-y-0.5"
    />
  </button>
</div>
