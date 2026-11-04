// Page-specific visuals for the dark inner-page heroes.
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "motion/react";
import { Code2, Palette, PenTool, TrendingUp, Compass, Mail, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaImage from "@/components/ui/MediaImage";

// ── Services: orbit spotlight (Shadcn Space orbiting-circles-03) ─────────────
const orbitServices = [
  { icon: Code2, title: "Websites & apps", description: "Fast, mobile-first builds." },
  { icon: PenTool, title: "UI/UX design", description: "Flows people get first time." },
  { icon: Palette, title: "Branding", description: "Logos, colours, collateral." },
  { icon: TrendingUp, title: "SEO & marketing", description: "Get found, then convert." },
  { icon: Compass, title: "Digital strategy", description: "Plans tied to your goals." },
];

export function ServiceOrbit() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const RADIUS = 150;

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setActive((p) => (p + 1) % orbitServices.length), 2600);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const current = orbitServices[active];

  return (
    <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden" aria-label="Our services">
      <style>{`@keyframes tts-orbit{0%{transform:rotate(var(--angle)) translateY(var(--radius)) rotate(calc(var(--angle) * -1))}100%{transform:rotate(calc(var(--angle) + 360deg)) translateY(var(--radius)) rotate(calc(var(--angle) * -1 - 360deg))}}`}</style>
      <div aria-hidden="true" className="absolute size-[300px] rounded-full bg-violet-600/25 blur-3xl" />
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
        <circle cx="50%" cy="50%" r={RADIUS} fill="none" className="stroke-white/15" strokeDasharray="4 6" />
        <circle cx="50%" cy="50%" r={RADIUS - 70} fill="none" className="stroke-white/10" />
      </svg>

      <div className="relative z-10 flex w-44 flex-col items-center gap-2 text-center" aria-live="polite">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgb(139_92_246/0.7)]">
          <current.icon className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-white">{current.title}</p>
        <p className="text-xs text-white/60">{current.description}</p>
      </div>

      {orbitServices.map((s, i) => {
        const angle = (360 / orbitServices.length) * i;
        const on = i === active;
        return (
          <div
            key={s.title}
            aria-hidden="true"
            className="absolute"
            style={{
              "--angle": `${angle}deg`,
              "--radius": `${RADIUS}px`,
              transform: `rotate(${angle}deg) translateY(${RADIUS}px) rotate(${-angle}deg)`,
              animation: reduceMotion ? "none" : "tts-orbit 26s linear infinite",
            }}
          >
            <div className={cn(
              "flex size-12 items-center justify-center rounded-full border bg-[#0e0b1c] transition-all duration-500",
              on ? "scale-110 border-violet-400 text-violet-200 ring-4 ring-violet-500/20" : "border-white/15 text-white/55"
            )}>
              <s.icon className="size-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Projects: fanned stack of work ───────────────────────────────────────────
export function ProjectFan({ projects }) {
  const cards = projects.slice(0, 3);
  const pose = ["-rotate-6 -translate-x-10 translate-y-6", "rotate-0 z-10", "rotate-6 translate-x-10 translate-y-6"];
  return (
    <div className="relative mx-auto flex h-[340px] w-full max-w-lg items-center justify-center">
      <div aria-hidden="true" className="absolute inset-10 rounded-full bg-violet-600/30 blur-3xl" />
      {cards.map((p, i) => (
        <Link
          key={p.id}
          to={`/projects/${p.id}`}
          className={cn("absolute w-[70%] overflow-hidden rounded-2xl bg-[#0e0b1c] shadow-2xl ring-1 ring-white/15 transition-transform duration-500 hover:z-20 hover:-translate-y-2", pose[i])}
        >
          <MediaImage src={p.thumb} alt={p.alt} label={p.title} className={cn("aspect-[16/10] w-full object-cover", i !== 1 && "opacity-60")} />
          {/* Only the front card carries a caption; the tilted back cards would clip theirs. */}
          {i === 1 ? (
            <span className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-white">
              {p.title}
              <ArrowUpRight className="size-4 text-violet-300" aria-hidden="true" />
            </span>
          ) : (
            <span className="sr-only">{p.title}</span>
          )}
        </Link>
      ))}
    </div>
  );
}

// ── Blog: featured post preview ──────────────────────────────────────────────
export function FeaturedPostCard({ post }) {
  if (!post) return null;
  return (
    <Link to={`/blogs/${post.slug}`} className="group relative block overflow-hidden rounded-2xl bg-[#0e0b1c] ring-1 ring-white/15">
      <MediaImage src={post.image} label={post.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06040d] via-[#06040d]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="rounded-full bg-violet-500/25 px-2.5 py-0.5 text-xs font-medium text-violet-100 ring-1 ring-inset ring-violet-300/30">Featured · {post.category}</span>
        <p className="mt-3 text-xl font-semibold leading-snug text-white group-hover:text-violet-200">{post.title}</p>
        <p className="mt-1 text-sm text-white/60">{post.date} · {post.readTime}</p>
      </div>
    </Link>
  );
}

// ── Contact: quick-reach card ────────────────────────────────────────────────
export function ContactQuickCard() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-violet-600/25 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl bg-[#0e0b1c]/90 p-6 ring-1 ring-white/15 backdrop-blur sm:p-8">
        <p className="text-sm text-white/60">Prefer email? Write to us directly.</p>
        <a href="mailto:hello@thetechspace.com" className="mt-2 flex items-center gap-2 break-all font-display text-2xl font-bold text-white hover:text-violet-200">
          <Mail className="size-5 shrink-0 text-violet-300" aria-hidden="true" /> hello@thetechspace.com
        </a>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <Clock className="size-4 text-violet-300" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-white">Reply within 24h</p>
            <p className="text-xs text-white/55">On business days</p>
          </div>
          <a href="#brief" className="rounded-xl bg-violet-500/15 p-4 ring-1 ring-violet-300/30 transition-colors hover:bg-violet-500/25">
            <ArrowUpRight className="size-4 text-violet-200" aria-hidden="true" />
            <p className="mt-2 text-sm font-semibold text-white">Send a brief</p>
            <p className="text-xs text-white/55">Form below</p>
          </a>
        </div>
      </div>
    </div>
  );
}
