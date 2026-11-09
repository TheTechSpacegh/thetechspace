// Header search: jump to any admin page or task, or straight into a post,
// team member, project… by name. Ctrl/⌘+K or "/" focuses it; arrow keys
// pick, Enter goes, Escape clears.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Briefcase, FileText, FolderKanban, Loader2, Milestone, Quote, SearchIcon, Users } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { API_URL, api } from "@/lib/api";
import { destinations } from "../lib/nav";

const CONTENT_ICONS = {
  Post: FileText,
  "Team member": Users,
  Service: Briefcase,
  Project: FolderKanban,
  Testimonial: Quote,
  Milestone,
};

const matchPages = (query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return destinations
    .filter((d) => words.every((w) => `${d.title} ${d.keywords ?? ""}`.toLowerCase().includes(w)))
    .slice(0, 4);
};

// Content matches from the API, fetched after a short pause in typing.
function useContentSearch(query) {
  const [state, setState] = useState({ query: "", results: [], loading: false });
  const q = query.trim();

  useEffect(() => {
    if (!API_URL || q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setState((s) => ({ ...s, loading: true }));
      api(`/api/admin/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((body) => setState({ query: q, results: body.results, loading: false }))
        .catch((err) => {
          // A failed search shows "nothing matches" rather than spinning forever.
          if (err.name !== "AbortError") setState({ query: q, results: [], loading: false });
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // Results for an older query never show against a newer one.
  const fresh = state.query === q;
  return { results: fresh ? state.results : [], loading: Boolean(API_URL) && q.length >= 2 && (state.loading || !fresh) };
}

export default function AdminSearch() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const listId = useId();
  const content = useContentSearch(query);

  const results = useMemo(
    () => [
      ...matchPages(query).map((d) => ({ ...d, group: "Pages" })),
      ...content.results.map((r) => ({ ...r, icon: CONTENT_ICONS[r.type] ?? FileText, group: "Content" })),
    ],
    [query, content.results],
  );
  const open = query.trim().length > 0;
  const current = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (destination) => {
    navigate(destination.href);
    setQuery("");
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setActive((current + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter" && results[current]) {
      e.preventDefault();
      go(results[current]);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  return (
    <div className="relative hidden md:block">
      <InputGroup className="h-9 w-64 rounded-lg bg-card">
        <InputGroupInput
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setQuery("")}
          placeholder="Search or jump to…"
          aria-label="Search content or jump to a page"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && results[current] ? `${listId}-${current}` : undefined}
          aria-autocomplete="list"
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <kbd className="rounded border bg-muted px-1.5 font-sans text-xs text-muted-foreground">Ctrl K</kbd>
        </InputGroupAddon>
      </InputGroup>

      {open && (
        <ul id={listId} role="listbox" aria-busy={content.loading} className="absolute right-0 z-30 mt-1.5 max-h-96 w-80 overflow-y-auto rounded-xl border bg-popover p-1 text-sm shadow-lg">
          {results.map((d, i) => (
            <li
              key={`${d.group}-${d.id ?? d.title}-${d.href}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === current}
              onMouseDown={(e) => {
                e.preventDefault();
                go(d);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 ${i === current ? "bg-accent text-accent-foreground" : "text-foreground"}`}
            >
              <d.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{d.title}</span>
              {d.group === "Content" && <span className="shrink-0 text-xs text-muted-foreground">{d.type}{d.detail ? ` · ${d.detail}` : ""}</span>}
            </li>
          ))}
          {content.loading && (
            <li className="flex items-center gap-2 px-3 py-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Searching content…
            </li>
          )}
          {!content.loading && results.length === 0 && <li className="px-3 py-2.5 text-muted-foreground">Nothing matches "{query.trim()}"</li>}
        </ul>
      )}
    </div>
  );
}
