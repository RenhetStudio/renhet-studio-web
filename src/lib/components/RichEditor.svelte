<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import {
    Editor,
    Extension,
    Node,
    mergeAttributes,
    type JSONContent,
  } from "@tiptap/core";
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
  import { NodeSelection } from "@tiptap/pm/state";
  import { createClient } from "$lib/supabase/client";
  import IconReload from "$lib/components/icons/IconReload.svelte";
  import IconClose from "$lib/components/icons/IconClose.svelte";
  import IconCode from "$lib/components/icons/IconCode.svelte";
  import IconChevronDown from "$lib/components/icons/IconChevronDown.svelte";
  import IconCheck from "$lib/components/icons/IconCheck.svelte";
  import IconPlus from "$lib/components/icons/IconPlus.svelte";
  import IconLink from "$lib/components/icons/IconLink.svelte";
  import IconMedia from "$lib/components/icons/IconMedia.svelte";
  import IconUndo from "$lib/components/icons/IconUndo.svelte";
  import IconRedo from "$lib/components/icons/IconRedo.svelte";
  import IconTrash from "$lib/components/icons/IconTrash.svelte";
  import IconChevronRight from "$lib/components/icons/IconChevronRight.svelte";
  import IconVideo from "$lib/components/icons/IconVideo.svelte";
  import MediaDrawer from "./MediaDrawer.svelte";

  let {
    value = $bindable(),
    isMediaSidebarOpen = $bindable(false),
    mediaCount = $bindable(0),
  }: {
    value: JSONContent;
    isMediaSidebarOpen?: boolean;
    mediaCount?: number;
  } = $props();
  let editorElement: HTMLDivElement;
  let editor = $state<Editor | null>(null);
  let revision = $state(0);
  let currentMediaSelection = $state<{
    type: "image" | "video" | "audio" | "youtube";
    pos: number;
  } | null>(null);
  let uploading = $state<"image" | "video" | "audio" | null>(null);
  let uploadError = $state("");

  type DialogKind = "link" | "image" | "youtube" | "video" | "audio" | null;
  let activeDialog = $state<DialogKind>(null);
  let dialogUrl = $state("");
  let dialogText = $state("");
  let dialogSelectionRange = $state<{
    from: number;
    to: number;
    isNode?: boolean;
  } | null>(null);

  let showFloatingMenu = $state(false);
  let floatingMenuElement = $state<HTMLDivElement | null>(null);
  let floatingMenuPos = $state<{
    x: number;
    y: number;
    placement: "top" | "bottom";
  }>({
    x: 0,
    y: 0,
    placement: "top",
  });
  let openDropdown = $state<"lists" | "align" | null>(null);
  let activeToolbarMenu = $state<
    "block" | "lists" | "insert" | "replace" | null
  >(null);
  let activeSubmenu = $state<"upload" | "url" | "table" | "separator" | null>(
    null,
  );
  let shouldOpenSubmenuLeft = $state(false);

  let showTableMenu = $state(false);
  let tableMenuElement = $state<HTMLDivElement | null>(null);
  let tableMenuPos = $state<{
    x: number;
    y: number;
    placement: "top" | "bottom";
  }>({
    x: 0,
    y: 0,
    placement: "top",
  });

  function focusInput(node: HTMLInputElement) {
    setTimeout(() => {
      node.focus();
      if (node.value) node.select();
    }, 20);
  }

  const CspTextAlign = TextAlign.extend({
    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            textAlign: {
              default: this.options.defaultAlignment,
              parseHTML: (element) => {
                const alignment =
                  element.getAttribute("data-text-align") ||
                  element.style.textAlign;
                return this.options.alignments.includes(alignment)
                  ? alignment
                  : this.options.defaultAlignment;
              },
              renderHTML: (attributes) =>
                attributes.textAlign
                  ? { "data-text-align": attributes.textAlign }
                  : {},
            },
          },
        },
      ];
    },
  });
  const CspTable = Table.extend({
    renderHTML({ HTMLAttributes }) {
      const attributes = { ...HTMLAttributes };
      delete attributes.style;
      return [
        "table",
        mergeAttributes(this.options.HTMLAttributes, attributes),
        ["tbody", 0],
      ];
    },
  });
  const CspTableCell = TableCell.extend({
    renderHTML({ HTMLAttributes }) {
      const attributes = { ...HTMLAttributes };
      delete attributes.style;
      return [
        "td",
        mergeAttributes(this.options.HTMLAttributes, attributes),
        0,
      ];
    },
  });
  const CspTableHeader = TableHeader.extend({
    renderHTML({ HTMLAttributes }) {
      const attributes = { ...HTMLAttributes };
      delete attributes.style;
      return [
        "th",
        mergeAttributes(this.options.HTMLAttributes, attributes),
        0,
      ];
    },
  });
  const AudioNode = Node.create({
    name: "audio",
    group: "block",
    atom: true,
    draggable: false,
    addAttributes: () => ({
      src: { default: null },
      controls: { default: true },
    }),
    parseHTML: () => [{ tag: "audio[src]" }],
    renderHTML: ({ HTMLAttributes }) => [
      "audio",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        preload: "metadata",
      }),
    ],
  });
  const VideoNode = Node.create({
    name: "video",
    group: "block",
    atom: true,
    draggable: false,
    addAttributes: () => ({
      src: { default: null },
      controls: { default: true },
    }),
    parseHTML: () => [{ tag: "video[src]" }],
    renderHTML: ({ HTMLAttributes }) => [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        playsinline: "true",
        preload: "metadata",
      }),
    ],
  });
  const SectionGapNode = Node.create({
    name: "sectionGap",
    group: "block",
    atom: true,
    draggable: true,
    addAttributes: () => ({
      size: {
        default: "medium",
        parseHTML: (element) =>
          ["small", "medium", "large"].includes(
            element.getAttribute("data-gap-size") ?? "",
          )
            ? element.getAttribute("data-gap-size")
            : "medium",
        renderHTML: (attributes) => ({
          "data-gap-size": ["small", "medium", "large"].includes(
            String(attributes.size),
          )
            ? attributes.size
            : "medium",
        }),
      },
    }),
    parseHTML: () => [{ tag: "div[data-section-gap]" }],
    renderHTML: ({ HTMLAttributes }) => [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-section-gap": "",
        role: "separator",
        "aria-label": "Section gap",
      }),
    ],
  });
  const ResizableMedia = Extension.create({
    name: "resizableMedia",
    addGlobalAttributes() {
      return [
        {
          types: ["image", "video", "audio", "youtube"],
          attributes: {
            mediaWidth: {
              default: 100,
              parseHTML: (element) =>
                Math.min(
                  100,
                  Math.max(
                    10,
                    Math.round(
                      (Number(element.getAttribute("data-media-width")) ||
                        100) / 5,
                    ) * 5,
                  ),
                ),
              renderHTML: (attributes) => ({
                "data-media-width": Math.min(
                  100,
                  Math.max(
                    10,
                    Math.round((Number(attributes.mediaWidth) || 100) / 5) * 5,
                  ),
                ),
              }),
            },
            mediaLayout: {
              default: "standalone",
              parseHTML: (element) =>
                element.getAttribute("data-media-layout") || "standalone",
              renderHTML: (attributes) => ({
                "data-media-layout": attributes.mediaLayout,
              }),
            },
          },
        },
      ];
    },
  });

  onMount(() => {
    const LinkShortcut = Extension.create({
      name: "linkShortcut",
      addKeyboardShortcuts() {
        return {
          "Mod-k": () => {
            openLinkDialog();
            return true;
          },
        };
      },
    });

    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        }),
        Image.configure({ allowBase64: false }),
        Youtube.configure({ controls: true, nocookie: true }),
        Underline,
        CspTextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),
        Placeholder.configure({
          placeholder: ({ node }) =>
            node.type.name === "heading"
              ? "Write a clear section heading"
              : "Start writing, paste text, or use the toolbar to add media.",
        }),
        CharacterCount.configure({ limit: 50000 }),
        Highlight,
        TaskList,
        TaskItem.configure({
          nested: true,
          HTMLAttributes: {
            "data-type": "taskItem",
          },
        }),
        CspTable,
        TableRow,
        CspTableHeader,
        CspTableCell,
        Typography.configure({
          ellipsis: false,
        }),
        AudioNode,
        VideoNode,
        SectionGapNode,
        ResizableMedia,
        LinkShortcut,
      ],
      content: value,
      onUpdate: ({ editor }) => {
        value = editor.getJSON();
        revision += 1;
        requestAnimationFrame(() => {
          updateFloatingMenu();
          updateTableMenu();
        });
      },
      onSelectionUpdate: ({ editor: ed }) => {
        const sel = ed.state.selection;
        if (
          sel instanceof NodeSelection &&
          ["image", "video", "audio", "youtube"].includes(sel.node.type.name)
        ) {
          currentMediaSelection = {
            type: sel.node.type.name as "image" | "video" | "audio" | "youtube",
            pos: sel.from,
          };
        } else if (
          !(["image", "video", "audio", "youtube"] as const).some((type) =>
            ed.isActive(type),
          )
        ) {
          currentMediaSelection = null;
        }
        revision += 1;
        requestAnimationFrame(() => {
          updateFloatingMenu();
          updateTableMenu();
        });
      },
      onBlur: ({ event }) => {
        const related = (event as FocusEvent)
          ?.relatedTarget as HTMLElement | null;
        if (
          related?.closest("[data-floating-menu]") ||
          related?.closest("[data-floating-dropdown]") ||
          related?.closest("[data-floating-table-menu]") ||
          related?.closest("[data-editor-dialog]")
        ) {
          return;
        }
        showFloatingMenu = false;
        showTableMenu = false;
        openDropdown = null;
      },
      editorProps: {
        attributes: {
          class: "editor-prose",
          spellcheck: "true",
          "aria-label": "Post body",
        },
        handleClickOn: (view, _pos, node, nodePos) => {
          if (["image", "video", "audio", "youtube"].includes(node.type.name)) {
            view.dispatch(
              view.state.tr.setSelection(
                NodeSelection.create(view.state.doc, nodePos),
              ),
            );
            currentMediaSelection = {
              type: node.type.name as "image" | "video" | "audio" | "youtube",
              pos: nodePos,
            };
            revision += 1;
            // For video and audio, allow native controls so play/pause/scrubbing works
            if (node.type.name === "video" || node.type.name === "audio") {
              return false;
            }
            return true;
          }
          return false;
        },
        handlePaste: (_view, event) => {
          return handleClipboardPaste(event);
        },
        handleDrop: (view, event, _slice, moved) => {
          if (moved) return false;
          return handleDropMedia(view, event);
        },
      },
    });
    return () => editor?.destroy();
  });

  const normalizeUrl = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (
      /^http:\/\/localhost/i.test(trimmed) ||
      /^http:\/\/127\.0\.0\.1/i.test(trimmed)
    ) {
      return trimmed;
    }
    if (/^http:\/\//i.test(trimmed)) {
      return trimmed.replace(/^http:\/\//i, "https://");
    }
    if (/^(https|mailto|blob|data):/i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("//")) return `https:${trimmed}`;
    if (trimmed.startsWith("/")) return trimmed;
    return `https://${trimmed}`;
  };
  const active = (
    nameOrAttrs: string | Record<string, unknown>,
    attrs?: Record<string, unknown>,
  ) => {
    void revision;
    if (typeof nameOrAttrs === "string") {
      return editor?.isActive(nameOrAttrs, attrs) ?? false;
    }
    return editor?.isActive(nameOrAttrs) ?? false;
  };
  const run = (operation: (editor: Editor) => void) => {
    if (editor) operation(editor);
  };

  function formatAction(operation: (editor: Editor) => void) {
    openDropdown = null;
    run(operation);
  }

  function updateFloatingMenu() {
    if (!editor || !editor.view) {
      showFloatingMenu = false;
      return;
    }

    if (activeDialog !== null) {
      showFloatingMenu = false;
      openDropdown = null;
      return;
    }

    const { selection } = editor.state;
    if (
      !selection ||
      selection.empty ||
      selection instanceof NodeSelection ||
      currentMediaSelection !== null
    ) {
      showFloatingMenu = false;
      openDropdown = null;
      return;
    }

    const domSel = window.getSelection();
    if (!domSel || domSel.rangeCount === 0) {
      showFloatingMenu = false;
      return;
    }

    const anchorNode = domSel.anchorNode;
    if (!anchorNode || !editorElement?.contains(anchorNode)) {
      showFloatingMenu = false;
      return;
    }

    const text = editor.state.doc
      .textBetween(selection.from, selection.to, " ")
      .trim();
    if (!text) {
      showFloatingMenu = false;
      openDropdown = null;
      return;
    }

    const range = domSel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      showFloatingMenu = false;
      return;
    }

    if (rect.bottom < 60 || rect.top > window.innerHeight) {
      showFloatingMenu = false;
      return;
    }

    const menuWidth = floatingMenuElement?.offsetWidth || 440;
    const menuHeight = floatingMenuElement?.offsetHeight || 44;
    const padding = 16;

    let x = rect.left + rect.width / 2;
    const minX = padding + menuWidth / 2;
    const maxX = window.innerWidth - padding - menuWidth / 2;
    x = Math.max(minX, Math.min(maxX, x));

    let y: number;
    let placement: "top" | "bottom" = "top";
    if (rect.top - menuHeight - 12 < 120) {
      placement = "bottom";
      y = rect.bottom + 10;
    } else {
      placement = "top";
      y = rect.top - 10;
    }

    floatingMenuPos = { x, y, placement };
    showFloatingMenu = true;

    requestAnimationFrame(() => {
      if (floatingMenuElement) {
        const exactWidth = floatingMenuElement.offsetWidth;
        const exactMinX = padding + exactWidth / 2;
        const exactMaxX = window.innerWidth - padding - exactWidth / 2;
        const adjustedX = Math.max(
          exactMinX,
          Math.min(exactMaxX, rect.left + rect.width / 2),
        );
        if (Math.abs(adjustedX - floatingMenuPos.x) > 1) {
          floatingMenuPos = { ...floatingMenuPos, x: adjustedX };
        }
      }
    });
  }

  function updateTableMenu() {
    if (!editor || !editor.view) {
      showTableMenu = false;
      return;
    }

    if (activeDialog !== null || currentMediaSelection !== null) {
      showTableMenu = false;
      return;
    }

    if (!editor.isActive("table")) {
      showTableMenu = false;
      return;
    }

    const { selection } = editor.state;
    if (
      !selection ||
      (!selection.empty && !(selection instanceof NodeSelection))
    ) {
      showTableMenu = false;
      return;
    }

    const domSel = window.getSelection();
    const anchor = domSel?.anchorNode;
    const targetEl =
      anchor instanceof Element
        ? anchor.closest("td, th, table")
        : anchor?.parentElement?.closest("td, th, table");

    if (!targetEl || !editorElement?.contains(targetEl)) {
      showTableMenu = false;
      return;
    }

    const cellEl = targetEl.closest("td, th");
    const tableEl = targetEl.closest("table") || targetEl;
    const anchorEl = cellEl ?? tableEl;
    const rect = anchorEl.getBoundingClientRect();

    if (rect.bottom < 60 || rect.top > window.innerHeight) {
      showTableMenu = false;
      return;
    }

    const menuWidth = tableMenuElement?.offsetWidth || 400;
    const menuHeight = tableMenuElement?.offsetHeight || 38;
    const padding = 16;

    let x = rect.left + rect.width / 2;
    const minX = padding + menuWidth / 2;
    const maxX = window.innerWidth - padding - menuWidth / 2;
    x = Math.max(minX, Math.min(maxX, x));

    let y: number;
    let placement: "top" | "bottom" = "top";
    if (rect.top - menuHeight - 12 < 120) {
      placement = "bottom";
      y = rect.bottom + 8;
    } else {
      placement = "top";
      y = rect.top - 8;
    }

    tableMenuPos = { x, y, placement };
    showTableMenu = true;

    requestAnimationFrame(() => {
      if (tableMenuElement) {
        const exactWidth = tableMenuElement.offsetWidth;
        const exactMinX = padding + exactWidth / 2;
        const exactMaxX = window.innerWidth - padding - exactWidth / 2;
        const adjustedX = Math.max(
          exactMinX,
          Math.min(exactMaxX, rect.left + rect.width / 2),
        );
        if (Math.abs(adjustedX - tableMenuPos.x) > 1) {
          tableMenuPos = { ...tableMenuPos, x: adjustedX };
        }
      }
    });
  }

  function handleSubmenuEnter(
    event: PointerEvent,
    submenu: "upload" | "url" | "table" | "separator",
  ) {
    const currentTarget = event.currentTarget as HTMLElement | null;
    if (currentTarget) {
      const rect = currentTarget.getBoundingClientRect();
      shouldOpenSubmenuLeft = rect.right + 220 > window.innerWidth;
    }
    activeSubmenu = submenu;
  }

  function handleScrollOrResize() {
    if (showFloatingMenu) {
      updateFloatingMenu();
    }
    if (showTableMenu) {
      updateTableMenu();
    }
  }

  function handleWindowPointerDown(event: PointerEvent) {
    const target = event.target as HTMLElement | null;
    if (
      activeToolbarMenu &&
      target &&
      !target.closest("[data-toolbar-dropdown]")
    ) {
      activeToolbarMenu = null;
      activeSubmenu = null;
    }
    if (!openDropdown) return;
    if (target && !target.closest("[data-floating-dropdown]")) {
      openDropdown = null;
    }
  }

  function handleWindowPointerUp() {
    requestAnimationFrame(() => {
      updateFloatingMenu();
      updateTableMenu();
    });
  }

  function handleWindowKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      if (activeSubmenu) {
        activeSubmenu = null;
        event.stopPropagation();
      } else if (activeToolbarMenu) {
        activeToolbarMenu = null;
        event.stopPropagation();
      } else if (openDropdown) {
        openDropdown = null;
        event.stopPropagation();
      } else if (showFloatingMenu) {
        showFloatingMenu = false;
      } else if (showTableMenu) {
        showTableMenu = false;
      }
    }
  }
  function openLinkDialog() {
    if (!editor) return;
    const isLinkActive = editor.isActive("link");
    const currentHref = isLinkActive
      ? String(editor.getAttributes("link").href ?? "")
      : "";
    const { from, to, empty } = editor.state.selection;
    dialogSelectionRange = { from, to, isNode: false };
    dialogUrl = currentHref;
    dialogText = empty ? "" : editor.state.doc.textBetween(from, to, " ");
    activeDialog = "link";
  }

  function openMediaDialog(kind: "image" | "video" | "audio" | "youtube") {
    if (!editor) return;
    const sel = editor.state.selection;
    const isNode = sel instanceof NodeSelection;
    dialogSelectionRange = { from: sel.from, to: sel.to, isNode };
    dialogUrl = "";
    dialogText = "";
    activeDialog = kind;
  }

  function closeDialog() {
    activeDialog = null;
    dialogUrl = "";
    dialogText = "";
    dialogSelectionRange = null;
  }

  function applyLink() {
    if (!editor) return;
    const trimmedUrl = dialogUrl.trim();
    if (!trimmedUrl) {
      if (editor.isActive("link")) {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }
      closeDialog();
      return;
    }

    const href = normalizeUrl(trimmedUrl);
    const displayText = dialogText.trim();

    if (
      dialogSelectionRange &&
      !dialogSelectionRange.isNode &&
      dialogSelectionRange.from !== dialogSelectionRange.to
    ) {
      const selectedOriginal = editor.state.doc.textBetween(
        dialogSelectionRange.from,
        dialogSelectionRange.to,
        " ",
      );
      if (displayText && displayText !== selectedOriginal) {
        editor
          .chain()
          .focus()
          .setTextSelection({
            from: dialogSelectionRange.from,
            to: dialogSelectionRange.to,
          })
          .insertContent({
            type: "text",
            text: displayText,
            marks: [{ type: "link", attrs: { href } }],
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .setTextSelection({
            from: dialogSelectionRange.from,
            to: dialogSelectionRange.to,
          })
          .extendMarkRange("link")
          .setLink({ href })
          .run();
      }
    } else {
      if (displayText) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text: displayText,
            marks: [{ type: "link", attrs: { href } }],
          })
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "text",
            text: href,
            marks: [{ type: "link", attrs: { href } }],
          })
          .run();
      }
    }
    closeDialog();
  }

  function removeLink() {
    if (editor) {
      if (dialogSelectionRange && !dialogSelectionRange.isNode) {
        editor
          .chain()
          .focus()
          .setTextSelection({
            from: dialogSelectionRange.from,
            to: dialogSelectionRange.to,
          })
          .extendMarkRange("link")
          .unsetLink()
          .run();
      } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
      }
    }
    closeDialog();
  }

  function applyMedia() {
    if (!editor || !activeDialog || activeDialog === "link") return;
    const kind = activeDialog;
    const trimmedSource = dialogUrl.trim();
    if (!trimmedSource) {
      closeDialog();
      return;
    }
    const src = normalizeUrl(trimmedSource);
    const alt = dialogText.trim();

    if (dialogSelectionRange) {
      if (dialogSelectionRange.isNode) {
        editor.commands.setNodeSelection(dialogSelectionRange.from);
      } else {
        try {
          editor.commands.setTextSelection({
            from: dialogSelectionRange.from,
            to: dialogSelectionRange.to,
          });
        } catch {
          // ignore if invalid text selection
        }
      }
    }

    const isYouTube =
      /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/i.test(
        src,
      );
    const isImage =
      /\.(gif|jpe?g|png|webp|avif|svg)(\?.*)?$/i.test(src) ||
      /(giphy\.com|tenor\.com|imgur\.com)\/\S+\.gif/i.test(src);
    const isAudio = /\.(mp3|ogg|wav|m4a|aac|flac)(\?.*)?$/i.test(src);

    if (isYouTube) {
      editor.commands.setYoutubeVideo({ src, width: 1280, height: 720 });
    } else if (kind === "image" || (kind === "video" && isImage)) {
      editor.commands.insertContent({
        type: "image",
        attrs: {
          src,
          ...(alt ? { alt } : {}),
        },
      });
    } else if (kind === "audio" || (kind === "video" && isAudio)) {
      editor.commands.insertContent({
        type: "audio",
        attrs: { src },
      });
    } else if (kind === "video") {
      editor.commands.insertContent({
        type: "video",
        attrs: { src },
      });
    } else if (kind === "youtube") {
      editor.commands.setYoutubeVideo({ src, width: 1280, height: 720 });
    }

    editor.commands.focus();
    revision += 1;
    closeDialog();
  }
  const VALID_MEDIA_TYPES: Record<string, "image" | "video" | "audio"> = {
    "image/jpeg": "image",
    "image/png": "image",
    "image/webp": "image",
    "image/gif": "image",
    "video/mp4": "video",
    "video/webm": "video",
    "audio/mpeg": "audio",
    "audio/ogg": "audio",
    "audio/wav": "audio",
    "audio/webm": "audio",
  };

  const EXT_TO_MIME: Record<string, string> = {
    gif: "image/gif",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    mp3: "audio/mpeg",
    ogg: "audio/ogg",
    wav: "audio/wav",
  };

  function resolveMediaFile(
    rawFile: File,
  ): { file: File; kind: "image" | "video" | "audio" } | null {
    let type = (rawFile.type || "").toLowerCase();
    const ext = rawFile.name.split(".").pop()?.toLowerCase() || "";

    // Normalize GIFs explicitly to image/gif and kind image
    if (ext === "gif" || type === "image/gif" || type === "image/x-gif") {
      type = "image/gif";
    } else if (!type || type === "application/octet-stream") {
      if (ext in EXT_TO_MIME) {
        type = EXT_TO_MIME[ext];
      }
    }

    if (type.startsWith("image/") && !VALID_MEDIA_TYPES[type]) {
      type = "image/png";
    }

    const kind =
      type === "image/gif" || ext === "gif" ? "image" : VALID_MEDIA_TYPES[type];
    if (!kind) return null;

    if (rawFile.size > 52_428_800) {
      uploadError = `"${rawFile.name || "File"}" exceeds maximum size of 50MB.`;
      return null;
    }

    let filename = rawFile.name ? rawFile.name.trim() : "";
    if (!filename || filename === "blob" || !filename.includes(".")) {
      const extFromType =
        type === "image/gif" || ext === "gif"
          ? "gif"
          : type.split("/")[1]?.replace("jpeg", "jpg") || "png";
      filename = `pasted-${Date.now()}.${extFromType}`;
    }

    const file =
      type !== rawFile.type || filename !== rawFile.name
        ? new File([rawFile], filename, { type })
        : rawFile;

    return { file, kind };
  }

  function handleClipboardPaste(event: ClipboardEvent): boolean {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return false;

    const rawFiles: File[] = [];
    if (clipboardData.files && clipboardData.files.length > 0) {
      for (let i = 0; i < clipboardData.files.length; i++) {
        const f = clipboardData.files.item(i);
        if (f) rawFiles.push(f);
      }
    } else if (clipboardData.items && clipboardData.items.length > 0) {
      for (let i = 0; i < clipboardData.items.length; i++) {
        const item = clipboardData.items[i];
        if (item.kind === "file") {
          const f = item.getAsFile();
          if (f) rawFiles.push(f);
        }
      }
    }

    const mediaToUpload = rawFiles
      .map((f) => resolveMediaFile(f))
      .filter(
        (item): item is { file: File; kind: "image" | "video" | "audio" } =>
          Boolean(item),
      );

    if (mediaToUpload.length > 0) {
      event.preventDefault();
      void (async () => {
        for (const entry of mediaToUpload) {
          await upload(entry.file, entry.kind);
        }
      })();
      return true;
    }

    const html = clipboardData.getData("text/html");
    if (html) {
      const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (match && match[1]) {
        const imgSrc = match[1];
        if (imgSrc.startsWith("data:image/")) {
          event.preventDefault();
          const base64Match = imgSrc.match(
            /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/,
          );
          if (base64Match) {
            try {
              const mime = base64Match[1];
              const byteCharacters = atob(base64Match[2]);
              const byteArrays = new Uint8Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteArrays[i] = byteCharacters.charCodeAt(i);
              }
              const ext = mime.split("/")[1] || "png";
              const file = new File(
                [byteArrays],
                `pasted-${Date.now()}.${ext}`,
                { type: mime },
              );
              void upload(file, "image");
              return true;
            } catch (err) {
              console.error("Failed to decode base64 image", err);
            }
          }
        } else if (/^https?:\/\//i.test(imgSrc)) {
          event.preventDefault();
          editor
            ?.chain()
            .focus()
            .setImage({ src: imgSrc, alt: "Pasted image" })
            .run();
          return true;
        }
      }
    }

    const text = clipboardData.getData("text/plain")?.trim();
    if (text && /^https?:\/\/\S+$/i.test(text)) {
      if (
        /\.(gif|jpe?g|png|webp|avif)(\?.*)?$/i.test(text) ||
        /(tenor\.com|giphy\.com|imgur\.com)\/\S+\.gif/i.test(text)
      ) {
        event.preventDefault();
        editor?.chain().focus().setImage({ src: text, alt: "Media" }).run();
        return true;
      }
      if (/\.(mp4|webm)(\?.*)?$/i.test(text)) {
        event.preventDefault();
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "video", attrs: { src: text } })
          .run();
        return true;
      }
      if (/\.(mp3|ogg|wav)(\?.*)?$/i.test(text)) {
        event.preventDefault();
        editor
          ?.chain()
          .focus()
          .insertContent({ type: "audio", attrs: { src: text } })
          .run();
        return true;
      }
      if (
        /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/i.test(
          text,
        )
      ) {
        event.preventDefault();
        editor?.chain().focus().setYoutubeVideo({ src: text }).run();
        return true;
      }
    }

    return false;
  }

  function handleDropMedia(
    view: {
      posAtCoords: (coords: { left: number; top: number }) => {
        pos: number;
      } | null;
    },
    event: DragEvent,
  ): boolean {
    const rawFiles = event.dataTransfer?.files;
    if (!rawFiles || rawFiles.length === 0) return false;

    const toUpload: { file: File; kind: "image" | "video" | "audio" }[] = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const item = rawFiles.item(i);
      if (item) {
        const resolved = resolveMediaFile(item);
        if (resolved) toUpload.push(resolved);
      }
    }

    if (toUpload.length > 0) {
      event.preventDefault();
      const coords = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      if (coords && editor) {
        editor.chain().setTextSelection(coords.pos).focus().run();
      }
      void (async () => {
        for (const entry of toUpload) {
          await upload(entry.file, entry.kind);
        }
      })();
      return true;
    }
    return false;
  }

  async function upload(file: File, kind: "image" | "video" | "audio") {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    // Treat GIFs as images across all upload pathways
    if (
      ext === "gif" ||
      file.type === "image/gif" ||
      file.type === "image/x-gif"
    ) {
      kind = "image";
      if (file.type !== "image/gif") {
        file = new File([file], file.name, { type: "image/gif" });
      }
    }

    uploading = kind;
    uploadError = "";
    try {
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
      if (!response.ok || !signed.path || !signed.token || !signed.publicUrl)
        throw new Error(signed.error ?? "Could not prepare upload");
      const { error } = await createClient()
        .storage.from("blog-media")
        .uploadToSignedUrl(signed.path, signed.token, file, {
          contentType,
        });
      if (error) throw error;
      if (kind === "image")
        editor
          ?.chain()
          .focus()
          .setImage({
            src: signed.publicUrl,
            alt: file.name.startsWith("pasted-")
              ? "Image"
              : file.name.replace(/\.[^.]+$/, ""),
          })
          .run();
      else
        editor
          ?.chain()
          .focus()
          .insertContent({ type: kind, attrs: { src: signed.publicUrl } })
          .run();
    } catch (error) {
      uploadError = error instanceof Error ? error.message : "Upload failed";
    } finally {
      uploading = null;
    }
  }
  function updateMedia(attributes: {
    mediaWidth?: number;
    mediaLayout?: string;
  }) {
    if (!editor) return;
    const activeType = (["image", "video", "audio", "youtube"] as const).find(
      (item) => editor?.isActive(item),
    );
    const targetType = activeType || currentMediaSelection?.type;
    if (!targetType) return;

    if (currentMediaSelection && !activeType) {
      editor
        .chain()
        .setNodeSelection(currentMediaSelection.pos)
        .updateAttributes(targetType, attributes)
        .run();
    } else {
      editor.commands.updateAttributes(targetType, attributes);
    }
    revision += 1;
  }
  const selectedMedia = $derived.by(() => {
    void revision;
    if (!editor) return null;
    const activeType = (["image", "video", "audio", "youtube"] as const).find(
      (type) => editor?.isActive(type),
    );
    if (activeType) return activeType;
    if (
      currentMediaSelection &&
      editor.state.doc.nodeAt(currentMediaSelection.pos)?.type.name ===
        currentMediaSelection.type
    ) {
      return currentMediaSelection.type;
    }
    return null;
  });
  const mediaWidth = $derived.by(() => {
    void revision;
    if (!selectedMedia || !editor) return 100;
    const attrs = editor.getAttributes(selectedMedia);
    if (attrs && attrs.mediaWidth !== undefined) {
      return Number(attrs.mediaWidth) || 100;
    }
    if (currentMediaSelection) {
      const node = editor.state.doc.nodeAt(currentMediaSelection.pos);
      if (node?.attrs.mediaWidth !== undefined) {
        return Number(node.attrs.mediaWidth) || 100;
      }
    }
    return 100;
  });
  let slidingWidth = $state<number | null>(null);
  const displayMediaWidth = $derived(slidingWidth ?? mediaWidth);
  const currentMediaLayout = $derived.by(() => {
    void revision;
    if (!selectedMedia || !editor) return "standalone";
    const attrs = editor.getAttributes(selectedMedia);
    if (attrs?.mediaLayout) return String(attrs.mediaLayout);
    if (currentMediaSelection) {
      const node = editor.state.doc.nodeAt(currentMediaSelection.pos);
      if (node?.attrs.mediaLayout) return String(node.attrs.mediaLayout);
    }
    return "standalone";
  });

  const canUndo = $derived.by(() => {
    void revision;
    return Boolean(editor?.can().undo());
  });

  const canRedo = $derived.by(() => {
    void revision;
    return Boolean(editor?.can().redo());
  });

  const currentBlockLabel = $derived.by(() => {
    void revision;
    if (!editor) return "Paragraph";
    if (active("heading", { level: 1 })) return "H1";
    if (active("heading", { level: 2 })) return "H2";
    if (active("heading", { level: 3 })) return "H3";
    if (active("blockquote")) return "Quote";
    return "Paragraph";
  });

  function deleteSelectedMedia() {
    if (!editor) return;
    if (currentMediaSelection) {
      const node = editor.state.doc.nodeAt(currentMediaSelection.pos);
      if (node) {
        editor
          .chain()
          .focus()
          .deleteRange({
            from: currentMediaSelection.pos,
            to: currentMediaSelection.pos + node.nodeSize,
          })
          .run();
        currentMediaSelection = null;
        revision += 1;
        return;
      }
    }
    if (editor.state.selection instanceof NodeSelection) {
      editor.chain().focus().deleteSelection().run();
      currentMediaSelection = null;
      revision += 1;
      return;
    }
    if (selectedMedia) {
      const { from, to } = editor.state.selection;
      editor
        .chain()
        .focus()
        .deleteRange({ from: Math.max(0, from - 1), to })
        .run();
      currentMediaSelection = null;
      revision += 1;
    }
  }

  function deselectMedia() {
    if (!editor) return;
    currentMediaSelection = null;
    editor.commands.focus("end");
    revision += 1;
  }

  function replaceSelectedMedia(newSrc: string, newAlt?: string) {
    if (!editor) return;
    const { tr } = editor.state;
    if (currentMediaSelection) {
      const targetNode = editor.state.doc.nodeAt(currentMediaSelection.pos);
      if (targetNode) {
        const newAttrs: Record<string, any> = {
          ...targetNode.attrs,
          src: newSrc,
        };
        if (newAlt !== undefined && targetNode.type.name === "image") {
          newAttrs.alt = newAlt;
        }
        tr.setNodeMarkup(currentMediaSelection.pos, undefined, newAttrs);
        editor.view.dispatch(tr);
        revision += 1;
        return;
      }
    }
    if (editor.state.selection instanceof NodeSelection) {
      const { from, node } = editor.state.selection;
      const newAttrs: Record<string, any> = { ...node.attrs, src: newSrc };
      if (newAlt !== undefined && node.type.name === "image") {
        newAttrs.alt = newAlt;
      }
      editor.view.dispatch(
        editor.state.tr.setNodeMarkup(from, undefined, newAttrs),
      );
      revision += 1;
      return;
    }
    const targetType = selectedMedia;
    if (targetType) {
      const attrs: Record<string, any> = { src: newSrc };
      if (newAlt !== undefined && targetType === "image") attrs.alt = newAlt;
      editor.commands.updateAttributes(targetType, attrs);
      revision += 1;
    }
  }

  async function handleReplaceUpload(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || !selectedMedia) return;
    activeToolbarMenu = null;
    const targetKind = selectedMedia === "youtube" ? "image" : selectedMedia;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    let uploadFile = file;
    let kind = targetKind;
    if (
      ext === "gif" ||
      file.type === "image/gif" ||
      file.type === "image/x-gif"
    ) {
      kind = "image";
      if (file.type !== "image/gif") {
        uploadFile = new File([file], file.name, { type: "image/gif" });
      }
    }
    uploading = kind;
    uploadError = "";
    try {
      const contentType =
        uploadFile.type || (ext === "gif" ? "image/gif" : "image/png");
      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: uploadFile.name,
          contentType,
          size: uploadFile.size,
        }),
      });
      const signed = (await response.json()) as {
        path?: string;
        token?: string;
        publicUrl?: string;
        error?: string;
      };
      if (!response.ok || !signed.path || !signed.token || !signed.publicUrl)
        throw new Error(signed.error ?? "Could not prepare upload");
      const { error } = await createClient()
        .storage.from("blog-media")
        .uploadToSignedUrl(signed.path, signed.token, uploadFile, {
          contentType,
        });
      if (error) throw error;
      replaceSelectedMedia(
        signed.publicUrl,
        uploadFile.name.replace(/\.[^.]+$/, ""),
      );
    } catch (err) {
      uploadError = err instanceof Error ? err.message : "Upload failed";
    } finally {
      uploading = null;
    }
  }

  function handleInsertUpload(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
    defaultKind: "image" | "video" | "audio",
  ) {
    activeToolbarMenu = null;
    const rawFile = event.currentTarget.files?.[0];
    if (rawFile) {
      const resolved = resolveMediaFile(rawFile);
      if (resolved) {
        void upload(resolved.file, resolved.kind);
      } else if (
        rawFile.name.toLowerCase().endsWith(".gif") ||
        rawFile.type.includes("gif")
      ) {
        const gifFile = new File([rawFile], rawFile.name, {
          type: "image/gif",
        });
        void upload(gifFile, "image");
      } else {
        void upload(rawFile, defaultKind);
      }
    }
    event.currentTarget.value = "";
  }
