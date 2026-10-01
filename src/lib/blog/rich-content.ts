import type { JSONContent } from "@tiptap/core";

const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character] ?? character);

function safeUrl(value: unknown, protocols = ["https:", "mailto:"]) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return protocols.includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function youtubeEmbed(value: unknown) {
  const source = safeUrl(value, ["https:"]);
  if (!source) return null;
  const url = new URL(source);
  const id = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v") ?? url.pathname.split("/").pop();
  return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

function mediaAttrs(node: JSONContent) {
  const layout = ["left", "right", "row"].includes(String(node.attrs?.mediaLayout)) ? String(node.attrs?.mediaLayout) : "standalone";
  const width = Math.min(100, Math.max(10, Math.round((Number(node.attrs?.mediaWidth) || 100) / 5) * 5));
  return ` data-media-layout="${layout}" data-media-width="${width}"`;
}

function alignAttr(node: JSONContent) {
  const align = String(node.attrs?.textAlign ?? "");
  return ["left", "center", "right", "justify"].includes(align) ? ` data-text-align="${align}"` : "";
}

function renderText(node: JSONContent) {
  let content = escapeHtml(node.text);
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") content = `<strong>${content}</strong>`;
    if (mark.type === "italic") content = `<em>${content}</em>`;
    if (mark.type === "underline") content = `<u>${content}</u>`;
    if (mark.type === "strike") content = `<s>${content}</s>`;
    if (mark.type === "code") content = `<code>${content}</code>`;
    if (mark.type === "highlight") content = `<mark>${content}</mark>`;
    if (mark.type === "link") {
      const href = safeUrl(mark.attrs?.href);
      if (href) content = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }
  }
  return content;
}

function renderNode(node: JSONContent): string {
  if (node.type === "text") return renderText(node);
  const children = (node.content ?? []).map(renderNode).join("");
  const align = alignAttr(node);
  switch (node.type) {
    case "doc": return children;
    case "paragraph": return `<p${align}>${children}</p>`;
    case "heading": {
      const level = Math.min(3, Math.max(1, Number(node.attrs?.level) || 2));
      return `<h${level}${align}>${children}</h${level}>`;
    }
    case "bulletList": return `<ul>${children}</ul>`;
    case "orderedList": return `<ol>${children}</ol>`;
    case "listItem": return `<li>${children}</li>`;
    case "taskList": return `<ul class="content-task-list">${children}</ul>`;
    case "taskItem": return `<li class="content-task-item"><input type="checkbox" ${node.attrs?.checked ? "checked " : ""}disabled aria-label="Checklist item"><div>${children}</div></li>`;
    case "blockquote": return `<blockquote>${children}</blockquote>`;
    case "codeBlock": return `<pre><code>${children}</code></pre>`;
    case "horizontalRule": return "<hr>";
    case "sectionGap": {
      const size = ["small", "medium", "large"].includes(String(node.attrs?.size)) ? String(node.attrs?.size) : "medium";
      return `<div aria-hidden="true" class="content-section-gap" data-gap-size="${size}"></div>`;
    }
    case "hardBreak": return "<br>";
    case "image": {
      const src = safeUrl(node.attrs?.src, ["https:"]);
      if (!src) return "";
      const caption = node.attrs?.title ? `<figcaption>${escapeHtml(node.attrs.title)}</figcaption>` : "";
      return `<figure class="content-media"${mediaAttrs(node)}><img src="${escapeHtml(src)}" alt="${escapeHtml(node.attrs?.alt)}" loading="lazy" decoding="async">${caption}</figure>`;
    }
    case "youtube": {
      const src = youtubeEmbed(node.attrs?.src);
      return src ? `<div class="content-embed"${mediaAttrs(node)}><iframe src="${src}" title="Embedded YouTube video" allowfullscreen loading="lazy"></iframe></div>` : "";
    }
    case "video":
    case "audio": {
      const src = safeUrl(node.attrs?.src, ["https:"]);
      return src ? `<${node.type} class="content-media"${mediaAttrs(node)} src="${escapeHtml(src)}" controls preload="metadata"></${node.type}>` : "";
    }
    case "table": return `<div class="content-table-wrap"><table>${children}</table></div>`;
    case "tableRow": return `<tr>${children}</tr>`;
    case "tableHeader": return `<th${align}>${children}</th>`;
    case "tableCell": return `<td${align}>${children}</td>`;
    default: return children;
  }
}

export function renderRichContent(content: JSONContent) {
  return renderNode(content);
}
