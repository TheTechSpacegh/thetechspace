// About — rebuilt from Shadcn Space blocks: about-us-01 (discipline pills +
// counters), feature-02 (cards), timeline-01 (milestones, used as installed)
// and team-01 (people), themed with the TTS shadcn variables.
import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useInView, useSpring, useTransform } from "motion/react";
import {
  Plus, Palette, Code2, TrendingUp, Zap, Users, ShieldCheck, HeartHandshake,
  Lightbulb, Eye, UserRound, Leaf, Sprout, Scale, Check, ArrowRight,
} from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { ButtonLink } from "@/components/ui/primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionIntro from "@/components/sections/SectionIntro";
import { Timeline } from "@/components/shadcn-space/radix/blocks/timeline-01/timeline";
import { FinalCta } from "@/components/home/PeopleAndLabs";
import { useFoundedYear, useMilestones, useTeam } from "@/lib/content";
import MediaImage from "@/components/ui/MediaImage";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import { PrinciplesPanel } from "@/components/sections/StudioVisuals";

const ease = [0.21, 0.47, 0.32, 0.98];

const disciplines = [
  { title: "design", icon: Palette, color: "bg-violet-100 text-violet-800" },
  { title: "build", icon: Code2, color: "bg-sky-100 text-sky-800" },
  { title: "grow", icon: TrendingUp, color: "bg-emerald-100 text-emerald-800" },
];

// TODO(content): figures carried over from the previous About page and not yet
// verified (see PRODUCT.md). Replace with confirmed numbers.
const stats = [
  { count: 11, title: "Projects completed" },
  { count: 6, title: "Happy clients" },
  { count: 1, title: "Years experience" },
];

const apart = [
  { icon: Zap, title: "Fast delivery", content: "Launch sooner, without cutting corners." },
  // TODO(content): "50+ skilled professionals" contradicts the five-person team page.
  { icon: Users, title: "Expert team", content: "50+ skilled professionals" },
  { icon: ShieldCheck, title: "Quality assured", content: "Pixel-perfect execution" },
  { icon: HeartHandshake, title: "Client-focused", content: "Your success is our mission" },
];

const strengths = ["Technical + creative expertise", "Agile development process", "24/7 support & maintenance", "Results-driven approach"];

const values = [
  { icon: Lightbulb, title: "Innovation", content: "Constantly pushing boundaries with cutting-edge technology and creative solutions." },
  { icon: Eye, title: "Transparency", content: "Open and honest collaboration at every stage of the process." },
  { icon: UserRound, title: "User-centric", content: "Empathy at our core. Every decision starts with the end user." },
  { icon: Leaf, title: "Sustainability", content: "Building for the future with scalable, maintainable solutions." },
  { icon: Sprout, title: "Growth", content: "Continuous improvement. We evolve with the industry and our clients." },
  { icon: Scale, title: "Integrity", content: "Trust is our foundation. We deliver on every promise we make." },
];

// about-us-01 counter
function AnimatedCounter({ value, inView }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (v) => Math.round(v));
  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);
  return <motion.span>{display}</motion.span>;
}

