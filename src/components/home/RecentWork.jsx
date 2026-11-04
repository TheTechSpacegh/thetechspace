// Homepage work — Shadcn Space portfolio-01 (two-column image cards + tags).
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/content";
import MediaImage from "@/components/ui/MediaImage";
import ContentSkeleton from "@/components/ui/ContentSkeleton";

export default function RecentWork() {
  const projects = useProjects();
  return (
    <section aria-labelledby="work-title" className="border-y bg-card py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <Badge variant="outline" className="h-7 px-3 text-sm font-normal">Portfolio</Badge>
            <h2 id="work-title" className="text-3xl font-semibold text-foreground sm:text-5xl">Recent work</h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Websites, apps and brands from the studio. Our full portfolio is being updated.
            </p>
          </div>
          <Button asChild className="rounded-full px-5">
            <Link to="/projects">View all projects <ArrowUpRight /></Link>
          </Button>
        </div>

        {!projects && <ContentSkeleton count={4} className="lg:grid-cols-2" />}
        <div className="grid w-full grid-cols-1 gap-x-7 gap-y-12 md:grid-cols-2">
          {projects?.slice(0, 4).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.2, ease: "easeInOut" }}
              className="group"
            >
              <Link to={`/projects/${p.id}`} className="flex flex-col gap-5 rounded-2xl">
                <div className="relative overflow-hidden rounded-2xl bg-muted">
                  <MediaImage src={p.thumb} alt={p.alt} label={p.title} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="w-fit text-2xl font-medium tracking-tight text-foreground group-hover:text-primary">{p.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {[p.category, ...p.tags].map((tag) => (
                      <Badge key={tag} variant="outline" className="h-7 px-3 font-normal">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
