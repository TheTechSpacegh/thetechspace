// First-visit splash: "blueprint to launch". A page wireframe draws itself
// (design), fills in (build), a growth line sweeps across it (grow), then the
// screen lifts like a curtain. It tells the TTS story in about 1.6s.
//
// Shown once per browser session, never with prefers-reduced-motion, and any
// click or key skips it. The page renders underneath the whole time, so the
// splash never delays content from loading.
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import logo1 from "@/assets/img/logo1.png";

const SEEN_KEY = "tts:splash-seen";
const PHASES = ["design", "build", "grow"];
const PHASE_MS = [0, 560, 1080];
const EXIT_AT_MS = 1650;
// Hard deadline: the splash is removed by now even if its exit animation never
// finishes (throttled background tab, frozen timers, an animation error), so
// it can never leave the site locked behind it.
const REMOVE_BY_MS = EXIT_AT_MS + 1200;
const ease = [0.22, 1, 0.36, 1];

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const seenThisSession = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};

// Wireframe of a landing page: nav, headline, button, hero image, three cards.
const blocks = [
  { x: 16, y: 14, w: 288, h: 14, r: 7 },
  { x: 16, y: 46, w: 168, h: 12, r: 3 },
  { x: 16, y: 64, w: 124, h: 12, r: 3 },
  { x: 16, y: 88, w: 60, h: 14, r: 7, accent: true },
  { x: 200, y: 42, w: 104, h: 66, r: 8 },
  { x: 16, y: 126, w: 88, h: 56, r: 8 },
  { x: 116, y: 126, w: 88, h: 56, r: 8 },
  { x: 216, y: 126, w: 88, h: 56, r: 8 },
];

export default function SiteSplash() {
  const [visible, setVisible] = useState(() => !prefersReducedMotion() && !seenThisSession());
  const [phase, setPhase] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const leave = useCallback(() => setLeaving(true), []);

  // Skipping (click/key) also arms the deadline, measured from the skip.
  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(() => setVisible(false), REMOVE_BY_MS - EXIT_AT_MS);
    return () => clearTimeout(id);
  }, [leaving]);

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* private mode: the splash simply shows again next time */
    }
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const timers = [
      ...PHASE_MS.slice(1).map((ms, i) => setTimeout(() => setPhase(i + 1), ms)),
      setTimeout(leave, EXIT_AT_MS),
      setTimeout(() => setVisible(false), REMOVE_BY_MS),
    ];
    window.addEventListener("keydown", leave);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", leave);
      root.style.overflow = previous;
    };
  }, [visible, leave]);

  if (!visible) return null;

  const built = phase >= 1;
  const growing = phase >= 2;

  return (
    <motion.div
      aria-hidden="true"
      onClick={leave}
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{ clipPath: leaving ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 0.7, ease }}
      onAnimationComplete={() => leaving && setVisible(false)}
      className="fixed inset-0 z-[100] grid cursor-pointer place-items-center bg-[#06040d]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.35),transparent)] blur-2xl" />

      <motion.div
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
        transition={{ duration: 0.4, ease }}
        className="relative flex w-[min(86vw,420px)] flex-col items-center gap-8"
      >
        <svg viewBox="0 0 320 196" className="w-full overflow-visible">
          <defs>
            <linearGradient id="tts-splash-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {blocks.map((b, i) => (
            <motion.rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={b.r}
              stroke="#a78bfa"
              strokeWidth="1.2"
              initial={{ pathLength: 0, fillOpacity: 0 }}
              animate={{ pathLength: 1, fillOpacity: built ? 1 : 0 }}
              transition={{
                pathLength: { duration: 0.5, delay: i * 0.035, ease },
                fillOpacity: { duration: 0.35, delay: built ? i * 0.04 : 0 },
              }}
              fill={b.accent ? "#a78bfa" : "url(#tts-splash-fill)"}
            />
          ))}

          {/* grow: a rising line sweeps over the cards and lands on a point */}
          <motion.path
            d="M16 176 C 70 172, 96 150, 140 146 S 230 120, 300 70"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={growing ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease }}
          />
          <motion.circle
            cx="300"
            cy="70"
            r="5"
            fill="#34d399"
            initial={{ scale: 0 }}
            animate={growing ? { scale: [0, 1.6, 1] } : {}}
            transition={{ duration: 0.4, delay: 0.42 }}
            style={{ transformOrigin: "300px 70px" }}
          />
        </svg>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logo1} alt="" className="size-8 rounded-md bg-white object-contain p-0.5" />
            <span className="text-lg font-bold tracking-tight text-white">
              The<span className="text-violet-300">Tech</span>Space
            </span>
          </div>
          <p className="flex items-center gap-2 font-mono text-sm">
            {PHASES.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <span className={i <= phase ? (i === 2 ? "text-emerald-300" : "text-violet-200") : "text-white/25"}>{p}</span>
                {i < PHASES.length - 1 && <span className="text-white/25">→</span>}
              </span>
            ))}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
