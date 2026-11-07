// Header search: jump to any admin page or common task. Ctrl/⌘+K or "/"
// focuses it; arrow keys pick, Enter goes, Escape clears.
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { destinations } from "../lib/nav";

const matches = (query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return destinations
    .filter((d) => words.every((w) => `${d.title} ${d.keywords ?? ""}`.toLowerCase().includes(w)))
    .slice(0, 6);
};

export default function AdminSearch() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const listId = useId();
  const results = useMemo(() => matches(query), [query]);
  const open = query.trim().length > 0;

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
      if (results.length) setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
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
          placeholder="Jump to…"
          aria-label="Jump to a page or task"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
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
        <ul id={listId} role="listbox" className="absolute right-0 z-30 mt-1.5 w-72 overflow-hidden rounded-xl border bg-popover p-1 text-sm shadow-lg">
          {results.length === 0 && <li className="px-3 py-2.5 text-muted-foreground">Nothing matches "{query.trim()}"</li>}
          {results.map((d, i) => (
            <li
              key={`${d.title}-${d.href}`}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                go(d);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 ${i === active ? "bg-accent text-accent-foreground" : "text-foreground"}`}
            >
              <d.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              {d.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
