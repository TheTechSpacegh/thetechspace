import { useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { gsap } from "gsap";
import { usePost } from "@/lib/content";
import { useDocumentTitle } from "@/hooks/use-document-title";
import MediaImage from "@/components/ui/MediaImage";
import Markdown from "@/components/ui/Markdown";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Category badge color map ─────────────────────────────────────────────────
const categoryStyles = {
  violet: "bg-violet-500 text-white",
  cyan: "bg-cyan-500 text-white",
  emerald: "bg-emerald-500 text-white",
};

// ─── Floating dot for Coming Soon ─────────────────────────────────────────────
const FloatingDot = ({ size, color, x, y, delay, duration }) => (
  <div
    className="absolute rounded-full animate-float opacity-40"
    style={{
      width: size,
      height: size,
      background: color,
      left: x,
      top: y,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      filter: "blur(1px)",
    }}
  />
);

// ─── Blog Detail Page ─────────────────────────────────────────────────────────
export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post } = usePost(slug); // null = loading, undefined = no such post
  // Seeded posts have no body yet (their "body" is the excerpt): keep the
  // Coming Soon block for those; render anything an admin actually wrote.
  useDocumentTitle(post ? post.title : post === undefined ? "Post not found" : "Blog");
  const hasBody = Boolean(post?.content?.trim() && post.content.trim() !== post.excerpt?.trim());
  const heroRef = useRef(null);
  const comingSoonRef = useRef(null);

  // GSAP entrance animations
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Hero header entrance
      gsap.from(".detail-animate", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.15,
      });

      // Coming Soon section entrance
      gsap.from(".coming-soon-animate", {
        y: 40,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.5,
      });

      // Continuous pulse on the main text
      gsap.to(".coming-soon-pulse", {
        scale: 1.03,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, [post]);

  if (post === null) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 pb-20 pt-36" aria-busy="true" aria-label="Loading post">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-12 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="mt-8 h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  // 404 fallback
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Post Not Found
        </h1>
        <p className="text-slate-500 mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-full font-medium hover:bg-violet-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const badgeStyle = categoryStyles[post.categoryColor] || categoryStyles.violet;

  return (
    <div ref={heroRef} className="min-h-screen bg-slate-50 relative">
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      <div className="relative z-10">
        {/* ── Hero header ── */}
        <div className="relative overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <MediaImage
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
            {/* Back link */}
            <div className="detail-animate mb-8">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>

            {/* Category badge */}
            <div className="detail-animate mb-5">
              <span
                className={`inline-block ${badgeStyle} text-[11px] font-semibold px-3 py-1 rounded-full tracking-wide`}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="detail-animate text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="detail-animate flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {hasBody && (
          <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <Markdown source={post.content} />
            <div className="mt-12 border-t border-slate-200 pt-8">
              <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900">
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>
            </div>
          </article>
        )}

        {/* ── Coming Soon Content Area ── */}
        {!hasBody && <div
          ref={comingSoonRef}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <div className="relative rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden min-h-[400px] flex flex-col items-center justify-center p-10">
            {/* Floating particles */}
            <FloatingDot size={10} color="#8b5cf6" x="10%" y="20%" delay={0} duration={4} />
            <FloatingDot size={7} color="#06b6d4" x="80%" y="15%" delay={1.2} duration={5} />
            <FloatingDot size={12} color="#10b981" x="70%" y="70%" delay={0.8} duration={4.5} />
            <FloatingDot size={6} color="#f59e0b" x="15%" y="75%" delay={2} duration={3.5} />
            <FloatingDot size={9} color="#8b5cf6" x="50%" y="10%" delay={1.5} duration={5.5} />
            <FloatingDot size={8} color="#06b6d4" x="30%" y="80%" delay={0.5} duration={4.2} />
            <FloatingDot size={11} color="#10b981" x="85%" y="45%" delay={1} duration={3.8} />
            <FloatingDot size={5} color="#f59e0b" x="40%" y="30%" delay={2.5} duration={4.8} />

            {/* Glow orb behind text */}
            <div
              aria-hidden="true"
              className="absolute w-[300px] h-[300px] rounded-full opacity-20 animate-glow"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Coming Soon text */}
            <div className="relative z-10 text-center">
              <div className="coming-soon-animate coming-soon-pulse mb-4">
                <span
                  className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900"
                >
                  Coming Soon
                </span>
              </div>

              <p className="coming-soon-animate text-slate-500 text-lg mb-2 max-w-md">
                This article is being prepared by our team.
              </p>
              <p className="coming-soon-animate text-slate-400 text-sm mb-8">
                Check back soon for the full content.
              </p>

              <div className="coming-soon-animate">
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}
