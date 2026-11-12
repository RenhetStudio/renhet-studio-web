<script lang="ts">
  import type { Editor } from "@tiptap/core";
  import { fade, fly } from "svelte/transition";
  import { createClient } from "$lib/supabase/client";
  import IconArrow from "$lib/components/icons/IconArrow.svelte";
  import IconCheck from "$lib/components/icons/IconCheck.svelte";
  import IconClose from "$lib/components/icons/IconClose.svelte";
  import IconCopy from "$lib/components/icons/IconCopy.svelte";
  import IconEdit from "$lib/components/icons/IconEdit.svelte";
  import IconExternal from "$lib/components/icons/IconExternal.svelte";
  import IconMedia from "$lib/components/icons/IconMedia.svelte";
  import IconPlus from "$lib/components/icons/IconPlus.svelte";
  import IconReload from "$lib/components/icons/IconReload.svelte";
  import IconSound from "$lib/components/icons/IconSound.svelte";
  import IconTrash from "$lib/components/icons/IconTrash.svelte";
  import IconVideo from "$lib/components/icons/IconVideo.svelte";

  export interface MediaEntry {
    id: string;
    pos: number;
    nodeSize: number;
    kind: "image" | "video" | "audio" | "youtube";
    src: string;
    alt?: string;
    title?: string;
    mediaWidth: number;
    mediaLayout: string;
    filename: string;
  }

  let {
    editor = undefined,
    isOpen = false,
    revision = 0,
    onClose,
    onMediaCountChange,
  }: {
    editor?: Editor;
    isOpen: boolean;
    revision?: number;
    onClose: () => void;
    onMediaCountChange?: (count: number) => void;
  } = $props();

  let activeFilter = $state<"all" | "image" | "video" | "audio" | "youtube">(
    "all",
  );
  let copiedId = $state<string | null>(null);
  let copiedTimer: ReturnType<typeof setTimeout> | null = null;
  let replacingEntry = $state<MediaEntry | null>(null);
  let isReplacing = $state(false);
  let replaceError = $state("");
  let confirmDeleteId = $state<string | null>(null);
  let isUploadingNew = $state(false);
  let uploadNewError = $state("");
  let localRevision = $state(0);

  // Modal dialog state for editing Alt text
  let editingAltEntry = $state<MediaEntry | null>(null);
  let altDraft = $state("");

  let replaceFileInput: HTMLInputElement | undefined = $state();
  let uploadNewFileInput: HTMLInputElement | undefined = $state();

  function getFilename(url: string, kind: string): string {
    if (kind === "youtube") {
      const id =
        url.match(
          /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*)/,
        )?.[1] || "";
      return id ? `YouTube (${id})` : "YouTube Video";
    }
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split("/").filter(Boolean);
      const last = parts[parts.length - 1];
      if (last) return decodeURIComponent(last);
    } catch {
      // not a full URL
    }
    return kind.toUpperCase();
  }

  function getYouTubeThumbnail(url: string): string | null {
    const id =
      url.match(
        /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*)/,
      )?.[1] || "";
    return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
  }

  const mediaList = $derived.by(() => {
    void revision;
    void localRevision;
    if (!editor) return [];
    const entries: MediaEntry[] = [];
    editor.state.doc.descendants((node, pos) => {
      const type = node.type.name;
      if (
        type === "image" ||
        type === "video" ||
        type === "audio" ||
        type === "youtube"
      ) {
        const src = String(node.attrs.src || "");
        entries.push({
          id: `${type}-${pos}-${src.slice(-16)}`,
          pos,
          nodeSize: node.nodeSize,
          kind: type,
          src,
          alt: String(node.attrs.alt || ""),
          title: String(node.attrs.title || ""),
          mediaWidth: Number(node.attrs.mediaWidth) || 100,
          mediaLayout: String(node.attrs.mediaLayout || "standalone"),
          filename: getFilename(src, type),
        });
      }
    });
    return entries;
  });

  $effect(() => {
    onMediaCountChange?.(mediaList.length);
  });

  const filteredList = $derived.by(() => {
    if (activeFilter === "all") return mediaList;
    return mediaList.filter((item) => item.kind === activeFilter);
  });

  const counts = $derived.by(() => {
    const map = {
      all: mediaList.length,
      image: 0,
      video: 0,
      audio: 0,
      youtube: 0,
    };
    for (const item of mediaList) {
      if (item.kind in map) {
        map[item.kind] += 1;
      }
    }
    return map;
  });

  function copyUrl(entry: MediaEntry) {
    if (!entry.src) return;
    navigator.clipboard.writeText(entry.src).then(() => {
      if (copiedTimer) clearTimeout(copiedTimer);
      copiedId = entry.id;
      copiedTimer = setTimeout(() => {
        copiedId = null;
      }, 2000);
    });
  }

  function goToMedia(entry: MediaEntry) {
    if (!editor) return;
    // Find current position of the matching node in case positions moved
    let foundPos: number | null = null;
    editor.state.doc.descendants((node, pos) => {
      if (foundPos !== null) return false;
      if (node.attrs?.src === entry.src) {
        foundPos = pos;
        return false;
      }
    });

    const targetPos = foundPos ?? entry.pos;

    try {
      editor.chain().focus().setNodeSelection(targetPos).scrollIntoView().run();
    } catch {
      try {
        editor
          .chain()
          .focus()
          .setTextSelection(targetPos)
          .scrollIntoView()
          .run();
      } catch {}
    }

    setTimeout(() => {
      if (!editor) return;
      const dom = editor.view.dom;
      const safeSrc = CSS.escape(entry.src);
      let el =
        dom.querySelector(`[src="${entry.src}"]`) ||
        dom.querySelector(`[src*="${safeSrc}"]`);
      if (!el && entry.kind === "youtube") {
        el =
          dom.querySelector(`iframe[src*="${safeSrc}"]`) ||
          dom.querySelector("[data-youtube-video]");
      }
      if (el) {
        const wrap = el.closest(".resizable-media-wrap") || el;
        wrap.scrollIntoView({ behavior: "smooth", block: "center" });
        wrap.classList.remove("media-highlight-pulse");
        // trigger reflow
        void (wrap as HTMLElement).offsetWidth;
        wrap.classList.add("media-highlight-pulse");
        setTimeout(() => {
          wrap.classList.remove("media-highlight-pulse");
        }, 1800);
      }
    }, 60);
  }

  function openAltModal(entry: MediaEntry) {
    editingAltEntry = entry;
    altDraft = entry.alt || "";
  }

  function closeAltModal() {
    editingAltEntry = null;
    altDraft = "";
  }

  function saveAltModal(e?: Event) {
    e?.preventDefault();
    if (!editingAltEntry || !editor) return;
    const cleanAlt = altDraft.trim();
    const entry = editingAltEntry;

    let targetPos: number | null = null;
    let targetNode: any = null;

    editor.state.doc.descendants((node, pos) => {
      if (targetPos !== null) return false;
      if (node.attrs?.src === entry.src) {
        targetPos = pos;
        targetNode = node;
        return false;
      }
    });

    if (targetPos !== null && targetNode) {
      const { tr } = editor.state;
      tr.setNodeMarkup(targetPos, undefined, {
        ...targetNode.attrs,
        alt: cleanAlt,
      });
      editor.view.dispatch(tr);
      localRevision += 1;
    }

    closeAltModal();
  }

  function startReplace(entry: MediaEntry) {
    replacingEntry = entry;
    replaceError = "";
    if (entry.kind === "youtube") {
      const newUrl = prompt("Enter new YouTube video URL", entry.src);
      if (newUrl && newUrl.trim()) {
        executeReplaceUrl(entry, newUrl.trim());
      }
      return;
    }
    if (replaceFileInput) {
      if (entry.kind === "image") replaceFileInput.accept = "image/*";
      else if (entry.kind === "video") replaceFileInput.accept = "video/*";
      else if (entry.kind === "audio") replaceFileInput.accept = "audio/*";
      replaceFileInput.value = "";
      replaceFileInput.click();
    }
  }

  async function handleReplaceFileSelected(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !replacingEntry || !editor) return;

    isReplacing = true;
    replaceError = "";
    const entry = replacingEntry;

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const kind = entry.kind === "youtube" ? "image" : entry.kind;
      const contentType =
        file.type || (ext === "gif" ? "image/gif" : "image/png");

      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType,
          size: file.size,
        }),
      });

      const signed = (await response.json()) as {
        path?: string;
        token?: string;
        publicUrl?: string;
        error?: string;
      };

      if (!response.ok || !signed.path || !signed.token || !signed.publicUrl) {
        throw new Error(signed.error ?? "Failed to prepare upload");
      }

      const { error: uploadErr } = await createClient()
        .storage.from("blog-media")
        .uploadToSignedUrl(signed.path, signed.token, file, { contentType });

      if (uploadErr) throw uploadErr;

      executeReplaceUrl(
        entry,
        signed.publicUrl,
        file.name.replace(/\.[^.]+$/, ""),
      );
    } catch (err) {
      replaceError = err instanceof Error ? err.message : "Replace failed";
      alert(replaceError);
    } finally {
      isReplacing = false;
      replacingEntry = null;
    }
  }

  function executeReplaceUrl(
    entry: MediaEntry,
    newSrc: string,
    newAlt?: string,
  ) {
    if (!editor) return;
    let targetPos: number | null = null;
    let targetNode: any = null;

    editor.state.doc.descendants((node, pos) => {
      if (targetPos !== null) return false;
      if (node.attrs?.src === entry.src) {
        targetPos = pos;
        targetNode = node;
        return false;
      }
    });

    if (targetPos !== null && targetNode) {
      const { tr } = editor.state;
      const newAttrs = {
        ...targetNode.attrs,
        src: newSrc,
      };
      if (newAlt && entry.kind === "image") {
        newAttrs.alt = newAlt;
      }
      tr.setNodeMarkup(targetPos, undefined, newAttrs);
      editor.view.dispatch(tr);
      localRevision += 1;
    }
  }

  function deleteEntry(entry: MediaEntry) {
    if (!editor) return;
    let targetPos: number | null = null;
    let targetNode: any = null;

    editor.state.doc.descendants((node, pos) => {
      if (targetPos !== null) return false;
      if (node.attrs?.src === entry.src) {
        targetPos = pos;
        targetNode = node;
        return false;
      }
    });

    if (targetPos !== null && targetNode) {
      const from = Number(targetPos);
      const to = from + Number(targetNode.nodeSize || 1);
      editor.chain().focus().deleteRange({ from, to }).run();
      confirmDeleteId = null;
      localRevision += 1;
    }
  }

  async function handleUploadNewFileSelected(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !editor) return;

    isUploadingNew = true;
    uploadNewError = "";

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let kind: "image" | "video" | "audio" = "image";
      if (file.type.startsWith("video/") || ["mp4", "webm"].includes(ext)) {
        kind = "video";
      } else if (
        file.type.startsWith("audio/") ||
        ["mp3", "ogg", "wav"].includes(ext)
      ) {
        kind = "audio";
      }

      const contentType =
        file.type || (ext === "gif" ? "image/gif" : "image/png");

      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType,
          size: file.size,
        }),
      });

      const signed = (await response.json()) as {
        path?: string;
        token?: string;
        publicUrl?: string;
        error?: string;
      };

      if (!response.ok || !signed.path || !signed.token || !signed.publicUrl) {
        throw new Error(signed.error ?? "Could not prepare upload");
      }

      const { error: uploadErr } = await createClient()
        .storage.from("blog-media")
        .uploadToSignedUrl(signed.path, signed.token, file, { contentType });

      if (uploadErr) throw uploadErr;

      if (kind === "image") {
        editor
          .chain()
          .focus()
          .setImage({
            src: signed.publicUrl,
            alt: file.name.replace(/\.[^.]+$/, ""),
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent({ type: kind, attrs: { src: signed.publicUrl } })
          .run();
      }
      localRevision += 1;
    } catch (err) {
      uploadNewError = err instanceof Error ? err.message : "Upload failed";
      alert(uploadNewError);
    } finally {
      isUploadingNew = false;
      if (uploadNewFileInput) uploadNewFileInput.value = "";
    }
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "Escape") {
      if (editingAltEntry) {
        closeAltModal();
      } else if (confirmDeleteId) {
        confirmDeleteId = null;
      } else if (isOpen) {
        onClose();
      }
    }
  }}
  onclick={(e) => {
    if (confirmDeleteId) {
      const target = e.target as HTMLElement | null;
      if (!target?.closest("[data-delete-popover]")) {
        confirmDeleteId = null;
      }
    }
  }}
