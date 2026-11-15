<script lang="ts">
  import { onMount } from "svelte";

  let { siteKey, onverified }: { siteKey: string; onverified: (verified: boolean) => void } = $props();
  let container: HTMLDivElement;
  let failed = $state(false);

  interface Turnstile {
    render: (element: HTMLElement, options: Record<string, unknown>) => string;
    remove: (id: string) => void;
  }

  onMount(() => {
    const browser = window as Window & { turnstile?: Turnstile };
    let widgetId: string | undefined;
    let disposed = false;
    const onError = () => { failed = true; onverified(false); };
    const render = () => {
      if (disposed || !browser.turnstile || widgetId !== undefined) return;
      try {
        widgetId = browser.turnstile.render(container, {
          sitekey: siteKey,
          action: "contact",
          theme: "light",
          size: "flexible",
          callback: () => { failed = false; onverified(true); },
          "expired-callback": () => onverified(false),
          "error-callback": onError,
          "timeout-callback": onError,
        });
      } catch { onError(); }
    };
    let script = document.querySelector<HTMLScriptElement>("script[data-contact-turnstile]");
    if (!script) {
      script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.dataset.contactTurnstile = "true";
      document.head.append(script);
    }
    script.addEventListener("load", render);
    script.addEventListener("error", onError);
    render();
    const timeout = window.setTimeout(() => {
      if (widgetId === undefined) onError();
    }, 15000);

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      script.removeEventListener("load", render);
      script.removeEventListener("error", onError);
      if (widgetId !== undefined) browser.turnstile?.remove(widgetId);
    };
  });
</script>

<div class="min-h-[65px] w-full" bind:this={container}></div>
{#if failed}
  <p class="form-error text-sm" role="alert">The security check could not load. Reload this page or email hello@renhetstudio.com.</p>
{/if}