</script>

<svelte:window
  onscroll={handleScrollOrResize}
  onresize={handleScrollOrResize}
  onpointerdown={handleWindowPointerDown}
  onpointerup={handleWindowPointerUp}
  onkeydown={handleWindowKeyDown}
/>

<div class="rich-editor">
  {#if editor}
    <div class="editor-toolbar" role="toolbar" aria-label="Post formatting">
      {#if !selectedMedia}
        <!-- NORMAL TOOLBAR: Option 1 -->
        <div class="editor-toolbar-row">
          <!-- 1. Undo / Redo with dedicated icons -->
          <div class="editor-toolbar-group" aria-label="History">
            <button
              type="button"
              disabled={!canUndo}
              onclick={() => run((e) => e.chain().focus().undo().run())}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <IconUndo size={15} strokeWidth={2.4} />
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onclick={() => run((e) => e.chain().focus().redo().run())}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <IconRedo size={15} strokeWidth={2.4} />
            </button>
          </div>

          <div class="editor-toolbar-separator" aria-hidden="true"></div>

          <!-- 2. Paragraph ▾ (Block styles) -->
          <div class="editor-toolbar-group">
            <div class="editor-toolbar-dropdown" data-toolbar-dropdown>
              <button
                type="button"
                class="editor-dropdown-trigger"
                class:is-active={active("heading") || active("blockquote")}
                onclick={() =>
                  (activeToolbarMenu =
                    activeToolbarMenu === "block" ? null : "block")}
                aria-expanded={activeToolbarMenu === "block"}
                aria-haspopup="menu"
                title="Paragraph or heading style"
              >
                <span>{currentBlockLabel}</span>
                <IconChevronDown
                  size={12}
                  strokeWidth={2.4}
                  class="transition-transform duration-150 {activeToolbarMenu ===
                  'block'
                    ? 'rotate-180'
                    : ''}"
                />
              </button>

              {#if activeToolbarMenu === "block"}
                <div class="editor-dropdown-menu" role="menu">
                  <button
                    type="button"
                    class="editor-dropdown-item"
                    class:is-active={active("paragraph") &&
                      !active("heading") &&
                      !active("blockquote")}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) => e.chain().focus().setParagraph().run());
                    }}
                  >
                    <span>Paragraph</span>
                    {#if active("paragraph") && !active("heading") && !active("blockquote")}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="editor-dropdown-item font-bold"
                    class:is-active={active("heading", { level: 1 })}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) =>
                        e.chain().focus().toggleHeading({ level: 1 }).run(),
                      );
                    }}
                  >
                    <span>Heading 1 (H1)</span>
                    {#if active("heading", { level: 1 })}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="editor-dropdown-item font-bold"
                    class:is-active={active("heading", { level: 2 })}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) =>
                        e.chain().focus().toggleHeading({ level: 2 }).run(),
                      );
                    }}
                  >
                    <span>Heading 2 (H2)</span>
                    {#if active("heading", { level: 2 })}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="editor-dropdown-item font-semibold"
                    class:is-active={active("heading", { level: 3 })}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) =>
                        e.chain().focus().toggleHeading({ level: 3 }).run(),
                      );
                    }}
                  >
                    <span>Heading 3 (H3)</span>
                    {#if active("heading", { level: 3 })}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                  <div class="editor-dropdown-divider" aria-hidden="true"></div>
                  <button
                    type="button"
                    class="editor-dropdown-item italic"
                    class:is-active={active("blockquote")}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) => e.chain().focus().toggleBlockquote().run());
                    }}
                  >
                    <span>Quote</span>
                    {#if active("blockquote")}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                </div>
              {/if}
            </div>
          </div>

          <div class="editor-toolbar-separator" aria-hidden="true"></div>

          <!-- 3. [B I U S Code Mark] Inline formatting -->
          <div class="editor-toolbar-group" aria-label="Text formatting">
            <button
              type="button"
              class:is-active={active("bold")}
              onclick={() => run((e) => e.chain().focus().toggleBold().run())}
              title="Bold (Ctrl+B)"
              class="font-bold font-serif">B</button
            >
            <button
              type="button"
              class:is-active={active("italic")}
              onclick={() => run((e) => e.chain().focus().toggleItalic().run())}
              title="Italic (Ctrl+I)"
              class="italic font-serif">I</button
            >
            <button
              type="button"
              class:is-active={active("underline")}
              onclick={() =>
                run((e) => e.chain().focus().toggleUnderline().run())}
              title="Underline (Ctrl+U)"
              class="underline">U</button
            >
            <button
              type="button"
              class:is-active={active("strike")}
              onclick={() => run((e) => e.chain().focus().toggleStrike().run())}
              title="Strikethrough"
              class="line-through">S</button
            >
            <button
              type="button"
              class:is-active={active("code")}
              onclick={() => run((e) => e.chain().focus().toggleCode().run())}
              title="Inline code"
              class="font-mono text-[11px]">Code</button
            >
            <button
              type="button"
              class:is-active={active("highlight")}
              onclick={() =>
                run((e) => e.chain().focus().toggleHighlight().run())}
              title="Highlight">Mark</button
            >
          </div>

          <div class="editor-toolbar-separator" aria-hidden="true"></div>

          <!-- 4. Lists ▾ -->
          <div class="editor-toolbar-group">
            <div class="editor-toolbar-dropdown" data-toolbar-dropdown>
              <button
                type="button"
                class="editor-dropdown-trigger"
                class:is-active={active("bulletList") ||
                  active("orderedList") ||
                  active("taskList")}
                onclick={() =>
                  (activeToolbarMenu =
                    activeToolbarMenu === "lists" ? null : "lists")}
                aria-expanded={activeToolbarMenu === "lists"}
                aria-haspopup="menu"
                title="Lists and checklists"
              >
                <span>Lists</span>
                <IconChevronDown
                  size={12}
                  strokeWidth={2.4}
                  class="transition-transform duration-150 {activeToolbarMenu ===
                  'lists'
                    ? 'rotate-180'
                    : ''}"
                />
              </button>

              {#if activeToolbarMenu === "lists"}
                <div class="editor-dropdown-menu" role="menu">
                  <button
                    type="button"
                    class="editor-dropdown-item"
                    class:is-active={active("bulletList")}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) => e.chain().focus().toggleBulletList().run());
                    }}
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-[#718191] font-black">•</span>
                      <span>Bullet list</span>
                    </div>
                    {#if active("bulletList")}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="editor-dropdown-item"
                    class:is-active={active("orderedList")}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) => e.chain().focus().toggleOrderedList().run());
                    }}
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-[#718191] text-xs font-mono">1.</span>
                      <span>Numbered list</span>
                    </div>
                    {#if active("orderedList")}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                  <button
                    type="button"
                    class="editor-dropdown-item"
                    class:is-active={active("taskList")}
                    onclick={() => {
                      activeToolbarMenu = null;
                      run((e) => e.chain().focus().toggleTaskList().run());
                    }}
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-[#718191] text-xs font-mono">[✓]</span>
                      <span>Checklist</span>
                    </div>
                    {#if active("taskList")}
                      <IconCheck size={13} strokeWidth={2.5} />
                    {/if}
                  </button>
                </div>
              {/if}
            </div>
          </div>

          <div class="editor-toolbar-separator" aria-hidden="true"></div>

          <!-- 5. Alignment -->
          <div class="editor-toolbar-group" aria-label="Alignment">
            {#each ["left", "center", "right", "justify"] as alignment}
              <button
                type="button"
                class:is-active={active("paragraph", {
                  textAlign: alignment,
                }) || active("heading", { textAlign: alignment })}
                onclick={() =>
                  run((e) => e.chain().focus().setTextAlign(alignment).run())}
                title={`Align ${alignment}`}
                class="capitalize"
              >
                {alignment}
              </button>
            {/each}
          </div>

          <div class="editor-toolbar-separator" aria-hidden="true"></div>

          <!-- 6. + Insert ▾ -->
          <div class="editor-toolbar-group">
            <div class="editor-toolbar-dropdown" data-toolbar-dropdown>
              <button
                type="button"
                class="editor-dropdown-trigger font-black text-[#344253]"
                onclick={(e) => {
                  const currentTarget = e.currentTarget as HTMLElement | null;
                  if (currentTarget) {
                    const rect = currentTarget.getBoundingClientRect();
                    shouldOpenSubmenuLeft = rect.left + 420 > window.innerWidth;
                  }
                  activeToolbarMenu =
                    activeToolbarMenu === "insert" ? null : "insert";
                  activeSubmenu = null;
                }}
                aria-expanded={activeToolbarMenu === "insert"}
                aria-haspopup="menu"
                title="Insert media, links, tables, or dividers"
              >
                <IconPlus size={13} strokeWidth={2.5} />
                <span>Insert</span>
                <IconChevronDown
                  size={12}
                  strokeWidth={2.4}
                  class="transition-transform duration-150 {activeToolbarMenu ===
                  'insert'
                    ? 'rotate-180'
                    : ''}"
                />
              </button>

              {#if activeToolbarMenu === "insert"}
                <div
                  class="editor-dropdown-menu w-52"
                  role="menu"
                >
                  <!-- 1. Link -->
                  <button
                    type="button"
                    class="editor-dropdown-item"
                    onclick={() => {
                      activeToolbarMenu = null;
                      activeSubmenu = null;
                      openLinkDialog();
                    }}
                  >
                    <div class="flex items-center gap-2">
                      <IconLink size={14} />
                      <span>Link</span>
                    </div>
                    <span class="text-[10px] text-[#718191] font-mono">Ctrl+K</span>
                  </button>

                  <!-- 2. Upload > -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="editor-dropdown-subitem-wrap"
                    onpointerenter={(e) => handleSubmenuEnter(e, "upload")}
                    onpointerleave={() => {
                      if (activeSubmenu === "upload") activeSubmenu = null;
                    }}
                  >
                    <button
                      type="button"
                      class="editor-dropdown-item"
                      onclick={() =>
                        (activeSubmenu =
                          activeSubmenu === "upload" ? null : "upload")}
                    >
                      <div class="flex items-center gap-2">
                        <IconMedia size={14} />
                        <span>Upload</span>
                      </div>
                      <IconChevronRight
                        size={12}
                        strokeWidth={2.4}
                        class="text-[#718191]"
                      />
                    </button>
                    <div
                      class="editor-dropdown-submenu"
                      class:open-left={shouldOpenSubmenuLeft}
                      class:is-open={activeSubmenu === "upload"}
                    >
                      <label class="editor-dropdown-item cursor-pointer">
                        <div class="flex items-center gap-2">
                          <IconMedia size={14} />
                          <span
                            >{uploading === "image"
                              ? "Uploading…"
                              : "Image / Gif"}</span
                          >
                        </div>
                        <input
                          type="file"
                          class="sr-only"
                          accept="image/*, .gif, .png, .jpg, .jpeg, .webp"
                          disabled={Boolean(uploading)}
                          onchange={(e) => {
                            activeToolbarMenu = null;
                            activeSubmenu = null;
                            handleInsertUpload(e, "image");
                          }}
                        />
                      </label>
                      <label class="editor-dropdown-item cursor-pointer">
                        <div class="flex items-center gap-2">
                          <IconMedia size={14} />
                          <span
                            >{uploading === "video"
                              ? "Uploading…"
                              : "Video"}</span
                          >
                        </div>
                        <input
                          type="file"
                          class="sr-only"
                          accept="video/*"
                          disabled={Boolean(uploading)}
                          onchange={(e) => {
                            activeToolbarMenu = null;
                            activeSubmenu = null;
                            handleInsertUpload(e, "video");
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          openMediaDialog("youtube");
                        }}
                      >
                        <div class="flex items-center gap-2">
                          <IconVideo size={14} />
                          <span>Youtube video</span>
                        </div>
                      </button>
                      <label class="editor-dropdown-item cursor-pointer">
                        <div class="flex items-center gap-2">
                          <IconMedia size={14} />
                          <span
                            >{uploading === "audio"
                              ? "Uploading…"
                              : "Audio"}</span
                          >
                        </div>
                        <input
                          type="file"
                          class="sr-only"
                          accept="audio/*"
                          disabled={Boolean(uploading)}
                          onchange={(e) => {
                            activeToolbarMenu = null;
                            activeSubmenu = null;
                            handleInsertUpload(e, "audio");
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <!-- 3. From url > -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="editor-dropdown-subitem-wrap"
                    onpointerenter={(e) => handleSubmenuEnter(e, "url")}
                    onpointerleave={() => {
                      if (activeSubmenu === "url") activeSubmenu = null;
                    }}
                  >
                    <button
                      type="button"
                      class="editor-dropdown-item"
                      onclick={() =>
                        (activeSubmenu =
                          activeSubmenu === "url" ? null : "url")}
                    >
                      <div class="flex items-center gap-2">
                        <IconLink size={14} />
                        <span>From url</span>
                      </div>
                      <IconChevronRight
                        size={12}
                        strokeWidth={2.4}
                        class="text-[#718191]"
                      />
                    </button>
                    <div
                      class="editor-dropdown-submenu"
                      class:open-left={shouldOpenSubmenuLeft}
                      class:is-open={activeSubmenu === "url"}
                    >
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          openMediaDialog("image");
                        }}
                      >
                        <div class="flex items-center gap-2">
                          <IconMedia size={14} />
                          <span>Image / Gif</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          openMediaDialog("video");
                        }}
                      >
                        <div class="flex items-center gap-2">
                          <IconMedia size={14} />
                          <span>Video</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          openMediaDialog("audio");
                        }}
                      >
                        <div class="flex items-center gap-2">
                          <IconMedia size={14} />
                          <span>Audio</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          openMediaDialog("youtube");
                        }}
                      >
                        <div class="flex items-center gap-2">
                          <IconVideo size={14} />
                          <span>Youtube video</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <!-- 4. Table (clicable) > -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="editor-dropdown-subitem-wrap"
                    onpointerenter={(e) => handleSubmenuEnter(e, "table")}
                    onpointerleave={() => {
                      if (activeSubmenu === "table") activeSubmenu = null;
                    }}
                  >
                    <div class="flex items-center w-full justify-between rounded-md hover:bg-[#8fb8d8]/20 transition-colors">
                      <button
                        type="button"
                        class="editor-dropdown-item flex-1"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) =>
                            e
                              .chain()
                              .focus()
                              .insertTable({
                                rows: 3,
                                cols: 3,
                                withHeaderRow: true,
                              })
                              .run(),
                          );
                        }}
                        title="Click to insert a new 3×3 table"
                      >
                        <span>Table</span>
                      </button>
                      <button
                        type="button"
                        aria-label="Table options"
                        class="px-2 py-1.5 text-[#718191] hover:text-[#344253] cursor-pointer"
                        onclick={(e) => {
                          e.stopPropagation();
                          activeSubmenu =
                            activeSubmenu === "table" ? null : "table";
                        }}
                      >
                        <IconChevronRight size={12} strokeWidth={2.4} />
                      </button>
                    </div>
                    <div
                      class="editor-dropdown-submenu"
                      class:open-left={shouldOpenSubmenuLeft}
                      class:is-open={activeSubmenu === "table"}
                    >
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) =>
                            e
                              .chain()
                              .focus()
                              .insertTable({
                                rows: 3,
                                cols: 3,
                                withHeaderRow: true,
                              })
                              .run(),
                          );
                        }}
                      >
                        <span>New table</span>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        disabled={!editor?.isActive("table")}
                        title={editor?.isActive("table")
                          ? "Add row below cursor"
                          : "Cursor must be inside a table"}
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) => e.chain().focus().addRowAfter().run());
                        }}
                      >
                        <span>Add row</span>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        disabled={!editor?.isActive("table")}
                        title={editor?.isActive("table")
                          ? "Add column after cursor"
                          : "Cursor must be inside a table"}
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) => e.chain().focus().addColumnAfter().run());
                        }}
                      >
                        <span>Add column</span>
                      </button>
                    </div>
                  </div>

                  <!-- 5. Separator > -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    class="editor-dropdown-subitem-wrap"
                    onpointerenter={(e) => handleSubmenuEnter(e, "separator")}
                    onpointerleave={() => {
                      if (activeSubmenu === "separator") activeSubmenu = null;
                    }}
                  >
                    <button
                      type="button"
                      class="editor-dropdown-item"
                      onclick={() =>
                        (activeSubmenu =
                          activeSubmenu === "separator" ? null : "separator")}
                    >
                      <span>Separator</span>
                      <IconChevronRight
                        size={12}
                        strokeWidth={2.4}
                        class="text-[#718191]"
                      />
                    </button>
                    <div
                      class="editor-dropdown-submenu"
                      class:open-left={shouldOpenSubmenuLeft}
                      class:is-open={activeSubmenu === "separator"}
                    >
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) => e.chain().focus().setHorizontalRule().run());
                        }}
                      >
                        <span>Horizontal rule</span>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) =>
                            e
                              .chain()
                              .focus()
                              .insertContent([
                                {
                                  type: "sectionGap",
                                  attrs: { size: "small" },
                                },
                                { type: "paragraph" },
                              ])
                              .run(),
                          );
                        }}
                      >
                        <span>Section gap (S)</span>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) =>
                            e
                              .chain()
                              .focus()
                              .insertContent([
                                {
                                  type: "sectionGap",
                                  attrs: { size: "medium" },
                                },
                                { type: "paragraph" },
                              ])
                              .run(),
                          );
                        }}
                      >
                        <span>Section gap (M)</span>
                      </button>
                      <button
                        type="button"
                        class="editor-dropdown-item"
                        onclick={() => {
                          activeToolbarMenu = null;
                          activeSubmenu = null;
                          run((e) =>
                            e
                              .chain()
                              .focus()
                              .insertContent([
                                {
                                  type: "sectionGap",
                                  attrs: { size: "large" },
                                },
                                { type: "paragraph" },
                              ])
                              .run(),
                          );
                        }}
                      >
                        <span>Section gap (Large)</span>
                      </button>
                    </div>
                  </div>
                </div>
              {/if}
            </div>

            <!-- Media Drawer Toggle -->
            <button
              type="button"
              class:is-active={isMediaSidebarOpen}
              class="inline-flex items-center gap-1 font-black"
              onclick={() => (isMediaSidebarOpen = !isMediaSidebarOpen)}
              title="Manage story media library"
            >
              <IconMedia size={12} strokeWidth={2.4} />
              <span>Media</span>
              {#if mediaCount > 0}
                <span
                  class="rounded-full bg-[#8fb8d8]/35 px-1.5 text-[10px] text-[#344253]"
                  >{mediaCount}</span
                >
              {/if}
            </button>
          </div>
        </div>
      {:else}
        <!-- CONTEXTUAL MEDIA TOOLBAR: Option 1 -->
        <div
          class="editor-toolbar-row flex items-center justify-between w-full"
          role="toolbar"
          aria-label="Media settings"
        >
          <div class="flex items-center gap-2 flex-wrap">
            <!-- 1. Layout: Wrap L | No Wrap | Wrap R | Row -->
            <div class="editor-toolbar-group" aria-label="Text wrap options">
              <button
                type="button"
                class:is-active={currentMediaLayout === "left"}
                onclick={() => updateMedia({ mediaLayout: "left" })}
                title="Wrap text around right of media">Wrap L</button
              >
              <button
                type="button"
                class:is-active={currentMediaLayout === "standalone"}
                onclick={() => updateMedia({ mediaLayout: "standalone" })}
                title="Standalone centered (no text wrap)">No Wrap</button
              >
              <button
                type="button"
                class:is-active={currentMediaLayout === "right"}
                onclick={() => updateMedia({ mediaLayout: "right" })}
                title="Wrap text around left of media">Wrap R</button
              >
              <button
                type="button"
                class:is-active={currentMediaLayout === "row"}
                onclick={() =>
                  updateMedia({
                    mediaLayout: "row",
                    mediaWidth: Math.min(mediaWidth, 50),
                  })}
                title="Side-by-side row layout">Row</button
              >
            </div>

            <div class="editor-toolbar-separator" aria-hidden="true"></div>

            <!-- 2. Slider Width: 100% -->
            <div class="editor-toolbar-group">
              <div
                class="editor-media-size"
                role="group"
                aria-label="Media width"
              >
                <span class="editor-media-label">Width</span>
                <span class="editor-range-control">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={displayMediaWidth}
                    aria-label="Media width percentage"
                    oninput={(event) => {
                      const val = Number(event.currentTarget.value);
                      slidingWidth = val;
                      updateMedia({ mediaWidth: val });
                    }}
                    onchange={(event) => {
                      const val = Number(event.currentTarget.value);
                      slidingWidth = null;
                      updateMedia({ mediaWidth: val });
                    }}
                  />
                </span>
                <span class="editor-media-value">{displayMediaWidth}%</span>
              </div>
            </div>

            <div class="editor-toolbar-separator" aria-hidden="true"></div>

            <!-- 3. Replace / Delete -->
            <div class="editor-toolbar-group">
              <!-- Replace dropdown -->
              <div class="editor-toolbar-dropdown" data-toolbar-dropdown>
                <button
                  type="button"
                  onclick={() =>
                    (activeToolbarMenu =
                      activeToolbarMenu === "replace" ? null : "replace")}
                  class="inline-flex items-center gap-1 font-bold"
                  title="Replace media asset"
                  aria-expanded={activeToolbarMenu === "replace"}
                >
                  <IconReload size={13} strokeWidth={2.4} />
                  <span>Replace</span>
                  <IconChevronDown size={11} strokeWidth={2.4} />
                </button>

                {#if activeToolbarMenu === "replace"}
                  <div class="editor-dropdown-menu" role="menu">
                    {#if selectedMedia !== "youtube"}
                      <label class="editor-dropdown-item cursor-pointer">
                        <span>Replace</span>
                        <input
                          type="file"
                          class="sr-only"
                          accept={selectedMedia === "image"
                            ? "image/*, .gif, .png, .jpg, .jpeg, .webp"
                            : `${selectedMedia}/*`}
                          onchange={(e) => handleReplaceUpload(e)}
                        />
                      </label>
                    {/if}
                    <button
                      type="button"
                      class="editor-dropdown-item"
                      onclick={() => {
                        activeToolbarMenu = null;
                        if (selectedMedia) openMediaDialog(selectedMedia);
                      }}
                    >
                      <span>Edit URL / Source</span>
                    </button>
                  </div>
                {/if}
              </div>

              <!-- Delete -->
              <button
                type="button"
                onclick={deleteSelectedMedia}
                class="inline-flex items-center gap-1 font-bold text-red-600 hover:bg-red-50"
                title="Delete media from post (Ctrl+Z to undo)"
              >
                <IconTrash size={13} strokeWidth={2.4} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <!-- Close / Deselect button -->
          <button
            type="button"
            onclick={deselectMedia}
            class="text-[#718191] hover:text-[#344253] p-1.5 rounded-lg hover:bg-[#8fb8d8]/20 transition-colors"
            title="Deselect media and return to text editing"
          >
            <IconClose size={15} strokeWidth={2.4} />
          </button>
        </div>
      {/if}
    </div>
  {/if}
  <div class="editor-document-wrap"><div bind:this={editorElement}></div></div>
  {#if editor}<div class="editor-footer-bar" aria-live="polite">
      {#if uploading}
        <span class="mr-auto font-black text-[#5a8bb0] animate-pulse"
          >Uploading {uploading}…</span
        >
      {:else if uploadError}
        <span class="mr-auto font-black text-[#8b4b50]" role="alert"
          >{uploadError}</span
        >
      {/if}
      <span>{editor.storage.characterCount.words()} words</span><span
        >{editor.storage.characterCount.characters()} characters</span
      ><span
        >{Math.max(1, Math.ceil(editor.storage.characterCount.words() / 220))} min
        read</span
      >
    </div>{/if}
  {#if uploadError}<p class="form-error editor-error" role="alert">
      {uploadError}
    </p>{/if}

  {#if uploading}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#24303e]/60 backdrop-blur-[2px] cursor-wait select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Uploading media"
      transition:fade={{ duration: 180 }}
    >
      <div
        class="flex flex-col items-center gap-4 rounded-[26px] border border-[#4f5f70]/20 bg-[#fffdf3]/80 backdrop-blur-md px-10 py-8 shadow-[0_20px_48px_rgba(52,66,83,0.22)] text-center max-w-xs mx-4"
        transition:scale={{ duration: 180, start: 0.95 }}
      >
        <IconReload
          size={44}
          strokeWidth={2.5}
          class="animate-spin text-[#4f5f70]"
        />
        <p
          class="text-lg sm:text-xl font-black text-[#344253] tracking-tight capitalize"
        >
          Uploading {uploading}…
        </p>
      </div>
    </div>
  {/if}

  {#if showFloatingMenu && !activeDialog}
    <!-- Floating contextual menu for selected text -->
    <div
      bind:this={floatingMenuElement}
      data-floating-menu
      role="toolbar"
      aria-label="Floating text formatting"
      transition:scale={{ duration: 140, start: 0.94 }}
      class="fixed z-40 flex items-center gap-1 rounded-2xl border border-[#d6d5ca] bg-[#fffdf3]/95 px-2 py-1.5 shadow-[0_12px_32px_rgba(52,66,83,0.18)] backdrop-blur-md select-none"
      style="left: {floatingMenuPos.x}px; top: {floatingMenuPos.y}px; transform: translate(-50%, {floatingMenuPos.placement ===
      'top'
        ? '-100%'
        : '0'});"
    >
      <!-- B -->
      <button
        type="button"
        title="Bold (Ctrl+B)"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() =>
          formatAction((e) => e.chain().focus().toggleBold().run())}
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer {active(
          'bold',
        )
          ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
          : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
      >
        <strong class="text-sm font-black">B</strong>
      </button>

      <!-- I -->
      <button
        type="button"
        title="Italic (Ctrl+I)"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() =>
          formatAction((e) => e.chain().focus().toggleItalic().run())}
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer {active(
          'italic',
        )
          ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
          : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
      >
        <em class="font-serif italic text-sm font-black">I</em>
      </button>

      <!-- U -->
      <button
        type="button"
        title="Underline (Ctrl+U)"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() =>
          formatAction((e) => e.chain().focus().toggleUnderline().run())}
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer {active(
          'underline',
        )
          ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
          : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
      >
        <span class="underline underline-offset-2 text-sm font-black">U</span>
      </button>

      <!-- S -->
      <button
        type="button"
        title="Strikethrough"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() =>
          formatAction((e) => e.chain().focus().toggleStrike().run())}
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black transition-all cursor-pointer {active(
          'strike',
        )
          ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
          : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
      >
        <span class="line-through text-sm font-black">S</span>
      </button>

      <!-- Code (with icon) -->
      <button
        type="button"
        title="Inline code"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() =>
          formatAction((e) => e.chain().focus().toggleCode().run())}
        class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-black transition-all cursor-pointer {active(
          'code',
        )
          ? 'bg-[#344253] text-[#fffdf3] shadow-xs'
          : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
      >
        <IconCode size={13} strokeWidth={2.4} class="shrink-0" />
        <span>Code</span>
      </button>

      <!-- Divider -->
      <div class="mx-1 h-4 w-[1px] bg-[#d6d5ca]" aria-hidden="true"></div>

      <!-- Lists ▾ Dropdown -->
      <div class="relative" data-floating-dropdown>
        <button
          type="button"
          onpointerdown={(e) => e.preventDefault()}
          onclick={() =>
            (openDropdown = openDropdown === "lists" ? null : "lists")}
          aria-haspopup="menu"
          aria-expanded={openDropdown === "lists"}
          class="inline-flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-xs font-black transition-all cursor-pointer {active(
            'bulletList',
          ) ||
          active('orderedList') ||
          active('taskList')
            ? 'bg-[#344253] text-[#fffdf3]'
            : openDropdown === 'lists'
              ? 'bg-[#8fb8d8]/25 text-[#344253]'
              : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
        >
          <span>Lists</span>
          <IconChevronDown
            size={12}
            strokeWidth={2.5}
            class="transition-transform duration-200 {openDropdown === 'lists'
              ? 'rotate-180'
              : ''}"
          />
        </button>

        {#if openDropdown === "lists"}
          <div
            role="menu"
            data-floating-dropdown
            transition:scale={{ duration: 120, start: 0.95 }}
            class="absolute left-0 {floatingMenuPos.placement === 'top'
              ? 'bottom-full mb-2'
              : 'top-full mt-2'} min-w-[136px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] p-1 shadow-[0_12px_28px_rgba(52,66,83,0.18)] z-50 flex flex-col gap-0.5"
          >
            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) => e.chain().focus().toggleBulletList().run());
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                'bulletList',
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Bullets</span>
              {#if active("bulletList")}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>

            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) =>
                  e.chain().focus().toggleOrderedList().run(),
                );
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                'orderedList',
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Numbered</span>
              {#if active("orderedList")}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>

            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) => e.chain().focus().toggleTaskList().run());
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                'taskList',
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Checklist</span>
              {#if active("taskList")}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>
          </div>
        {/if}
      </div>

      <!-- Alignment ▾ Dropdown -->
      <div class="relative" data-floating-dropdown>
        <button
          type="button"
          onpointerdown={(e) => e.preventDefault()}
          onclick={() =>
            (openDropdown = openDropdown === "align" ? null : "align")}
          aria-haspopup="menu"
          aria-expanded={openDropdown === "align"}
          class="inline-flex h-8 items-center justify-center gap-1 rounded-lg px-2 text-xs font-black transition-all cursor-pointer {active(
            { textAlign: 'center' },
          ) ||
          active({ textAlign: 'right' }) ||
          active({ textAlign: 'justify' })
            ? 'bg-[#344253] text-[#fffdf3]'
            : openDropdown === 'align'
              ? 'bg-[#8fb8d8]/25 text-[#344253]'
              : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
        >
          <span>Alignment</span>
          <IconChevronDown
            size={12}
            strokeWidth={2.5}
            class="transition-transform duration-200 {openDropdown === 'align'
              ? 'rotate-180'
              : ''}"
          />
        </button>

        {#if openDropdown === "align"}
          <div
            role="menu"
            data-floating-dropdown
            transition:scale={{ duration: 120, start: 0.95 }}
            class="absolute left-1/2 -translate-x-1/2 {floatingMenuPos.placement ===
            'top'
              ? 'bottom-full mb-2'
              : 'top-full mt-2'} min-w-[136px] rounded-xl border border-[#d6d5ca] bg-[#fffdf3] p-1 shadow-[0_12px_28px_rgba(52,66,83,0.18)] z-50 flex flex-col gap-0.5"
          >
            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) =>
                  e.chain().focus().setTextAlign("left").run(),
                );
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                { textAlign: 'left' },
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Left</span>
              {#if active({ textAlign: "left" })}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>

            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) =>
                  e.chain().focus().setTextAlign("center").run(),
                );
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                { textAlign: 'center' },
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Center</span>
              {#if active({ textAlign: "center" })}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>

            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) =>
                  e.chain().focus().setTextAlign("right").run(),
                );
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                { textAlign: 'right' },
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Right</span>
              {#if active({ textAlign: "right" })}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>

            <button
              type="button"
              role="menuitem"
              onpointerdown={(e) => e.preventDefault()}
              onclick={() => {
                formatAction((e) =>
                  e.chain().focus().setTextAlign("justify").run(),
                );
              }}
              class="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-xs font-black transition-colors cursor-pointer {active(
                { textAlign: 'justify' },
              )
                ? 'bg-[#344253] text-[#fffdf3]'
                : 'text-[#4f5f70] hover:bg-[#8fb8d8]/20 hover:text-[#344253]'}"
            >
              <span>Justify</span>
              {#if active({ textAlign: "justify" })}
                <IconCheck size={12} strokeWidth={3} />
              {/if}
            </button>
          </div>
        {/if}
      </div>

      <!-- Divider -->
      <div class="mx-1 h-4 w-[1px] bg-[#d6d5ca]" aria-hidden="true"></div>

      <!-- + Insert (link) -->
      <div class="flex items-center gap-1">
        <button
          type="button"
          title="Insert or edit link (Ctrl+K)"
          onpointerdown={(e) => e.preventDefault()}
          onclick={() => {
            openDropdown = null;
            openLinkDialog();
          }}
          class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-black transition-all cursor-pointer {active(
            'link',
          )
            ? 'bg-[#8fb8d8]/30 text-[#344253] border border-[#8fb8d8]'
            : 'bg-[#4f5f70] text-[#fffdf3] hover:bg-[#344253]'}"
        >
          {#if active("link")}
            <IconLink size={13} strokeWidth={2.4} />
            <span>Link</span>
          {:else}
            <IconPlus size={13} strokeWidth={2.8} />
            <span>Insert</span>
          {/if}
        </button>

        {#if active("link")}
          <button
            type="button"
            title="Remove link"
            onpointerdown={(e) => e.preventDefault()}
            onclick={() =>
              formatAction((e) => e.chain().focus().unsetLink().run())}
            class="inline-flex h-8 w-7 items-center justify-center rounded-lg text-[#8b4b50] hover:bg-[#8b4b50]/15 transition-colors cursor-pointer"
            aria-label="Remove link"
          >
            <IconClose size={12} strokeWidth={2.5} />
          </button>
        {/if}
      </div>
    </div>
  {/if}

  {#if showTableMenu && !activeDialog && !selectedMedia}
    <!-- Floating contextual menu for active table -->
    <div
      bind:this={tableMenuElement}
      data-floating-table-menu
      role="toolbar"
      aria-label="Table options"
      transition:scale={{ duration: 130, start: 0.95 }}
      class="editor-floating-table-menu"
      style="left: {tableMenuPos.x}px; top: {tableMenuPos.y}px; --menu-y-transform: {tableMenuPos.placement ===
      'top'
        ? '-100%'
        : '0'};"
    >
      <!-- Row operations -->
      <button
        type="button"
        title="Insert row above"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().addRowBefore().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>+ Row Above</span>
      </button>
      <button
        type="button"
        title="Insert row below"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().addRowAfter().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>+ Row Below</span>
      </button>
      <button
        type="button"
        title="Delete current row"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().deleteRow().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>Delete Row</span>
      </button>

      <div class="editor-floating-table-divider" aria-hidden="true"></div>

      <!-- Column operations -->
      <button
        type="button"
        title="Insert column before"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().addColumnBefore().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>+ Col Left</span>
      </button>
      <button
        type="button"
        title="Insert column after"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().addColumnAfter().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>+ Col Right</span>
      </button>
      <button
        type="button"
        title="Delete current column"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().deleteColumn().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>Delete Col</span>
      </button>

      <div class="editor-floating-table-divider" aria-hidden="true"></div>

      <!-- Header row toggle -->
      <button
        type="button"
        title="Toggle header row"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().toggleHeaderRow().run());
          requestAnimationFrame(updateTableMenu);
        }}
      >
        <span>Header</span>
      </button>

      <div class="editor-floating-table-divider" aria-hidden="true"></div>

      <!-- Delete Table -->
      <button
        type="button"
        class="danger inline-flex items-center gap-1.5"
        title="Delete table"
        onpointerdown={(e) => e.preventDefault()}
        onclick={() => {
          run((e) => e.chain().focus().deleteTable().run());
          showTableMenu = false;
        }}
      >
        <IconTrash size={13} strokeWidth={2.4} class="shrink-0" />
        <span class="leading-none">Delete table</span>
      </button>
    </div>
  {/if}

  {#if activeDialog}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#344253]/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editor-dialog-title"
      tabindex="-1"
      transition:fade={{ duration: 180 }}
      onclick={(e) => {
        if (e.target === e.currentTarget) closeDialog();
      }}
      onkeydown={(e) => {
        if (e.key === "Escape") closeDialog();
      }}
    >
      <div
        class="relative w-full max-w-md rounded-2xl border-2 border-[#d6d5ca] bg-[#fffdf3] p-5 sm:p-6 text-[#344253] shadow-[0_20px_50px_rgba(52,66,83,0.25)]"
        transition:scale={{ duration: 180, start: 0.95 }}
      >
        <div
          class="flex items-center justify-between pb-3 border-b border-[#d6d5ca]/60"
        >
          <h3
            id="editor-dialog-title"
            class="text-base sm:text-lg font-black text-[#4f5f70] tracking-tight m-0"
          >
            {#if activeDialog === "link"}
              {editor?.isActive("link") ? "Edit link" : "Insert link"}
            {:else if activeDialog === "image"}
              Insert image or GIF URL
            {:else if activeDialog === "youtube"}
              Insert YouTube video
            {:else if activeDialog === "video"}
              Insert video URL
            {:else if activeDialog === "audio"}
              Insert audio URL
            {/if}
          </h3>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#718191] hover:bg-[#8fb8d8]/20 hover:text-[#344253] transition-colors cursor-pointer"
            onclick={closeDialog}
            aria-label="Close dialog"
          >
            <IconClose size={14} />
          </button>
        </div>

        <form
          class="mt-4 flex flex-col gap-4"
          onsubmit={(e) => {
            e.preventDefault();
            if (activeDialog === "link") applyLink();
            else applyMedia();
          }}
        >
          <div class="flex flex-col gap-1.5 text-left">
            <label
              for="editor-dialog-url"
              class="text-xs font-black uppercase tracking-wider text-[#607182]"
            >
              {#if activeDialog === "link"}
                Address (URL)
              {:else if activeDialog === "image"}
                Image / GIF URL (HTTPS)
              {:else if activeDialog === "video"}
                Video URL (MP4, WebM or YouTube)
              {:else if activeDialog === "audio"}
                Audio URL (MP3, OGG, WAV)
              {:else}
                YouTube URL
              {/if}
            </label>
            <input
              id="editor-dialog-url"
              type="text"
              use:focusInput
              bind:value={dialogUrl}
              placeholder={activeDialog === "link"
                ? "https://example.com or mailto:..."
                : activeDialog === "image"
                  ? "https://... (.gif, .png, .jpg, .webp)"
                  : activeDialog === "video"
                    ? "https://... (.mp4, .webm) or YouTube URL"
                    : activeDialog === "audio"
                      ? "https://... (.mp3, .ogg, .wav)"
                      : "https://www.youtube.com/watch?v=..."}
              class="h-11 w-full rounded-xl border-2 border-[#d6d5ca] bg-[#f6f1e8]/50 px-3.5 text-sm font-semibold text-[#344253] outline-none transition-all placeholder:text-[#9aa3aa] focus:border-[#4f5f70] focus:bg-[#fffdf3] focus:ring-2 focus:ring-[#8fb8d8]/30"
              required
            />
          </div>

          {#if activeDialog === "link"}
            <div class="flex flex-col gap-1.5 text-left">
              <label
                for="editor-dialog-text"
                class="text-xs font-black uppercase tracking-wider text-[#607182]"
              >
                Text to display
              </label>
              <input
                id="editor-dialog-text"
                type="text"
                bind:value={dialogText}
                placeholder="e.g. Renhet Studio"
                class="h-11 w-full rounded-xl border-2 border-[#d6d5ca] bg-[#f6f1e8]/50 px-3.5 text-sm font-semibold text-[#344253] outline-none transition-all placeholder:text-[#9aa3aa] focus:border-[#4f5f70] focus:bg-[#fffdf3] focus:ring-2 focus:ring-[#8fb8d8]/30"
              />
              <span class="text-[11px] font-bold text-[#8a98a5]">
                Leave empty to keep current text or use the URL.
              </span>
            </div>
          {:else if activeDialog === "image"}
            <div class="flex flex-col gap-1.5 text-left">
              <label
                for="editor-dialog-alt"
                class="text-xs font-black uppercase tracking-wider text-[#607182]"
              >
                Description (Alt text)
              </label>
              <input
                id="editor-dialog-alt"
                type="text"
                bind:value={dialogText}
                placeholder="Short description for accessibility"
                class="h-11 w-full rounded-xl border-2 border-[#d6d5ca] bg-[#f6f1e8]/50 px-3.5 text-sm font-semibold text-[#344253] outline-none transition-all placeholder:text-[#9aa3aa] focus:border-[#4f5f70] focus:bg-[#fffdf3] focus:ring-2 focus:ring-[#8fb8d8]/30"
              />
            </div>
          {/if}

          <div
            class="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-[#d6d5ca]/40"
          >
            <div>
              {#if activeDialog === "link" && editor?.isActive("link")}
                <button
                  type="button"
                  onclick={removeLink}
                  class="inline-flex h-9 items-center justify-center rounded-full border border-[#8b4b50]/30 bg-transparent px-3.5 text-xs font-black text-[#8b4b50] hover:bg-[#8b4b50]/10 transition-colors cursor-pointer"
                >
                  Remove link
                </button>
              {/if}
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                onclick={closeDialog}
                class="inline-flex h-9 items-center justify-center rounded-full border border-[#4f5f70]/20 bg-[#fffdf3] px-4 text-xs font-bold text-[#4f5f70] hover:bg-[#8fb8d8]/15 hover:border-[#8fb8d8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex h-9 items-center justify-center rounded-full bg-[#4f5f70] px-5 text-xs font-black text-[#fffdf3] shadow-[0_2px_10px_rgba(79,95,112,0.2)] hover:bg-[#344253] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                {activeDialog === "link"
                  ? editor?.isActive("link")
                    ? "Update link"
                    : "Insert link"
                  : "Insert"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <MediaDrawer
    editor={editor ?? undefined}
    isOpen={isMediaSidebarOpen}
    {revision}
    onClose={() => (isMediaSidebarOpen = false)}
    onMediaCountChange={(c) => (mediaCount = c)}
  />
</div>
