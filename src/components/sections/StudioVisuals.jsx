// Hero visuals for About and Team that say who TTS is without leaning on
// headshots. Inspo: Obsidian's manifesto card and Daniel Sun's grid-lit
// statement (dark field, words as the hero), plus a team-chat thread.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Code2, Eye, Lightbulb, Palette, Scale, TrendingUp, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFoundedYear } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1];

// ── About: principles panel ─────────────────────────────────────────────────
const principles = [
  { icon: Lightbulb, title: "Innovation", body: "Constantly pushing boundaries with modern technology and creative solutions." },
  { icon: Eye, title: "Transparency", body: "Open and honest collaboration at every stage of the process." },
  { icon: UserRound, title: "User-centric", body: "Empathy at our core. Every decision starts with the end user." },
  { icon: Scale, title: "Integrity", body: "Trust is our foundation. We deliver on every promise we make." },
];
const PRINCIPLE_MS = 4200;

export function PrinciplesPanel() {
  const founded = useFoundedYear();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setTimeout(() => setActive((i) => (i + 1) % principles.length), PRINCIPLE_MS);
    return () => clearTimeout(id);
  }, [active, paused, reduce]);

  return (
    <div
      className="relative mx-auto w-full max-w-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-violet-600/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0918]/90 shadow-2xl backdrop-blur">
        {/* editor tab bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="ml-2 rounded-md bg-white/[0.06] px-2.5 py-1 font-mono text-xs text-white/70">tts/principles.md</span>
        </div>

        <ol className="flex flex-col p-2">
          {principles.map((p, i) => {
            const open = i === active;
            return (
              <li key={p.title}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={open}
                  className={cn(
                    "relative w-full overflow-hidden rounded-xl px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-violet-300",
                    open ? "bg-white/[0.06]" : "hover:bg-white/[0.03]",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 font-mono text-xs tabular-nums text-white/35">0{i + 1}</span>
                    <p.icon className={cn("size-4 transition-colors", open ? "text-violet-300" : "text-white/40")} aria-hidden="true" />
                    <span className={cn("text-base font-semibold transition-colors", open ? "text-white" : "text-white/60")}>{p.title}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.span
                        key="body"
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduce ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="block overflow-hidden"
                      >
                        <span className="block pl-[3.25rem] pt-1.5 text-sm leading-relaxed text-white/65">{p.body}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* time until the next principle */}
                  {open && !reduce && (
                    <span
                      key={`${active}-${paused}`}
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-0 h-px origin-left bg-violet-400/70"
                      style={{ animation: paused ? "none" : `tts-progress ${PRINCIPLE_MS}ms linear forwards`, transform: paused ? "scaleX(0)" : undefined }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-4 py-3">
          {[
            { label: "Design", icon: Palette, cls: "text-violet-200 bg-violet-500/15" },
            { label: "Build", icon: Code2, cls: "text-sky-200 bg-sky-500/15" },
            { label: "Grow", icon: TrendingUp, cls: "text-emerald-200 bg-emerald-500/15" },
          ].map((d) => (
            <span key={d.label} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", d.cls)}>
              <d.icon className="size-3.5" aria-hidden="true" /> {d.label}
            </span>
          ))}
          <span className="ml-auto font-mono text-xs text-white/40">Since {founded}</span>
        </div>
      </div>
      <style>{`@keyframes tts-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </div>
  );
}

// ── Team: an example project thread ─────────────────────────────────────────
const DISCIPLINE = {
  client: "bg-white/10 text-white/80",
  design: "bg-violet-500/25 text-violet-100",
  build: "bg-sky-500/25 text-sky-100",
  lead: "bg-emerald-500/25 text-emerald-100",
};

// Roles shown here come from the live team list (Admin → Team), so a role
// change there shows up in this thread too. These are the built-in defaults.
const baseThread = [
  { who: "Ama", role: "Client · bakery owner", tone: "client", text: "We need online orders working before the holidays." },
  { who: "Jeffery", role: "Creative director", text: "Brand direction and three homepage ideas are in Figma. Pick a favourite?" },
  { who: "Emmanuella", role: "Product designer", text: "Checkout tested with five of your customers. It's two steps shorter now." },
  { who: "David", role: "Lead developer", text: "Staging is live. New orders ping your phone straight away." },
  { who: "Daniel", role: "CEO · full-stack", text: "Launch date locked. We'll watch the numbers with you after." },
];

// Colour by discipline, read from the role text.
const toneFor = (role) =>
  /design|creative|brand|ui|ux/i.test(role) ? "design" : /develop|engineer|full-stack|code/i.test(role) ? "build" : "lead";

function useThread(team) {
  return baseThread.map((m) => {
    if (m.tone === "client") return m;
    const member = team?.find((t) => t.name.split(" ")[0].toLowerCase() === m.who.toLowerCase());
    const role = member?.role ?? m.role;
    return { ...m, role, tone: toneFor(role) };
  });
}

const initials = (name) => name.slice(0, 2).toUpperCase();

function Message({ m }) {
  const mine = m.tone === "client";
  return (
    <div className={cn("flex items-end gap-2.5", mine && "flex-row-reverse")}>
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold", DISCIPLINE[m.tone])}>
        {initials(m.who)}
      </span>
      <div className={cn("max-w-[82%]", mine && "text-right")}>
        <p className="mb-1 text-xs text-white/45">
          <span className="font-semibold text-white/80">{m.who}</span> · {m.role}
        </p>
        <p
          className={cn(
            "inline-block rounded-2xl px-3.5 py-2.5 text-left text-sm leading-snug",
            mine ? "rounded-br-md bg-violet-600 text-white" : "rounded-bl-md bg-white/[0.07] text-white/85",
          )}
        >
          {m.text}
        </p>
      </div>
    </div>
  );
}

const STEP_MS = 1700;

export function ProjectThread({ team }) {
  const thread = useThread(team);
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? thread.length : 1);

  const total = thread.length;
  useEffect(() => {
    if (reduce) return;
    // Reveal one message at a time, hold the full thread, then start over.
    const done = shown >= total;
    const id = setTimeout(() => setShown(done ? 1 : shown + 1), done ? 5000 : STEP_MS);
    return () => clearTimeout(id);
  }, [shown, reduce, total]);

  const typing = !reduce && shown < thread.length ? thread[shown] : null;

  return (
    <figure className="relative mx-auto w-full max-w-md">
      <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-violet-600/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c0918]/90 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="font-mono text-sm text-white"># bakery-relaunch</p>
            <p className="text-xs text-white/45">Example project · one team, start to finish</p>
          </div>
          <span className="flex -space-x-1.5" aria-hidden="true">
            {thread.slice(1).map((m) => (
              <span key={m.who} className={cn("grid size-6 place-items-center rounded-full text-xs font-bold ring-2 ring-[#0c0918]", DISCIPLINE[m.tone])}>
                {m.who[0]}
              </span>
            ))}
          </span>
        </div>

        {/* Animated thread (decorative; the full text is in the list below for screen readers). */}
        <div
          aria-hidden="true"
          className="flex h-[17rem] flex-col justify-end sm:h-[22rem] gap-4 overflow-hidden px-4 py-4 [mask-image:linear-gradient(to_bottom,transparent,black_18%)]"
        >
          <AnimatePresence initial={false}>
            {thread.slice(0, shown).map((m) => (
              <motion.div
                key={m.who}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <Message m={m} />
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <div className="flex items-center gap-2 pl-10 text-xs text-white/40">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 animate-bounce rounded-full bg-white/40" style={{ animationDelay: `${d * 120}ms` }} />
                ))}
              </span>
              {typing.who} is typing
            </div>
          )}
        </div>

        <ol className="sr-only">
          {thread.map((m) => (
            <li key={m.who}>{m.who} ({m.role}): {m.text}</li>
          ))}
        </ol>

        <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-white/55">
          You're in the thread too, talking to the people doing the work.
        </figcaption>
      </div>
    </figure>
  );
}
