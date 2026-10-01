<script lang="ts">import PostEditor from "$lib/components/PostEditor.svelte"; import type { PageProps } from "./$types"; let { data, form }: PageProps = $props();</script>
<svelte:head><title>Edit blog post | Renhet Studio</title><meta name="robots" content="noindex,nofollow" /></svelte:head><main class="editor-page"><PostEditor post={data.post} {form} /></main>
