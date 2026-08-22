import type { JSONContent } from "@tiptap/react";

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
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const id = url.hostname.includes("youtu.be")
      ? url.pathname.slice(1)
      : url.searchParams.get("v") ?? url.pathname.split("/").pop();
    return id && /^[\w-]{6,20}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

function mediaLayout(value: unknown) {
  return ["left", "right", "row"].includes(String(value)) ? String(value) : "standalone";
}

function mediaWidth(value: unknown) {
  return Math.min(100, Math.max(10, Math.round((Number(value) || 100) / 5) * 5));
}

function textAlign(value: unknown) {
  return ["left", "center", "right", "justify"].includes(String(value)) ? String(value) : undefined;
}

function sectionGapSize(value: unknown) {
  return ["small", "medium", "large"].includes(String(value)) ? String(value) : "medium";
}

function renderText(node: JSONContent, key: string) {
  let content: React.ReactNode = node.text ?? "";
  for (const [index, mark] of (node.marks ?? []).entries()) {
    const markKey = `${key}-mark-${index}`;
    if (mark.type === "bold") content = <strong key={markKey}>{content}</strong>;
    if (mark.type === "italic") content = <em key={markKey}>{content}</em>;
    if (mark.type === "underline") content = <u key={markKey}>{content}</u>;
    if (mark.type === "strike") content = <s key={markKey}>{content}</s>;
    if (mark.type === "code") content = <code key={markKey}>{content}</code>;
    if (mark.type === "highlight") content = <mark key={markKey}>{content}</mark>;
    if (mark.type === "link") {
      const href = safeUrl(mark.attrs?.href);
      if (href) content = <a key={markKey} href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
  }
  return content;
}

function renderNode(node: JSONContent, key: string): React.ReactNode {
  if (node.type === "text") return renderText(node, key);
  const children = node.content?.map((child, index) => renderNode(child, `${key}-${index}`));
  const align = textAlign(node.attrs?.textAlign);

  switch (node.type) {
    case "doc": return <>{children}</>;
    case "paragraph": return <p key={key} data-text-align={align}>{children}</p>;
    case "heading": {
      const level = Math.min(3, Math.max(1, Number(node.attrs?.level) || 2));
      if (level === 1) return <h1 key={key} data-text-align={align}>{children}</h1>;
      if (level === 3) return <h3 key={key} data-text-align={align}>{children}</h3>;
      return <h2 key={key} data-text-align={align}>{children}</h2>;
    }
    case "bulletList": return <ul key={key}>{children}</ul>;
    case "orderedList": return <ol key={key}>{children}</ol>;
    case "listItem": return <li key={key}>{children}</li>;
    case "taskList": return <ul className="content-task-list" key={key}>{children}</ul>;
    case "taskItem": return (
      <li className="content-task-item" key={key}>
        <input type="checkbox" checked={Boolean(node.attrs?.checked)} readOnly aria-label="Checklist item" />
        <div>{children}</div>
      </li>
    );
    case "blockquote": return <blockquote key={key}>{children}</blockquote>;
    case "codeBlock": return <pre key={key}><code>{children}</code></pre>;
    case "horizontalRule": return <hr key={key} />;
    case "sectionGap": return (
      <div
        aria-hidden="true"
        className="content-section-gap"
        data-gap-size={sectionGapSize(node.attrs?.size)}
        key={key}
      />
    );
    case "hardBreak": return <br key={key} />;
    case "image": {
      const src = safeUrl(node.attrs?.src);
      if (!src) return null;
      return (
        <figure className="content-media" data-media-layout={mediaLayout(node.attrs?.mediaLayout)} data-media-width={mediaWidth(node.attrs?.mediaWidth)} key={key}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={typeof node.attrs?.alt === "string" ? node.attrs.alt : ""} loading="lazy" decoding="async" />
          {node.attrs?.title && <figcaption>{String(node.attrs.title)}</figcaption>}
        </figure>
      );
    }
    case "youtube": {
      const src = youtubeEmbed(node.attrs?.src);
      return src ? <div className="content-embed" data-media-layout={mediaLayout(node.attrs?.mediaLayout)} data-media-width={mediaWidth(node.attrs?.mediaWidth)} key={key}><iframe src={src} title="Embedded YouTube video" allowFullScreen loading="lazy" /></div> : null;
    }
    case "video": {
      const src = safeUrl(node.attrs?.src);
      return src ? <video className="content-media" data-media-layout={mediaLayout(node.attrs?.mediaLayout)} data-media-width={mediaWidth(node.attrs?.mediaWidth)} key={key} src={src} controls preload="metadata" /> : null;
    }
    case "audio": {
      const src = safeUrl(node.attrs?.src);
      return src ? <audio className="content-media" data-media-layout={mediaLayout(node.attrs?.mediaLayout)} data-media-width={mediaWidth(node.attrs?.mediaWidth)} key={key} src={src} controls preload="metadata" /> : null;
    }
    case "table": return <div className="content-table-wrap" key={key}><table>{children}</table></div>;
    case "tableRow": return <tr key={key}>{children}</tr>;
    case "tableHeader": return <th key={key} data-text-align={align}>{children}</th>;
    case "tableCell": return <td key={key} data-text-align={align}>{children}</td>;
    default: return children ? <div key={key}>{children}</div> : null;
  }
}

export function RichContent({ content }: { content: JSONContent }) {
  return <div className="rich-content">{renderNode(content, "content")}</div>;
}
