<script lang="ts">
  import { onMount } from "svelte";
  import { sound } from "$lib/audio/soundEffects";

  onMount(() => {
    sound.init();

    // Centralized click sound dispatcher:
    // Any click on an interactive element automatically triggers a randomized tactile click sound.
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, [role='button'], [role='tab'], input, select, textarea, summary, label, .badge-stamp"
      );

      if (interactive) {
        sound.playClick();
      }
    };

    window.addEventListener("click", handleGlobalClick, { capture: true, passive: true });

    return () => {
      window.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  });
</script>

