<script lang="ts">
  import type { Snippet } from "svelte";
  import type { UserProfile } from "$lib/blog/types";
  import SiteHeader from "./SiteHeader.svelte";
  import SiteFooter from "./SiteFooter.svelte";
  let { profile = null, children }: { profile?: UserProfile | null; children: Snippet } = $props();
</script>

<main class="blog-site min-h-screen w-full max-w-full overflow-x-hidden">
  <SiteHeader {profile} />
  {@render children()}
  <SiteFooter />
</main>