// feature-02 card grid
function FeatureGrid({ items, columns = "lg:grid-cols-3" }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${columns}`}
    >
      {items.map((item) => (
        <motion.div
          key={item.title}
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.7, ease }}
        >
          <Card className="h-full rounded-2xl border-t-4 border-t-transparent py-8 transition-all duration-300 hover:border-t-primary hover:shadow-lg">
            <CardContent className="flex flex-col gap-5 px-7">
              <item.icon className="size-8 text-primary" strokeWidth={1.4} aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-base text-muted-foreground">{item.content}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function AboutPage() {
  const team = useTeam();
  const milestones = useMilestones();
  const founded = useFoundedYear();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <div className="bg-background">
      <PageHeader
        crumb="About"
        badge={`Since ${founded}`}
        title="We engineer digital excellence."
        lede="From architecture to deployment, we build scalable, performant digital products that help businesses grow."
        actions={
          <>
            <ButtonLink to="/contact" arrow>Book a call</ButtonLink>
            <ButtonLink to="/team" variant="ghostOnDark">Meet the team</ButtonLink>
          </>
        }
        aside={<PrinciplesPanel />}
      />

      {/* ── about-us-01: disciplines + counters ── */}
      <section aria-labelledby="about-intro" className="py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 px-4 sm:px-6">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col items-center gap-6"
          >
            <h2 id="about-intro" className="max-w-4xl text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              We're the strategic partners who
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {disciplines.map((d) => (
                <span key={d.title} className={`flex items-center gap-3 rounded-full px-6 py-2 ${d.color}`}>
                  <d.icon className="size-7 sm:size-9" aria-hidden="true" />
                  <span className="font-serif text-3xl italic sm:text-4xl">{d.title}</span>
                </span>
              ))}
            </div>
          </motion.div>

          <div ref={statsRef} className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-0">
            {stats.map((s, i) => (
              <div key={s.title} className="relative flex flex-col items-center justify-center gap-2 px-6 py-6 sm:py-10">
                {i !== 0 && <div aria-hidden="true" className="absolute left-0 top-1/2 hidden h-32 w-px -translate-y-1/2 bg-border sm:block" />}
                <p className="flex items-start gap-1 text-6xl font-semibold tabular-nums text-foreground md:text-7xl lg:text-8xl">
                  <Plus strokeWidth={3.5} className="mt-2 size-6 text-primary sm:size-8" aria-hidden="true" />
                  <AnimatedCounter value={s.count} inView={statsInView} />
                </p>
                <p className="text-base text-muted-foreground">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story + what sets us apart (feature-02) ── */}
      <section aria-labelledby="apart-title" className="border-y bg-card py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <SectionIntro
            id="apart-title"
            align="split"
            badge="Why TTS"
            title="What sets us apart"
            lede={`Founded in ${founded}, TTS emerged from a simple belief: that great design and powerful technology should work hand in hand. We're not just another agency. Every pixel, every line of code and every user interaction matters.`}
          />
          <FeatureGrid items={apart} columns="lg:grid-cols-4" />
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {strengths.map((s) => (
              <li key={s} className="flex items-center gap-2 text-foreground">
                <Check className="size-4 text-primary" aria-hidden="true" /> {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Values (feature-02) ── */}
      <section aria-labelledby="values-title" className="py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <SectionIntro
            id="values-title"
            badge="Values"
            title="What drives us"
            lede="The principles that guide everything we do, from code to client relationships."
          />
          <FeatureGrid items={values} />
        </div>
      </section>

      {/* ── Journey (timeline-01, as installed) ── */}
      <section aria-labelledby="journey-title" className="border-t bg-card py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-4 sm:px-6">
          <SectionIntro
            id="journey-title"
            badge="Our journey"
            title="We are a collective of digital craftsmen."
            lede="Innovating with precision, building the future of technology. Each milestone is a chapter in our story."
          />
          {/* TODO(content): some milestone claims are unverified (see PRODUCT.md). */}
          {milestones ? (
            <Timeline items={milestones.map((m) => ({ date: m.year, title: m.title, description: m.description }))} />
          ) : (
            <ContentSkeleton variant="timeline" count={4} />
          )}
        </div>
      </section>

      {/* ── Team (team-01) ── */}
      <section aria-labelledby="team-title" className="py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <SectionIntro
            id="team-title"
            badge="Team"
            title="Meet the minds behind TTS"
            lede="Passionate people dedicated to bringing your digital vision to life."
          />
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {!team && <ContentSkeleton count={5} className="col-span-full lg:grid-cols-5" />}
            {team?.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease }}
                className="group flex flex-col items-center gap-4 text-center"
              >
                <div className="w-full overflow-hidden rounded-2xl bg-muted">
                  <MediaImage src={m.photo} alt={m.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition-all duration-300 group-hover:scale-105" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link to="/team">Meet the whole team <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
