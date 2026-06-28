"use client";

import { useState } from "react";
import { Extension, Node, mergeAttributes, type JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
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
import { createClient } from "@/lib/supabase/client";

const AudioNode = Node.create({
  name: "audio",
  group: "block",
  atom: true,
  addAttributes: () => ({ src: { default: null } }),
  parseHTML: () => [{ tag: "audio[src]" }],
  renderHTML: ({ HTMLAttributes }) => ["audio", mergeAttributes(HTMLAttributes, { controls: "true" })],
});

const VideoNode = Node.create({
  name: "video",
  group: "block",
  atom: true,
  addAttributes: () => ({ src: { default: null } }),
  parseHTML: () => [{ tag: "video[src]" }],
  renderHTML: ({ HTMLAttributes }) => ["video", mergeAttributes(HTMLAttributes, { controls: "true" })],
});

const ResizableMedia = Extension.create({
  name: "resizableMedia",
  addGlobalAttributes() {
    return [{
      types: ["image", "video", "audio", "youtube"],
      attributes: {
        mediaWidth: {
          default: 100,
          parseHTML: (element) => Number(element.getAttribute("data-media-width")) || 100,
          renderHTML: (attributes) => ({ "data-media-width": attributes.mediaWidth }),
        },
      },
    }];
  },
});

type MediaKind = "image" | "video" | "audio";
type BlockStyle = "paragraph" | "h1" | "h2" | "h3" | "quote" | "code";

async function uploadMedia(file: File) {
  const response = await fetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
  });
  const signed = (await response.json()) as { path?: string; token?: string; publicUrl?: string; error?: string };
  if (!response.ok || !signed.path || !signed.token || !signed.publicUrl) {
    throw new Error(signed.error ?? "Could not prepare upload");
  }
  const supabase = createClient();
  const { error } = await supabase.storage.from("blog-media").uploadToSignedUrl(signed.path, signed.token, file, {
    contentType: file.type,
  });
  if (error) throw error;
  return signed.publicUrl;
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^http:\/\//i.test(trimmed)) return trimmed.replace(/^http:\/\//i, "https://");
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function readTime(words: number) {
  return Math.max(1, Math.ceil(words / 220));
}

function ToolbarGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="editor-toolbar-group" aria-label={label}>
      {children}
    </div>
  );
}

