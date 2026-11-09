<script lang="ts">
  import { SITE_URL } from "$lib/blog/config";

  interface SocialImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    type?: string;
  }

  let {
    title,
    description,
    path,
    type = "website",
    image = {
      src: "/social/renhet-studio.jpg",
      alt: "Renhet Studio logo on a warm paper background",
      width: 1200,
      height: 630,
      type: "image/jpeg",
    },
  }: {
    title: string;
    description: string;
    path: string;
    type?: "website" | "article";
    image?: SocialImage;
  } = $props();

  const url = $derived(new URL(path, `${SITE_URL}/`).href);
  const imageUrl = $derived(new URL(image.src, `${SITE_URL}/`).href);
</script>

<svelte:head>
  <meta property="og:site_name" content="Renhet Studio" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content={type} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:image:alt" content={image.alt} />
  {#if image.width && image.height}
    <meta property="og:image:width" content={String(image.width)} />
    <meta property="og:image:height" content={String(image.height)} />
  {/if}
  {#if image.type}
    <meta property="og:image:type" content={image.type} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@renhetstudio" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />
  <meta name="twitter:image:alt" content={image.alt} />
</svelte:head>
