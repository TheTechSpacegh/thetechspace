// Interactive services list — adapted from Shadcn Space services-02.
// Hover, focus or tap a service to preview it; works with keyboard and touch.
import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Services added in the admin without an image show the TTS mark instead.
const placeholder = "/favicon.png";

export default function ServicesExplorer({ services }) {
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section aria-labelledby="explorer-title" className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <Badge variant="outline" className="h-7 px-3 text-sm font-normal">Services</Badge>
            <h2 id="explorer-title" className="text-3xl font-semibold text-foreground sm:text-5xl">What we do</h2>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Design, development and marketing from one team, so your website, product and campaigns pull in the same direction.
            </p>
          </div>
          <Button asChild className="group h-auto gap-3 rounded-full py-1 pl-5 pr-1">
            <Link to="/contact">
              Let's collaborate
              <span className="grid size-9 place-items-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Preview */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-28 overflow-hidden rounded-2xl border bg-card">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.id}
                  src={current.image || placeholder}
                  alt={`Example ${current.title.toLowerCase()} work`}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="aspect-[4/3] w-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* List */}
          <ul className="col-span-12 lg:col-span-7">
            {services.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.id} id={s.id} className="scroll-mt-28 border-t border-border last:border-b">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    aria-controls={`${s.id}-panel`}
                    className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left xl:py-8"
                  >
                    <h3 className={cn("text-2xl font-semibold transition-colors md:text-3xl", on ? "text-primary" : "text-foreground group-hover:text-primary")}>
                      {s.title}
                    </h3>
                    <ArrowUpRight className={cn("size-6 shrink-0 transition-transform duration-300", on ? "rotate-45 text-primary" : "text-muted-foreground")} aria-hidden="true" />
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`${s.id}-panel`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8">
                          <p className="max-w-xl text-base text-muted-foreground">{s.description}</p>
                          <ul className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                            {s.features.map((f) => (
                              <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                                <Check className="size-4 shrink-0 text-primary" aria-hidden="true" /> {f}
                              </li>
                            ))}
                          </ul>
                          <Button asChild variant="outline" size="sm" className="mt-6 rounded-full">
                            <Link to="/contact">Get a quote <ArrowUpRight /></Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
