// Blog — Shadcn Space blog-01 grid (lead post spans two columns) with
// shadcn/ui category filters.
import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { usePosts } from "@/lib/content";
import MediaImage from "@/components/ui/MediaImage";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import PageHeader from "../components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FinalCta } from "../components/home/PeopleAndLabs";
import { FeaturedPostCard } from "@/components/sections/HeroVisuals";

function PostCard({ post, lead, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: Math.min(index, 3) * 0.1, ease: "easeInOut" }}
      className={lead ? "sm:col-span-2" : ""}
    >
      <Link to={`/blogs/${post.slug}`} className="group flex h-full flex-col rounded-2xl">
        <Card className="h-full gap-0 overflow-hidden rounded-2xl p-0 shadow-none transition-shadow duration-300 group-hover:shadow-lg">
          <CardContent className="flex h-full flex-col p-0">
            <div className={`relative w-full overflow-hidden bg-muted ${lead ? "aspect-video sm:aspect-auto sm:h-96" : "aspect-[16/10]"}`}>
              <MediaImage
                src={post.image}
                label={post.title}
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <Badge className="absolute left-4 top-4 h-7 px-3 font-normal">{post.category}</Badge>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.date}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden="true" />{post.readTime}</span>
              </p>
              <h2 className={`font-semibold text-foreground group-hover:text-primary ${lead ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                {post.title}
              </h2>
              <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                <span className="font-medium text-foreground/80">{post.author}</span>
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  Read <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function BlogPage() {
  const [active, setActive] = useState("All");
  const blogPosts = usePosts();
  const categories = ["All", ...new Set((blogPosts ?? []).map((p) => p.category))];
  const ordered = [...(blogPosts ?? [])].sort((a, b) => Number(b.featured) - Number(a.featured));
  const posts = ordered.filter((p) => active === "All" || p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        crumb="Blog"
        badge="Insights"
        title="Insights from the studio."
        lede="Tutorials, ideas and the latest in tech, design and growth, straight from our team."
        aside={<FeaturedPostCard post={blogPosts?.find((p) => p.featured)} />}
      />

      <section aria-label="Articles" className="py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((cat) => (
              <Button
                key={cat}
                type="button"
                size="sm"
                variant={active === cat ? "default" : "outline"}
                aria-pressed={active === cat}
                onClick={() => setActive(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {!blogPosts && <ContentSkeleton count={4} className="lg:grid-cols-4" />}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} lead={i === 0 && active === "All"} />
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