function ToolButton({
  label,
  title,
  active,
  disabled,
  onClick,
}: {
  label: string;
  title?: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "is-active" : undefined}
      aria-pressed={active}
      title={title ?? label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function RichEditor({ value, onChange }: { value: JSONContent; onChange: (value: JSONContent) => void }) {
  const [uploading, setUploading] = useState<MediaKind | null>(null);
  const [error, setError] = useState("");
  const [, refreshToolbar] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      Image.configure({ allowBase64: false }),
      Youtube.configure({ controls: true, nocookie: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading"
            ? "Write a clear section heading"
            : "Start writing, paste text, or use the toolbar to add media.",
      }),
      CharacterCount.configure({ limit: 50000 }),
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      AudioNode,
      VideoNode,
      ResizableMedia,
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON());
      refreshToolbar((revision) => revision + 1);
    },
    onSelectionUpdate: () => refreshToolbar((revision) => revision + 1),
    editorProps: {
      attributes: {
        class: "editor-prose",
        spellcheck: "true",
        "aria-label": "Post body",
      },
    },
  });

  if (!editor) return <div className="editor-loading">Loading editor...</div>;
  const activeEditor = editor;
  const words = activeEditor.storage.characterCount.words() as number;
  const stats = {
    words,
    characters: activeEditor.storage.characterCount.characters() as number,
    minutes: readTime(words),
  };
  const inTable = activeEditor.isActive("table");
  const canUndo = activeEditor.can().undo();
  const canRedo = activeEditor.can().redo();
  const selectedMedia = (["image", "video", "audio", "youtube"] as const).find((type) => activeEditor.isActive(type));
  const selectedMediaWidth = selectedMedia
    ? Number(activeEditor.getAttributes(selectedMedia).mediaWidth) || 100
    : 100;

  const blockStyle: BlockStyle = activeEditor.isActive("heading", { level: 1 })
    ? "h1"
    : activeEditor.isActive("heading", { level: 2 })
      ? "h2"
      : activeEditor.isActive("heading", { level: 3 })
        ? "h3"
        : activeEditor.isActive("blockquote")
          ? "quote"
          : activeEditor.isActive("codeBlock")
            ? "code"
            : "paragraph";

  async function handleFile(file: File, kind: MediaKind) {
    setUploading(kind);
    setError("");
    try {
      const url = await uploadMedia(file);
      if (kind === "image") {
        activeEditor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
      }
      if (kind === "video") activeEditor.chain().focus().insertContent({ type: "video", attrs: { src: url } }).run();
      if (kind === "audio") activeEditor.chain().focus().insertContent({ type: "audio", attrs: { src: url } }).run();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function applyBlockStyle(nextStyle: BlockStyle) {
    const chain = activeEditor.chain().focus();
    if (nextStyle === "paragraph") chain.setParagraph().run();
    if (nextStyle === "h1") chain.toggleHeading({ level: 1 }).run();
    if (nextStyle === "h2") chain.toggleHeading({ level: 2 }).run();
    if (nextStyle === "h3") chain.toggleHeading({ level: 3 }).run();
    if (nextStyle === "quote") chain.toggleBlockquote().run();
    if (nextStyle === "code") chain.toggleCodeBlock().run();
  }

  function addLink() {
    const previous = activeEditor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Paste a link URL", previous ?? "https://");
    if (href === null) return;
    if (!href.trim()) activeEditor.chain().focus().extendMarkRange("link").unsetLink().run();
    else activeEditor.chain().focus().extendMarkRange("link").setLink({ href: normalizeUrl(href) }).run();
  }

  function addImageUrl() {
    const src = window.prompt("Paste an HTTPS image URL");
    if (!src) return;
    const alt = window.prompt("Short image description", "") ?? "";
    activeEditor.chain().focus().setImage({ src: normalizeUrl(src), alt }).run();
  }

  function addYoutube() {
    const src = window.prompt("Paste a YouTube URL");
    if (src) activeEditor.commands.setYoutubeVideo({ src: normalizeUrl(src), width: 1280, height: 720 });
  }

  function addMediaUrl(kind: "video" | "audio") {
    const src = window.prompt(`Paste an HTTPS ${kind} URL`);
    if (src) activeEditor.chain().focus().insertContent({ type: kind, attrs: { src: normalizeUrl(src) } }).run();
  }

  return (
    <div className="rich-editor">
      <div className="editor-toolbar" role="toolbar" aria-label="Post formatting">
        <div className="editor-toolbar-row">
          <ToolbarGroup label="Document history">
            <ToolButton label="Undo" title="Undo" disabled={!canUndo} onClick={() => activeEditor.chain().focus().undo().run()} />
            <ToolButton label="Redo" title="Redo" disabled={!canRedo} onClick={() => activeEditor.chain().focus().redo().run()} />
          </ToolbarGroup>

          <ToolbarGroup label="Text style">
            <label className="editor-style-select">
              <span className="sr-only">Text style</span>
              <select value={blockStyle} onChange={(event) => applyBlockStyle(event.target.value as BlockStyle)}>
                <option value="paragraph">Normal text</option>
                <option value="h1">Title heading</option>
                <option value="h2">Section heading</option>
                <option value="h3">Small heading</option>
                <option value="quote">Quote</option>
                <option value="code">Code block</option>
              </select>
            </label>
          </ToolbarGroup>

          <ToolbarGroup label="Inline formatting">
            <ToolButton label="B" title="Bold" active={activeEditor.isActive("bold")} onClick={() => activeEditor.chain().focus().toggleBold().run()} />
            <ToolButton label="I" title="Italic" active={activeEditor.isActive("italic")} onClick={() => activeEditor.chain().focus().toggleItalic().run()} />
            <ToolButton label="U" title="Underline" active={activeEditor.isActive("underline")} onClick={() => activeEditor.chain().focus().toggleUnderline().run()} />
            <ToolButton label="S" title="Strikethrough" active={activeEditor.isActive("strike")} onClick={() => activeEditor.chain().focus().toggleStrike().run()} />
            <ToolButton label="Code" active={activeEditor.isActive("code")} onClick={() => activeEditor.chain().focus().toggleCode().run()} />
            <ToolButton label="Mark" title="Highlight" active={activeEditor.isActive("highlight")} onClick={() => activeEditor.chain().focus().toggleHighlight().run()} />
          </ToolbarGroup>

          <ToolbarGroup label="Paragraph alignment">
            <ToolButton label="Left" active={activeEditor.isActive({ textAlign: "left" })} onClick={() => activeEditor.chain().focus().setTextAlign("left").run()} />
            <ToolButton label="Center" active={activeEditor.isActive({ textAlign: "center" })} onClick={() => activeEditor.chain().focus().setTextAlign("center").run()} />
            <ToolButton label="Right" active={activeEditor.isActive({ textAlign: "right" })} onClick={() => activeEditor.chain().focus().setTextAlign("right").run()} />
            <ToolButton label="Justify" active={activeEditor.isActive({ textAlign: "justify" })} onClick={() => activeEditor.chain().focus().setTextAlign("justify").run()} />
          </ToolbarGroup>
        </div>

        <div className="editor-toolbar-row">
          <ToolbarGroup label="Lists and structure">
            <ToolButton label="Bullets" active={activeEditor.isActive("bulletList")} onClick={() => activeEditor.chain().focus().toggleBulletList().run()} />
            <ToolButton label="Numbers" active={activeEditor.isActive("orderedList")} onClick={() => activeEditor.chain().focus().toggleOrderedList().run()} />
            <ToolButton label="Checklist" active={activeEditor.isActive("taskList")} onClick={() => activeEditor.chain().focus().toggleTaskList().run()} />
            <ToolButton label="Rule" title="Horizontal rule" onClick={() => activeEditor.chain().focus().setHorizontalRule().run()} />
          </ToolbarGroup>

          <ToolbarGroup label="Links and media">
            <ToolButton label="Link" active={activeEditor.isActive("link")} onClick={addLink} />
            <ToolButton label="Unlink" disabled={!activeEditor.isActive("link")} onClick={() => activeEditor.chain().focus().unsetLink().run()} />
            <ToolButton label="Image URL" onClick={addImageUrl} />
            <ToolButton label="YouTube" onClick={addYoutube} />
            <ToolButton label="Video URL" onClick={() => addMediaUrl("video")} />
            <ToolButton label="Audio URL" onClick={() => addMediaUrl("audio")} />
            {(["image", "video", "audio"] as MediaKind[]).map((kind) => (
              <label className="editor-upload" key={kind}>
                {uploading === kind ? "Uploading..." : `Upload ${kind}`}
                <input
                  type="file"
                  accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/gif" : `${kind}/*`}
                  disabled={Boolean(uploading)}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleFile(file, kind);
                    event.target.value = "";
                  }}
                />
              </label>
            ))}
          </ToolbarGroup>

          <ToolbarGroup label="Selected media size">
            {([25, 50, 75, 100] as const).map((width) => (
              <ToolButton
                key={width}
                label={`${width}%`}
                title={selectedMedia ? `Set selected ${selectedMedia} to ${width}% width` : "Select media in the post first"}
                active={Boolean(selectedMedia) && selectedMediaWidth === width}
                disabled={!selectedMedia}
                onClick={() => {
                  if (selectedMedia) activeEditor.chain().focus().updateAttributes(selectedMedia, { mediaWidth: width }).run();
                }}
              />
            ))}
          </ToolbarGroup>

          <ToolbarGroup label="Tables">
            <ToolButton label="Table" onClick={() => activeEditor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
            <ToolButton label="+ Row" disabled={!inTable} onClick={() => activeEditor.chain().focus().addRowAfter().run()} />
            <ToolButton label="+ Col" disabled={!inTable} onClick={() => activeEditor.chain().focus().addColumnAfter().run()} />
            <ToolButton label="Del Row" disabled={!inTable} onClick={() => activeEditor.chain().focus().deleteRow().run()} />
            <ToolButton label="Del Col" disabled={!inTable} onClick={() => activeEditor.chain().focus().deleteColumn().run()} />
            <ToolButton label="Del Table" disabled={!inTable} onClick={() => activeEditor.chain().focus().deleteTable().run()} />
          </ToolbarGroup>
        </div>
      </div>

      <div className="editor-document-wrap">
        <EditorContent editor={activeEditor} />
      </div>

      <div className="editor-footer-bar" aria-live="polite">
        <span>{stats.words} words</span>
        <span>{stats.characters} characters</span>
        <span>{stats.minutes} min read</span>
        <span>Shortcuts: Ctrl+B, Ctrl+I, Ctrl+Z</span>
      </div>
      {error && <p className="form-error editor-error" role="alert">{error}</p>}
    </div>
  );
}
