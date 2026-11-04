// Admin "workspace boot": shown while the session is verified. The modules of
// the console come online around the logo, and the status line reflects the
// real state: it only says the session is verified once it is.
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Briefcase, Check, FileText, Flag, FolderKanban, Inbox, Loader2, Users } from "lucide-react";
import logo1 from "@/assets/img/logo1.png";

const modules = [
  { label: "Posts", icon: FileText },
  { label: "Team", icon: Users },
  { label: "Services", icon: Briefcase },
  { label: "Projects", icon: FolderKanban },
  { label: "Messages", icon: Inbox },
  { label: "Milestones", icon: Flag },
];
const RADIUS = 104;
const STEP_MS = 150;

export default function AdminSplash({ ready }) {
  const reduce = useReducedMotion();
  const [online, setOnline] = useState(reduce ? modules.length : 0);

  useEffect(() => {
    if (reduce || online >= modules.length) return;
    const id = setTimeout(() => setOnline((n) => n + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [online, reduce]);

  const workspaceReady = ready && online >= modules.length;
  const circumference = 2 * Math.PI * RADIUS;

  return (
    <div className="dark relative grid min-h-screen place-items-center overflow-hidden bg-[#06040d] px-4">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.3),transparent)]" />

      <div className="relative flex flex-col items-center gap-10">
        <div className="relative size-[18rem]" aria-hidden="true">
          {/* progress ring */}
          <svg viewBox="-144 -144 288 288" className="absolute inset-0 size-full -rotate-90">
            <circle r={RADIUS} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="1.5" />
            <motion.circle
              r={RADIUS}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: circumference * (1 - online / modules.length) }}
              transition={{ duration: reduce ? 0 : 0.3, ease: "easeOut" }}
            />
          </svg>

          {/* modules around the ring */}
          {modules.map((m, i) => {
            const angle = (i / modules.length) * 2 * Math.PI - Math.PI / 2;
            const on = i < online;
            return (
              <motion.div
                key={m.label}
                className="absolute left-1/2 top-1/2"
                style={{ x: `calc(${Math.cos(angle) * RADIUS}px - 50%)`, y: `calc(${Math.sin(angle) * RADIUS}px - 50%)` }}
                animate={{ opacity: on ? 1 : 0.3, scale: on ? 1 : 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <span
                  className={`grid size-10 place-items-center rounded-xl border transition-colors duration-300 ${
                    on ? "border-violet-400/50 bg-violet-500/20 text-violet-100 shadow-[0_0_24px_-4px_rgb(139_92_246/0.7)]" : "border-white/10 bg-white/5 text-white/40"
                  }`}
                >
                  <m.icon className="size-4" />
                </span>
              </motion.div>
            );
          })}

          {/* logo core */}
          <motion.div
            className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/10 bg-white shadow-[0_0_48px_-8px_rgb(139_92_246/0.8)]"
            animate={reduce ? {} : { scale: workspaceReady ? 1.06 : [1, 1.04, 1] }}
            transition={workspaceReady ? { duration: 0.3 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={logo1} alt="" className="size-11 object-contain" />
          </motion.div>
        </div>

        <div role="status" aria-live="polite" className="flex flex-col items-center gap-2 text-sm">
          <p className="font-semibold text-white">{workspaceReady ? "Workspace ready" : "Opening your workspace"}</p>
          <ul className="flex flex-col items-start gap-1.5 font-mono text-xs text-white/55">
            <li className="flex items-center gap-2">
              {ready ? <Check className="size-3.5 text-emerald-400" aria-hidden="true" /> : <Loader2 className="size-3.5 animate-spin text-violet-300" aria-hidden="true" />}
              {ready ? "Session verified" : "Verifying session"}
            </li>
            <li className="flex items-center gap-2">
              {online >= modules.length ? <Check className="size-3.5 text-emerald-400" aria-hidden="true" /> : <Loader2 className="size-3.5 animate-spin text-violet-300" aria-hidden="true" />}
              {online >= modules.length ? "Modules loaded" : `Loading ${modules[online].label.toLowerCase()} · ${online + 1}/${modules.length}`}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
