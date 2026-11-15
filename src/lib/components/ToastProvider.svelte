<script lang="ts">
  import { fade } from "svelte/transition";
  import { toastState } from "$lib/toast.svelte";
  import IconCheck from "$lib/components/icons/IconCheck.svelte";
  import IconClose from "$lib/components/icons/IconClose.svelte";

  $effect(() => {
    if (!toastState.current) return;
    const timer = setTimeout(() => { toastState.current = null; }, 4000);
    return () => clearTimeout(timer);
  });
</script>

{#if toastState.current}
  <div
    role="status"
    aria-live="polite"
    transition:fade={{ duration: 240 }}
    class="fixed bottom-7 left-1/2 z-[60] flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border-2 bg-[#fffdf3]/95 px-5 py-3 shadow-[0_12px_36px_rgba(52,66,83,0.18)] backdrop-blur-md {toastState.current.ok ? 'border-[#8fb8d8]/60 text-[#344253]' : 'border-[#8b4b50]/40 text-[#8b4b50]'}"
  >
    <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full {toastState.current.ok ? 'bg-[#8fb8d8]/30 text-[#344253]' : 'bg-[#8b4b50]/15 text-[#8b4b50]'}">
      {#if toastState.current.ok}<IconCheck size={14} strokeWidth={3} />{:else}<IconClose size={14} strokeWidth={3} />{/if}
    </div>
    <span class="text-sm font-black tracking-tight">{toastState.current.message}</span>
    <button type="button" onclick={() => (toastState.current = null)} class="ml-1 -mr-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#4f5f70]/60 transition-colors hover:bg-[#4f5f70]/10 hover:text-[#4f5f70]" aria-label="Dismiss notification">
      <IconClose size={12} strokeWidth={2.5} />
    </button>
  </div>
{/if}
