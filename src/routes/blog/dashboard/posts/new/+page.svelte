<script lang="ts">import PostEditor from "$lib/components/PostEditor.svelte"; import type { PageProps } from "./$types"; let { form }: PageProps = $props();</script>
<svelte:head><title>New blog post | Renhet Studio</title><meta name="robots" content="noindex,nofollow" /></svelte:head><main class="editor-page"><PostEditor {form} /></main>