/>

{#if isOpen}
  <!-- Backdrop -->
  <button
    type="button"
    class="fixed inset-0 z-40 bg-[#24303e]/45 backdrop-blur-[2px] transition-opacity cursor-default"
    transition:fade={{ duration: 200 }}
    onclick={onClose}
    aria-label="Close media panel"
  ></button>

  <!-- Slide-over Drawer (widened for comfortable editing & inspection) -->
  <div
    class="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[520px] flex-col border-l-2 border-[#d6d5ca] bg-[#f6f1e8] shadow-[-16px_0_48px_rgba(52,66,83,0.18)]"
    transition:fly={{ x: 520, duration: 280 }}
    role="dialog"
    aria-modal="true"
    aria-label="Story media manager"
  >
    <!-- Hidden File Inputs for replace & new upload -->
    <input
      type="file"
      bind:this={replaceFileInput}
      class="hidden"
      onchange={handleReplaceFileSelected}
    />
    <input
      type="file"
      bind:this={uploadNewFileInput}
      class="hidden"
      accept="image/*,video/*,audio/*"
      onchange={handleUploadNewFileSelected}
    />

    <!-- Drawer Header: Clean Title & Close Button Only -->
    <header
      class="flex items-center justify-between border-b border-[#d6d5ca] bg-[#f6f1e8] px-6 py-4.5 shrink-0"
    >
      <h2
        class="text-base font-black tracking-tight text-[#344253] leading-none"
      >
        Story media
      </h2>

      <button
        type="button"
        onclick={onClose}
        class="flex h-9 w-9 items-center justify-center rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/20 hover:text-[#344253] cursor-pointer shadow-xs"
        aria-label="Close media manager"
      >
        <IconClose size={15} strokeWidth={2.5} />
      </button>
    </header>

    <!-- Filter Tabs & Upload Button -->
    <div
      class="flex items-center justify-between gap-3 border-b border-[#d6d5ca] bg-[#fffdf3] px-6 py-3 shrink-0"
    >
      <div
        class="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none py-0.5"
      >
        <button
          type="button"
          onclick={() => (activeFilter = "all")}
          class="rounded-full px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap {activeFilter ===
          'all'
            ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
            : 'border border-[#d6d5ca] bg-[#f6f1e8]/70 text-[#4f5f70] hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
        >
          All ({counts.all})
        </button>
        {#if counts.image > 0}
          <button
            type="button"
            onclick={() => (activeFilter = "image")}
            class="rounded-full px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap {activeFilter ===
            'image'
              ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
              : 'border border-[#d6d5ca] bg-[#f6f1e8]/70 text-[#4f5f70] hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
          >
            Images ({counts.image})
          </button>
        {/if}
        {#if counts.video > 0}
          <button
            type="button"
            onclick={() => (activeFilter = "video")}
            class="rounded-full px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap {activeFilter ===
            'video'
              ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
              : 'border border-[#d6d5ca] bg-[#f6f1e8]/70 text-[#4f5f70] hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
          >
            Videos ({counts.video})
          </button>
        {/if}
        {#if counts.audio > 0}
          <button
            type="button"
            onclick={() => (activeFilter = "audio")}
            class="rounded-full px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap {activeFilter ===
            'audio'
              ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
              : 'border border-[#d6d5ca] bg-[#f6f1e8]/70 text-[#4f5f70] hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
          >
            Audio ({counts.audio})
          </button>
        {/if}
        {#if counts.youtube > 0}
          <button
            type="button"
            onclick={() => (activeFilter = "youtube")}
            class="rounded-full px-3 py-1.5 transition-all cursor-pointer whitespace-nowrap {activeFilter ===
            'youtube'
              ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
              : 'border border-[#d6d5ca] bg-[#f6f1e8]/70 text-[#4f5f70] hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
          >
            YouTube ({counts.youtube})
          </button>
        {/if}
      </div>

      <button
        type="button"
        onclick={() => uploadNewFileInput?.click()}
        disabled={isUploadingNew}
        class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#344253] px-3.5 py-1.5 text-xs font-black text-[#fffdf3] transition-all hover:bg-[#4f5f70] cursor-pointer shadow-xs disabled:opacity-50"
      >
        {#if isUploadingNew}
          <IconReload size={12} class="animate-spin text-[#fffdf3]" />
          <span>Uploading…</span>
        {:else}
          <IconPlus size={13} strokeWidth={2.6} />
          <span>Add media</span>
        {/if}
      </button>
    </div>

    <!-- Scrollable Media Cards List -->
    <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#f6f1e8]/50">
      {#if filteredList.length === 0}
        <div
          class="flex flex-col items-center justify-center py-20 text-center px-6"
        >
          <div
            class="flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-[#d6d5ca] bg-[#fffdf3] text-[#4f5f70]/60 mb-4 shadow-xs"
          >
            <IconMedia size={32} strokeWidth={2.2} />
          </div>
          <p class="text-base font-black text-[#344253]">
            No media in this view
          </p>
          <p
            class="text-xs font-bold text-[#627383] mt-1.5 max-w-[260px] leading-relaxed"
          >
            Upload or paste images, videos, audio, or YouTube embeds into your
            story.
          </p>
          <button
            type="button"
            onclick={() => uploadNewFileInput?.click()}
            class="mt-5 inline-flex items-center gap-2 rounded-full bg-[#344253] px-5 py-2.5 text-xs font-black text-[#fffdf3] transition-all hover:bg-[#4f5f70] cursor-pointer shadow-xs"
          >
            <IconPlus size={13} strokeWidth={2.6} />
            <span>Upload media</span>
          </button>
        </div>
      {:else}
        {#each filteredList as item (item.id)}
          <div
            class="group relative flex flex-col gap-3 rounded-2xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-4 transition-all hover:border-[#8fb8d8] hover:shadow-[0_8px_24px_rgba(52,66,83,0.10)] shadow-xs"
          >
            <!-- Card Main Row (Square Thumbnail + Metadata with Ellipsis) -->
            <div class="flex items-center gap-3.5 sm:gap-4">
              <!-- Square Thumbnail Preview -->
              <div
                class="relative h-[92px] w-[92px] sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#d6d5ca] bg-[#f6f1e8] flex items-center justify-center shadow-xs aspect-square"
              >
                {#if item.kind === "image"}
                  <img
                    src={item.src}
                    alt={item.alt || item.filename}
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                {:else if item.kind === "youtube"}
                  {@const ytThumb = getYouTubeThumbnail(item.src)}
                  {#if ytThumb}
                    <img
                      src={ytThumb}
                      alt="YouTube thumbnail"
                      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  {/if}
                  <div
                    class="absolute inset-0 flex items-center justify-center bg-black/30"
                  >
                    <span
                      class="rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white shadow-xs"
                    >
                      YT
                    </span>
                  </div>
                {:else if item.kind === "video"}
                  <div
                    class="flex h-full w-full flex-col items-center justify-center bg-[#344253] text-[#fffdf3] gap-1 p-2"
                  >
                    <IconVideo size={24} strokeWidth={2.2} />
                    <span
                      class="text-[9px] font-black uppercase tracking-wider text-[#b8d4f0]"
                    >
                      Video
                    </span>
                  </div>
                {:else if item.kind === "audio"}
                  <div
                    class="flex h-full w-full flex-col items-center justify-center bg-[#8fb8d8]/25 text-[#344253] gap-1 p-2"
                  >
                    <IconSound size={24} strokeWidth={2.2} />
                    <span
                      class="text-[9px] font-black uppercase tracking-wider text-[#4f5f70]"
                    >
                      Audio
                    </span>
                  </div>
                {/if}
              </div>

              <!-- Metadata & Details Column (Filename, Badges, Alt Button with Ellipsis) -->
              <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <!-- Filename (Truncated with Ellipsis) -->
                <p
                  class="truncate text-sm sm:text-[15px] font-black text-[#344253] leading-snug"
                  title={item.filename}
                >
                  {item.filename}
                </p>

                <!-- Attribute Badges -->
                <div
                  class="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold"
                >
                  <span
                    class="rounded-full border border-[#8fb8d8]/60 bg-[#8fb8d8]/25 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#344253]"
                  >
                    {item.kind}
                  </span>
                  <span
                    class="rounded-full border border-[#d6d5ca] bg-[#f6f1e8] px-2.5 py-0.5 text-[10px] font-bold text-[#4f5f70]"
                  >
                    {item.mediaWidth}% width
                  </span>
                  {#if item.mediaLayout !== "standalone"}
                    <span
                      class="rounded-full border border-[#d6d5ca] bg-[#f6f1e8] px-2.5 py-0.5 text-[10px] font-bold capitalize text-[#4f5f70]"
                    >
                      {item.mediaLayout}
                    </span>
                  {/if}
                </div>

                <!-- Alt Text Button / Pill (Truncated with Ellipsis, Opens Alt Dialog) -->
                <button
                  type="button"
                  onclick={() => openAltModal(item)}
                  class="mt-1.5 flex w-full items-center justify-between gap-1.5 rounded-xl border border-[#d6d5ca] bg-[#f6f1e8]/60 px-2.5 py-1 text-left text-xs transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 cursor-pointer group/alt shadow-2xs"
                  title={item.alt
                    ? `Edit alt: ${item.alt}`
                    : "Add alt text description"}
                >
                  <div class="flex items-center gap-1.5 min-w-0 flex-1">
                    <span class="font-black text-[#4f5f70] shrink-0">Alt:</span>
                    {#if item.alt}
                      <span
                        class="truncate font-medium text-[#627383] group-hover/alt:text-[#344253]"
                      >
                        {item.alt}
                      </span>
                    {:else}
                      <span
                        class="truncate italic text-[#8a98a5] group-hover/alt:text-[#4f5f70]"
                      >
                        + Add alt description…
                      </span>
                    {/if}
                  </div>

                  <span
                    class="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md text-[#4f5f70]/60 transition-colors group-hover/alt:bg-[#8fb8d8]/30 group-hover/alt:text-[#344253]"
                    aria-hidden="true"
                  >
                    <IconEdit size={11} strokeWidth={2.4} />
                  </span>
                </button>
              </div>
            </div>

            <!-- Card Action Buttons Row -->
            <div
              class="flex items-center justify-between border-t border-[#d6d5ca]/80 pt-2.5 gap-2 flex-wrap"
            >
              <!-- Go to button (Ir) -->
              <button
                type="button"
                onclick={() => goToMedia(item)}
                class="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#344253] px-3.5 text-xs font-black text-[#fffdf3] transition-all hover:bg-[#4f5f70] cursor-pointer shadow-xs"
                title="Scroll and highlight in story"
              >
                <IconArrow direction="right" size={11} strokeWidth={2.4} />
                <span>Go to</span>
              </button>

              <!-- Replace button (Reemplazar) -->
              <button
                type="button"
                onclick={() => startReplace(item)}
                disabled={isReplacing && replacingEntry?.id === item.id}
                class="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-3 text-xs font-bold text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 hover:text-[#344253] cursor-pointer disabled:opacity-50"
                title="Replace media asset"
              >
                <IconReload
                  size={12}
                  class={isReplacing && replacingEntry?.id === item.id
                    ? "animate-spin"
                    : ""}
                />
                <span>Replace</span>
              </button>

              <!-- Copy URL button (Consultar / Copiar) -->
              <button
                type="button"
                onclick={() => copyUrl(item)}
                class="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-3 text-xs font-bold text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 hover:text-[#344253] cursor-pointer"
                title="Copy public URL"
              >
                {#if copiedId === item.id}
                  <IconCheck size={12} strokeWidth={3} class="text-[#2d714b]" />
                  <span class="text-[#2d714b] font-black">Copied</span>
                {:else}
                  <IconCopy size={12} />
                  <span>Copy</span>
                {/if}
              </button>

              <!-- Open in new tab -->
              <a
                href={item.src}
                target="_blank"
                rel="noreferrer"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] text-[#4f5f70] transition-all hover:border-[#8fb8d8] hover:bg-[#8fb8d8]/15 hover:text-[#344253] cursor-pointer"
                title="Open asset in new tab"
              >
                <IconExternal size={12} />
              </a>

              <!-- Delete button with Floating Popover (Layout of buttons never changes) -->
              <div
                class="relative inline-flex items-center ml-auto"
                data-delete-popover
              >
                <button
                  type="button"
                  onclick={() => {
                    confirmDeleteId =
                      confirmDeleteId === item.id ? null : item.id;
                  }}
                  class="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer {confirmDeleteId ===
                  item.id
                    ? 'bg-[#8b4b50] text-[#fffdf3] shadow-xs'
                    : 'text-[#8b4b50]/75 hover:bg-[#8b4b50]/15 hover:text-[#8b4b50]'}"
                  title="Remove from story"
                  aria-label="Remove from story"
                >
                  <IconTrash size={14} strokeWidth={2.4} />
                </button>

                {#if confirmDeleteId === item.id}
                  <!-- Floating Popover Anchored Above Trash Icon -->
                  <div
                    class="absolute bottom-full right-0 mb-2.5 z-30 flex items-center gap-2 rounded-2xl border-2 border-[#d6d5ca] bg-[#fffdf3] px-3 py-2 shadow-[-4px_8px_24px_rgba(52,66,83,0.18)] whitespace-nowrap"
                    transition:fade={{ duration: 120 }}
                    role="alertdialog"
                    aria-label="Confirm asset deletion"
                  >
                    <span class="text-xs font-bold text-[#344253]">Delete?</span
                    >
                    <button
                      type="button"
                      onclick={() => deleteEntry(item)}
                      class="h-7 rounded-full bg-[#8b4b50] px-3 text-xs font-black text-[#fffdf3] transition-colors hover:bg-[#723c40] cursor-pointer shadow-xs"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onclick={() => (confirmDeleteId = null)}
                      class="h-7 rounded-full border border-[#4f5f70]/25 bg-[#fffdf3] px-2.5 text-xs font-bold text-[#4f5f70] hover:bg-[#4f5f70]/10 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <!-- Downward pointing tail -->
                    <div
                      class="absolute -bottom-1.5 right-3 h-3 w-3 rotate-45 border-r-2 border-b-2 border-[#d6d5ca] bg-[#fffdf3]"
                    ></div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}

<!-- Modal Dialog for Editing Alt Text (Matching the URL loader dialog aesthetic) -->
{#if editingAltEntry}
  <button
    type="button"
    class="fixed inset-0 z-60 bg-[#24303e]/45 backdrop-blur-[2px] transition-opacity cursor-default"
    transition:fade={{ duration: 150 }}
    onclick={closeAltModal}
    aria-label="Close dialog"
  ></button>

  <div
    class="fixed top-1/2 left-1/2 z-60 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-5 sm:p-6 shadow-[0_20px_50px_rgba(52,66,83,0.22)]"
    transition:fly={{ y: -10, duration: 200 }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="alt-modal-title"
  >
    <form onsubmit={saveAltModal} class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3
          id="alt-modal-title"
          class="text-base font-black tracking-tight text-[#344253]"
        >
          Description (Alt text)
        </h3>
        <button
          type="button"
          onclick={closeAltModal}
          class="flex h-8 w-8 items-center justify-center rounded-full text-[#4f5f70]/70 transition-colors hover:bg-[#4f5f70]/10 hover:text-[#4f5f70] cursor-pointer"
          aria-label="Close dialog"
        >
          <IconClose size={15} strokeWidth={2.5} />
        </button>
      </div>

      <div class="flex flex-col gap-1.5 text-left">
        <label
          for="alt-modal-input"
          class="text-xs font-black uppercase tracking-wider text-[#607182]"
        >
          Alternative Text
        </label>
        <p class="text-xs text-[#8a98a5] font-medium leading-relaxed">
          Provides description for screen readers and search engines when media
          cannot be displayed.
        </p>
        <input
          id="alt-modal-input"
          type="text"
          bind:value={altDraft}
          placeholder="e.g. Character illustration in pixel art style"
          class="mt-1 h-11 w-full rounded-xl border-2 border-[#d6d5ca] bg-[#f6f1e8]/50 px-3.5 text-sm font-semibold text-[#344253] outline-none transition-all placeholder:text-[#9aa3aa] focus:border-[#4f5f70] focus:bg-[#fffdf3] focus:ring-2 focus:ring-[#8fb8d8]/30"
        />
      </div>

      <div
        class="mt-1 flex items-center justify-end gap-2.5 pt-3 border-t border-[#d6d5ca]/60"
      >
        <button
          type="button"
          onclick={closeAltModal}
          class="inline-flex h-9 items-center justify-center rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] px-4 text-xs font-bold text-[#4f5f70] hover:bg-[#8fb8d8]/15 hover:border-[#8fb8d8] transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-full bg-[#344253] px-5 text-xs font-black text-[#fffdf3] shadow-[0_2px_10px_rgba(52,66,83,0.2)] hover:bg-[#4f5f70] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          Save Alt
        </button>
      </div>
    </form>
  </div>
{/if}
