// Renders the Markdown that admins write for blog posts. It builds React
// elements directly (never innerHTML), so post content can't inject markup or
// scripts, and links are limited to http(s) and mailto.
//
// Supported: # / ## / ### headings, paragraphs, - and 1. lists, > quotes,
// ``` code blocks, **bold**, *italic*, `code` and [links](https://…).
import { Fragment } from "react";

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

function inline(text, keyPrefix) {
  const out = [];
  // Order matters: code first so its contents aren't parsed further.
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const token = m[0];
    const key = `${keyPrefix}-${i++}`;
    if (m[1]) out.push(<code key={key} className="rounded bg-violet-50 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-800">{token.slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={key} className="font-semibold text-slate-900">{inline(token.slice(2, -2), key)}</strong>);
    else if (m[3]) out.push(<em key={key}>{inline(token.slice(1, -1), key)}</em>);
    else {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      out.push(
        SAFE_HREF.test(href) ? (
          <a key={key} href={href} className="font-medium text-violet-700 underline underline-offset-2 hover:text-violet-900" {...(/^https?:/i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        ) : (
          label
        ),
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ source }) {
  const lines = String(source ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: `h${heading[1].length}`, text: heading[2] });
      i++;
      continue;
    }

    const listMatch = line.match(/^\s*([-*]|\d+\.)\s+/);
    if (listMatch) {
      const ordered = /\d/.test(listMatch[1]);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ""));
      blocks.push({ type: ordered ? "ol" : "ul", items });
      continue;
    }

    if (line.startsWith(">")) {
      const quote = [];
      while (i < lines.length && lines[i].startsWith(">")) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>|\s*([-*]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++].trim());
    blocks.push({ type: "p", text: para.join(" ") });
  }

  return (
    <div className="flex flex-col gap-5 text-lg leading-relaxed text-slate-700">
      {blocks.map((b, k) => {
        const key = `b${k}`;
        switch (b.type) {
          case "h1":
          case "h2":
            return <h2 key={key} className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{inline(b.text, key)}</h2>;
          case "h3":
            return <h3 key={key} className="mt-4 text-xl font-semibold text-slate-900">{inline(b.text, key)}</h3>;
          case "ul":
          case "ol": {
            const List = b.type;
            return (
              <List key={key} className={`flex flex-col gap-2 pl-6 ${b.type === "ul" ? "list-disc" : "list-decimal"} marker:text-violet-500`}>
                {b.items.map((item, j) => <li key={j}>{inline(item, `${key}-${j}`)}</li>)}
              </List>
            );
          }
          case "quote":
            return <blockquote key={key} className="border-l-4 border-violet-400 pl-5 italic text-slate-600">{inline(b.text, key)}</blockquote>;
          case "code":
            return <pre key={key} className="overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-sm leading-relaxed text-slate-100"><code>{b.text}</code></pre>;
          default:
            return <p key={key}>{inline(b.text, key).map((part, j) => <Fragment key={j}>{part}</Fragment>)}</p>;
        }
      })}
    </div>
  );
}
