// Team — Shadcn Space team-01 grid for the people, feature-02 cards for culture.
import { motion } from "motion/react";
import { Lightbulb, Handshake, GraduationCap } from "lucide-react";
import { useTeam } from "@/lib/content";
import MediaImage from "@/components/ui/MediaImage";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import PageHeader from "../components/ui/PageHeader";
import { ButtonLink } from "../components/ui/primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SectionIntro from "@/components/sections/SectionIntro";
import { FinalCta } from "../components/home/PeopleAndLabs";
import { ProjectThread } from "@/components/sections/StudioVisuals";

const ease = [0.21, 0.47, 0.32, 0.98];

const values = [
  { icon: Lightbulb, title: "Innovation first", body: "We encourage experimentation and embrace new technologies to stay ahead of the curve." },
  { icon: Handshake, title: "Collaboration", body: "Every voice matters. We work together to create solutions that exceed expectations." },
  { icon: GraduationCap, title: "Continuous learning", body: "We invest in our team's growth through training, conferences, and skill development." },
];

export default function TeamPage() {
  const team = useTeam();
  const leads = team?.filter((m) => m.bio) ?? [];
  const rest = team?.filter((m) => !m.bio) ?? [];

  return (
    <div className="bg-background">
      <PageHeader
        crumb="Team"
        badge="Made in Ghana"
        title="The people who build your project."
        lede="A Ghanaian team of designers and developers. You talk to the same people who design, build and launch your project."
        actions={<ButtonLink to="/contact" arrow>Book a call with us</ButtonLink>}
        aside={<ProjectThread team={team} />}
      />

      {/* ── team-01: founders with bios ── */}
      <section aria-labelledby="founders-title" className="py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <SectionIntro id="founders-title" badge="Founders" title="Meet the minds behind TTS" />
          {!team && <ContentSkeleton count={3} />}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {leads.map((m, i) => (
              <motion.article
                key={m.name}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease }}
                className="group flex flex-col gap-5"
              >
                <div className="overflow-hidden rounded-2xl bg-muted">
                  <MediaImage src={m.photo} alt={m.name} loading={i === 0 ? "eager" : "lazy"} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-foreground">{m.name}</h3>
                    <p className="text-sm font-medium text-primary">{m.role}</p>
                  </div>
                  <Badge variant="outline" className="h-auto w-fit whitespace-normal px-3 py-1 text-left font-normal">{m.specialty}</Badge>
                  <p className="text-muted-foreground">{m.bio}</p>
                  <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Off the clock:</span> {m.funFact}</p>
                </div>
              </motion.article>
            ))}
          </div>

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 border-t pt-12 sm:grid-cols-2">
              {rest.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease }}
                >
                  <Card className="rounded-2xl py-5">
                    <CardContent className="flex items-center gap-5 px-5">
                      <MediaImage src={m.photo} alt={m.name} loading="lazy" className="size-24 shrink-0 rounded-xl object-cover" />
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{m.name}</h3>
                        <p className="text-sm text-muted-foreground">{m.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Culture (feature-02) ── */}
      <section aria-labelledby="culture-title" className="border-y bg-card py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <SectionIntro
            id="culture-title"
            badge="Culture"
            title="How we work together"
            lede="Great work comes from great people working together in an environment that fosters creativity, collaboration, and continuous learning."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((v) => (
              <Card key={v.title} className="h-full rounded-2xl border-t-4 border-t-transparent py-8 transition-all duration-300 hover:border-t-primary hover:shadow-lg">
                <CardContent className="flex flex-col gap-5 px-7">
                  <v.icon className="size-8 text-primary" strokeWidth={1.4} aria-hidden="true" />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-foreground">{v.title}</h3>
                    <p className="text-muted-foreground">{v.body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-24">
        <FinalCta />
      </div>
    </div>
  );
}
