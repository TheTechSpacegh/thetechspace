import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, ExternalLink, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useProjects } from "@/lib/content";
import { useDocumentTitle } from "@/hooks/use-document-title";
import MediaImage from "@/components/ui/MediaImage";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const projects = useProjects();
    const list = projects ?? [];
    const project = list.find((p) => p.id === id);
    const currentIndex = list.findIndex((p) => p.id === id);
    const prevProject = currentIndex > 0 ? list[currentIndex - 1] : null;
    const nextProject = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;
    useDocumentTitle(project ? project.title : projects ? "Project not found" : "Projects");

    if (!projects) {
        return (
            <div className="min-h-screen px-4 pb-20 pt-36" aria-busy="true" aria-label="Loading project">
                <div className="mx-auto flex max-w-5xl flex-col gap-4">
                    <Skeleton className="aspect-[16/8] rounded-3xl" />
                    <Skeleton className="h-10 w-2/3 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Project not found</h1>
                <p className="text-slate-500 mb-8">The project you're looking for doesn't exist.</p>
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to all projects
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                <MediaImage
                    label={project.title}
                    src={project.src}
                    alt={project.alt}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Back button */}
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">
                            {project.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Description */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">About the project</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-10">
                                {project.description}
                            </p>

                            {/* Outcomes */}
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Key outcomes</h3>
                            <ul className="space-y-3 mb-10">
                                {project.outcomes.map((outcome) => (
                                    <li key={outcome} className="flex items-start gap-3">
                                        <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                        <span className="text-slate-600">{outcome}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-700 transition-colors group"
                            >
                                Start a similar project
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Sidebar Meta */}
                        <motion.aside
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-24">
                                <dl className="space-y-5">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Client</dt>
                                        <dd className="text-slate-900 font-medium">{project.client}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Year</dt>
                                        <dd className="text-slate-900 font-medium">{project.year}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Category</dt>
                                        <dd className="text-slate-900 font-medium">{project.category}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Services</dt>
                                        <dd className="flex flex-col gap-2">
                                            {project.services.map((s) => (
                                                <span key={s} className="inline-flex items-center gap-1.5 text-sm text-slate-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    {s}
                                                </span>
                                            ))}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <Link
                                        to="/contact"
                                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Enquire about this
                                    </Link>
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </section>

            {/* Prev / Next navigation */}
            <section className="border-t border-slate-100 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="flex items-center justify-between gap-4">
                        {prevProject ? (
                            <Link
                                to={`/projects/${prevProject.id}`}
                                className="group flex items-center gap-3 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-0.5">Previous</p>
                                    <p className="font-semibold text-slate-800">{prevProject.title}</p>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}

                        <Link
                            to="/projects"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            All projects
                        </Link>

                        {nextProject ? (
                            <Link
                                to={`/projects/${nextProject.id}`}
                                className="group flex items-center gap-3 text-sm text-slate-500 hover:text-slate-900 transition-colors text-right"
                            >
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-0.5">Next</p>
                                    <p className="font-semibold text-slate-800">{nextProject.title}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
