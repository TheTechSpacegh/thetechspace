// Projects — Shadcn Space portfolio-01 grid with shadcn/ui filters.
import { useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Search, FolderSearch } from "lucide-react";
import { motion } from "motion/react";
import PageHeader from "../components/ui/PageHeader";
import { FinalCta } from "../components/home/PeopleAndLabs";
import { useProjects } from "@/lib/content";
import MediaImage from "@/components/ui/MediaImage";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ProjectFan } from "@/components/sections/HeroVisuals";

export default function ProjectsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [query, setQuery] = useState("");
    const projects = useProjects();
    const categories = ["All", ...new Set((projects ?? []).map((p) => p.category))];

    const q = query.trim().toLowerCase();
    const filtered = (projects ?? []).filter((p) => {
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        const matchQuery = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
        return matchCat && matchQuery;
    });

    return (
        <div className="min-h-screen bg-background">
            <PageHeader
                crumb="Projects"
                badge="Portfolio update in progress"
                title="Work from the studio."
                lede="Websites, apps and brands we've designed and built. Some projects below are placeholders while we add our latest client work."
                aside={<ProjectFan projects={projects ?? []} />}
            />

            {/* Filters */}
            <section aria-label="Filter projects" className="sticky top-20 z-30 border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center">
                    <InputGroup className="h-10 rounded-full bg-card md:max-w-xs">
                        <InputGroupAddon><Search /></InputGroupAddon>
                        <InputGroupInput
                            type="search"
                            aria-label="Search projects"
                            placeholder="Search projects…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </InputGroup>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                        {categories.map((cat) => (
                            <Button
                                key={cat}
                                type="button"
                                size="sm"
                                variant={activeCategory === cat ? "default" : "outline"}
                                onClick={() => setActiveCategory(cat)}
                                aria-pressed={activeCategory === cat}
                                className="rounded-full"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* portfolio-01 grid */}
            <section aria-label="Projects" className="py-16 md:py-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6">
                    {!projects ? (
                        <ContentSkeleton count={4} className="lg:grid-cols-2" />
                    ) : filtered.length === 0 ? (
                        <Empty className="border border-dashed py-16">
                            <EmptyHeader>
                                <EmptyMedia variant="icon"><FolderSearch /></EmptyMedia>
                                <EmptyTitle>No projects match your search</EmptyTitle>
                                <EmptyDescription>Try a different word or show all categories.</EmptyDescription>
                            </EmptyHeader>
                            <Button variant="outline" className="rounded-full" onClick={() => { setQuery(""); setActiveCategory("All"); }}>
                                Clear filters
                            </Button>
                        </Empty>
                    ) : (
                        <div className="grid w-full grid-cols-1 gap-x-7 gap-y-12 md:grid-cols-2">
                            {filtered.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: (i % 2) * 0.15, ease: "easeInOut" }}
                                    className="group"
                                >
                                    <Link to={`/projects/${project.id}`} className="flex flex-col gap-5 rounded-2xl">
                                        <div className="relative overflow-hidden rounded-2xl bg-muted">
                                            <MediaImage
                                                label={project.title}
                                                src={project.thumb}
                                                alt={project.alt}
                                                loading="lazy"
                                                decoding="async"
                                                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:rotate-45 group-focus-visible:opacity-100">
                                                <ArrowUpRight className="size-5" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-baseline justify-between gap-4">
                                                <h2 className="text-2xl font-medium tracking-tight text-foreground group-hover:text-primary">{project.title}</h2>
                                                <span className="text-sm text-muted-foreground tabular-nums">{project.year}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge className="h-7 px-3 font-normal">{project.category}</Badge>
                                                {project.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="h-7 px-3 font-normal">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <div className="pt-8">
                <FinalCta />
            </div>
        </div>
    );
}
