<script lang="ts">import LoginForm from "$lib/components/LoginForm.svelte"; import type { PageProps } from "./$types"; let { data }: PageProps = $props();</script>
<svelte:head><title>Sign in | Renhet Studio</title><meta name="robots" content="noindex,nofollow" /></svelte:head>
<main class="auth-page"><section class="auth-panel"><a href="/blog" class="auth-logo" aria-label="Return to the blog"><picture>
  <source type="image/avif" srcset="/optimized/renhet-logo-dark-208.avif 208w, /optimized/renhet-logo-dark-416.avif 416w" sizes="208px" />
  <source type="image/webp" srcset="/optimized/renhet-logo-dark-208.webp 208w, /optimized/renhet-logo-dark-416.webp 416w" sizes="208px" />
  <img src="/renhet-logo-dark.png" width="208" height="105" alt="Renhet Studio" fetchpriority="high" />
</picture></a><p class="auth-kicker">Renhet Studio community</p><h1>Sign in to the discussion.</h1><p>Use Google or a one-time email link. New comments are reviewed before they become public.</p><LoginForm nextPath={data.next} /><a class="auth-back" href="/blog">← Return to the blog</a></section><aside class="auth-art" aria-hidden="true"><span>Make.</span><span>Share.</span><span>Discuss.</span></aside></main>
