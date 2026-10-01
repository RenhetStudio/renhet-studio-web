<script lang="ts">
  import { onMount } from "svelte";
  import { Editor, Extension, Node, mergeAttributes, type JSONContent } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Link from "@tiptap/extension-link";
  import Image from "@tiptap/extension-image";
  import Youtube from "@tiptap/extension-youtube";
  import Underline from "@tiptap/extension-underline";
  import TextAlign from "@tiptap/extension-text-align";
  import Placeholder from "@tiptap/extension-placeholder";
  import CharacterCount from "@tiptap/extension-character-count";
  import Highlight from "@tiptap/extension-highlight";
  import TaskList from "@tiptap/extension-task-list";
  import TaskItem from "@tiptap/extension-task-item";
  import { Table } from "@tiptap/extension-table";
  import TableRow from "@tiptap/extension-table-row";
  import TableHeader from "@tiptap/extension-table-header";
  import TableCell from "@tiptap/extension-table-cell";
  import Typography from "@tiptap/extension-typography";
  import { createClient } from "$lib/supabase/client";

  let { value = $bindable() }: { value: JSONContent } = $props();
  let editorElement: HTMLDivElement;
  let editor = $state<Editor | null>(null);
  let revision = $state(0);
  let uploading = $state<"image" | "video" | "audio" | null>(null);
  let uploadError = $state("");

  const CspTextAlign = TextAlign.extend({ addGlobalAttributes() { return [{ types: this.options.types, attributes: { textAlign: { default: this.options.defaultAlignment, parseHTML: (element) => { const alignment = element.getAttribute("data-text-align") || element.style.textAlign; return this.options.alignments.includes(alignment) ? alignment : this.options.defaultAlignment; }, renderHTML: (attributes) => attributes.textAlign ? { "data-text-align": attributes.textAlign } : {} } } }]; } });
  const CspTable = Table.extend({ renderHTML({ HTMLAttributes }) { const attributes = { ...HTMLAttributes }; delete attributes.style; return ["table", mergeAttributes(this.options.HTMLAttributes, attributes), ["tbody", 0]]; } });
  const CspTableCell = TableCell.extend({ renderHTML({ HTMLAttributes }) { const attributes = { ...HTMLAttributes }; delete attributes.style; return ["td", mergeAttributes(this.options.HTMLAttributes, attributes), 0]; } });
  const CspTableHeader = TableHeader.extend({ renderHTML({ HTMLAttributes }) { const attributes = { ...HTMLAttributes }; delete attributes.style; return ["th", mergeAttributes(this.options.HTMLAttributes, attributes), 0]; } });
  const AudioNode = Node.create({ name: "audio", group: "block", atom: true, draggable: true, addAttributes: () => ({ src: { default: null } }), parseHTML: () => [{ tag: "audio[src]" }], renderHTML: ({ HTMLAttributes }) => ["audio", mergeAttributes(HTMLAttributes, { controls: "true" })] });
  const VideoNode = Node.create({ name: "video", group: "block", atom: true, draggable: true, addAttributes: () => ({ src: { default: null } }), parseHTML: () => [{ tag: "video[src]" }], renderHTML: ({ HTMLAttributes }) => ["video", mergeAttributes(HTMLAttributes, { controls: "true" })] });
  const SectionGapNode = Node.create({ name: "sectionGap", group: "block", atom: true, draggable: true, addAttributes: () => ({ size: { default: "medium", parseHTML: (element) => ["small", "medium", "large"].includes(element.getAttribute("data-gap-size") ?? "") ? element.getAttribute("data-gap-size") : "medium", renderHTML: (attributes) => ({ "data-gap-size": ["small", "medium", "large"].includes(String(attributes.size)) ? attributes.size : "medium" }) } }), parseHTML: () => [{ tag: "div[data-section-gap]" }], renderHTML: ({ HTMLAttributes }) => ["div", mergeAttributes(HTMLAttributes, { "data-section-gap": "", role: "separator", "aria-label": "Section gap" })] });
  const ResizableMedia = Extension.create({ name: "resizableMedia", addGlobalAttributes() { return [{ types: ["image", "video", "audio", "youtube"], attributes: { mediaWidth: { default: 100, parseHTML: (element) => Math.min(100, Math.max(10, Math.round((Number(element.getAttribute("data-media-width")) || 100) / 5) * 5)), renderHTML: (attributes) => ({ "data-media-width": Math.min(100, Math.max(10, Math.round((Number(attributes.mediaWidth) || 100) / 5) * 5)) }) }, mediaLayout: { default: "standalone", parseHTML: (element) => element.getAttribute("data-media-layout") || "standalone", renderHTML: (attributes) => ({ "data-media-layout": attributes.mediaLayout }) } } }]; } });

  onMount(() => {
    editor = new Editor({ element: editorElement, extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }), Image.configure({ allowBase64: false }), Youtube.configure({ controls: true, nocookie: true }), Underline, CspTextAlign.configure({ types: ["heading", "paragraph"] }), Placeholder.configure({ placeholder: ({ node }) => node.type.name === "heading" ? "Write a clear section heading" : "Start writing, paste text, or use the toolbar to add media." }), CharacterCount.configure({ limit: 50000 }), Highlight, TaskList, TaskItem.configure({ nested: true }), CspTable, TableRow, CspTableHeader, CspTableCell, Typography, AudioNode, VideoNode, SectionGapNode, ResizableMedia], content: value, onUpdate: ({ editor }) => { value = editor.getJSON(); revision += 1; }, onSelectionUpdate: () => { revision += 1; }, editorProps: { attributes: { class: "editor-prose", spellcheck: "true", "aria-label": "Post body" } } });
    return () => editor?.destroy();
  });

  const normalizeUrl = (input: string) => { const trimmed = input.trim(); if (!trimmed) return ""; if (/^mailto:/i.test(trimmed) || /^https:\/\//i.test(trimmed)) return trimmed; if (/^http:\/\//i.test(trimmed)) return trimmed.replace(/^http:\/\//i, "https://"); return `https://${trimmed}`; };
  const active = (name: string, attrs?: Record<string, unknown>) => { void revision; return editor?.isActive(name, attrs) ?? false; };
  const run = (operation: (editor: Editor) => void) => { if (editor) operation(editor); };
  function promptLink() { if (!editor) return; const href = prompt("Paste a link URL", String(editor.getAttributes("link").href ?? "https://")); if (href === null) return; if (href.trim()) editor.chain().focus().extendMarkRange("link").setLink({ href: normalizeUrl(href) }).run(); else editor.chain().focus().extendMarkRange("link").unsetLink().run(); }
  function promptMedia(kind: "image" | "video" | "audio" | "youtube") { if (!editor) return; const source = prompt(`Paste an HTTPS ${kind} URL`); if (!source) return; const src = normalizeUrl(source); if (kind === "image") editor.chain().focus().setImage({ src, alt: prompt("Short image description", "") ?? "" }).run(); else if (kind === "youtube") editor.commands.setYoutubeVideo({ src, width: 1280, height: 720 }); else editor.chain().focus().insertContent({ type: kind, attrs: { src } }).run(); }
  async function upload(file: File, kind: "image" | "video" | "audio") { uploading = kind; uploadError = ""; try { const response = await fetch("/api/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }) }); const signed = await response.json() as { path?: string; token?: string; publicUrl?: string; error?: string }; if (!response.ok || !signed.path || !signed.token || !signed.publicUrl) throw new Error(signed.error ?? "Could not prepare upload"); const { error } = await createClient().storage.from("blog-media").uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type }); if (error) throw error; if (kind === "image") editor?.chain().focus().setImage({ src: signed.publicUrl, alt: file.name.replace(/\.[^.]+$/, "") }).run(); else editor?.chain().focus().insertContent({ type: kind, attrs: { src: signed.publicUrl } }).run(); } catch (error) { uploadError = error instanceof Error ? error.message : "Upload failed"; } finally { uploading = null; } }
  function updateMedia(attributes: { mediaWidth?: number; mediaLayout?: string }) { if (!editor) return; const type = (["image", "video", "audio", "youtube"] as const).find((item) => editor?.isActive(item)); if (type) editor.chain().focus().updateAttributes(type, attributes).run(); }
  const selectedMedia = $derived(((["image", "video", "audio", "youtube"] as const).find((type) => { void revision; return editor?.isActive(type); })));
  const mediaWidth = $derived(selectedMedia && editor ? Number(editor.getAttributes(selectedMedia).mediaWidth) || 100 : 100);
</script>

<div class="rich-editor">
  {#if editor}
    <div class="editor-toolbar" role="toolbar" aria-label="Post formatting">
      <div class="editor-toolbar-row">
        <div class="editor-toolbar-group" aria-label="History"><button type="button" onclick={() => run((e) => e.chain().focus().undo().run())}>Undo</button><button type="button" onclick={() => run((e) => e.chain().focus().redo().run())}>Redo</button></div>
        <div class="editor-toolbar-group" aria-label="Text style"><button type="button" class:is-active={active("paragraph")} onclick={() => run((e) => e.chain().focus().setParagraph().run())}>Text</button><button type="button" class:is-active={active("heading", { level: 1 })} onclick={() => run((e) => e.chain().focus().toggleHeading({ level: 1 }).run())}>H1</button><button type="button" class:is-active={active("heading", { level: 2 })} onclick={() => run((e) => e.chain().focus().toggleHeading({ level: 2 }).run())}>H2</button><button type="button" class:is-active={active("heading", { level: 3 })} onclick={() => run((e) => e.chain().focus().toggleHeading({ level: 3 }).run())}>H3</button><button type="button" class:is-active={active("blockquote")} onclick={() => run((e) => e.chain().focus().toggleBlockquote().run())}>Quote</button></div>
        <div class="editor-toolbar-group" aria-label="Inline formatting"><button type="button" class:is-active={active("bold")} onclick={() => run((e) => e.chain().focus().toggleBold().run())}>B</button><button type="button" class:is-active={active("italic")} onclick={() => run((e) => e.chain().focus().toggleItalic().run())}>I</button><button type="button" class:is-active={active("underline")} onclick={() => run((e) => e.chain().focus().toggleUnderline().run())}>U</button><button type="button" class:is-active={active("strike")} onclick={() => run((e) => e.chain().focus().toggleStrike().run())}>S</button><button type="button" class:is-active={active("code")} onclick={() => run((e) => e.chain().focus().toggleCode().run())}>Code</button><button type="button" class:is-active={active("highlight")} onclick={() => run((e) => e.chain().focus().toggleHighlight().run())}>Mark</button></div>
        <div class="editor-toolbar-group" aria-label="Alignment">{#each ["left", "center", "right", "justify"] as alignment}<button type="button" class:is-active={active("paragraph", { textAlign: alignment }) || active("heading", { textAlign: alignment })} onclick={() => run((e) => e.chain().focus().setTextAlign(alignment).run())}>{alignment}</button>{/each}</div>
      </div>
      <div class="editor-toolbar-row">
        <div class="editor-toolbar-group" aria-label="Structure"><button type="button" onclick={() => run((e) => e.chain().focus().toggleBulletList().run())}>Bullets</button><button type="button" onclick={() => run((e) => e.chain().focus().toggleOrderedList().run())}>Numbers</button><button type="button" onclick={() => run((e) => e.chain().focus().toggleTaskList().run())}>Checklist</button><button type="button" onclick={() => run((e) => e.chain().focus().setHorizontalRule().run())}>Rule</button>{#each ["small", "medium", "large"] as size}<button type="button" onclick={() => run((e) => e.chain().focus().insertContent([{ type: "sectionGap", attrs: { size } }, { type: "paragraph" }]).run())}>Gap {size[0].toUpperCase()}</button>{/each}</div>
        <div class="editor-toolbar-group" aria-label="Links and media"><button type="button" onclick={promptLink}>Link</button><button type="button" onclick={() => run((e) => e.chain().focus().unsetLink().run())}>Unlink</button>{#each ["image", "youtube", "video", "audio"] as kind}<button type="button" onclick={() => promptMedia(kind as "image" | "video" | "audio" | "youtube")}>{kind} URL</button>{/each}{#each ["image", "video", "audio"] as kind}<label class="editor-upload">{uploading === kind ? "Uploading…" : `Upload ${kind}`}<input type="file" accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/gif" : `${kind}/*`} disabled={Boolean(uploading)} onchange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void upload(file, kind as "image" | "video" | "audio"); event.currentTarget.value = ""; }} /></label>{/each}</div>
        <div class="editor-toolbar-group" aria-label="Media layout"><button type="button" disabled={!selectedMedia} onclick={() => updateMedia({ mediaLayout: "left" })}>Wrap left</button><button type="button" disabled={!selectedMedia} onclick={() => updateMedia({ mediaLayout: "row", mediaWidth: Math.min(mediaWidth, 50) })}>Row</button><button type="button" disabled={!selectedMedia} onclick={() => updateMedia({ mediaLayout: "standalone" })}>No wrap</button><button type="button" disabled={!selectedMedia} onclick={() => updateMedia({ mediaLayout: "right" })}>Wrap right</button><label class="editor-media-size"><span class="editor-media-label">Width</span><span class="editor-range-control"><input type="range" min="10" max="100" step="5" value={mediaWidth} disabled={!selectedMedia} onchange={(event) => updateMedia({ mediaWidth: Number(event.currentTarget.value) })} /></span><span>{mediaWidth}%</span></label></div>
        <div class="editor-toolbar-group" aria-label="Tables"><button type="button" onclick={() => run((e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>Table</button><button type="button" disabled={!active("table")} onclick={() => run((e) => e.chain().focus().addRowAfter().run())}>+ Row</button><button type="button" disabled={!active("table")} onclick={() => run((e) => e.chain().focus().addColumnAfter().run())}>+ Col</button><button type="button" disabled={!active("table")} onclick={() => run((e) => e.chain().focus().deleteTable().run())}>Del table</button></div>
      </div>
    </div>
  {/if}
  <div class="editor-document-wrap"><div bind:this={editorElement}></div></div>
  {#if editor}<div class="editor-footer-bar" aria-live="polite"><span>{editor.storage.characterCount.words()} words</span><span>{editor.storage.characterCount.characters()} characters</span><span>{Math.max(1, Math.ceil(editor.storage.characterCount.words() / 220))} min read</span></div>{/if}
  {#if uploadError}<p class="form-error editor-error" role="alert">{uploadError}</p>{/if}
</div>
