<script lang="ts">
  import IconArrowUp from "$lib/components/icons/IconArrowUp.svelte";

  let scrollY = $state(0);
  let isVisible = $derived(scrollY > 400);

  const scrollToTop = () => {
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
    class="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#fffdf3]/40 bg-[#4f5f70]/95 text-[#fffdf3] shadow-md backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fffdf3] hover:text-[#4f5f70] hover:border-[#fffdf3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fffdf3] active:translate-y-0 active:scale-95"
    aria-label="Scroll back to top"
    title="Scroll to top"
  >
    <IconArrowUp
      size={16}
      class="transition-transform duration-200 group-hover:-translate-y-0.5"
    />
  </button>
</div>
