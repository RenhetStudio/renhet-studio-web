<script lang="ts">import { page } from "$app/state";</script>
<svelte:head><title>Story not found | Renhet Studio</title></svelte:head>
<main class="blog-site blog-empty blog-not-found"><h1>{page.status === 404 ? "Story not found." : "Something went wrong."}</h1><p>{page.status === 404 ? "It may still be a draft, scheduled for later, or no longer available." : page.error?.message}</p><a href="/blog">Return to all stories</a></main>
