// Public-site content from the TTS API, in the same shapes the pages used
// when the content was hard-coded (src/data/*), so the pages barely change.
//
// Freshness: every page load fetches; the data is re-fetched when the tab
// regains focus; and the admin announces each save on a BroadcastChannel, so
// any open tab of the site updates within a moment of an edit.
//
// The hard-coded data is only a fallback, used when no API is configured
// (local design work) or when the API can't be reached.
import { useEffect, useState } from "react";
import { API_URL, ApiError, api } from "./api";
import { team as staticTeam } from "@/data/team";
import { projects as staticProjects } from "@/data/projectsData";
import { blogPosts as staticPosts } from "@/data/blogsData";
import { milestonesData as staticMilestones } from "@/data/milestonesData";
import { services as staticServices } from "@/data/services";
import { FOUNDED_YEAR } from "@/data/company";

// ── Change notifications ────────────────────────────────────────────────────
const CHANNEL = "tts:content";
const refreshers = new Set();
let channel = null;
try {
  channel = new BroadcastChannel(CHANNEL);
  channel.onmessage = () => refreshers.forEach((refresh) => refresh());
} catch {
  /* very old browsers: focus-based refresh still applies */
}

// Called by the admin after anything is created, edited or deleted.
export function announceContentChange() {
  try {
    channel?.postMessage("changed");
  } catch {
    /* ignore */
  }
  refreshers.forEach((refresh) => refresh());
}

// ── Core hook ───────────────────────────────────────────────────────────────
const cache = new Map(); // path → raw API body, for instant revisits this session

/**
 * @returns {{ data: any, error: ApiError|null }}  data is null only while the
 * first request is in flight (show a skeleton).
 */
export function useContent(path, adapt, fallback) {
  const [state, setState] = useState(() => {
    if (!API_URL) return { data: fallback, error: null };
    return { data: cache.has(path) ? adapt(cache.get(path)) : null, error: null };
  });

  useEffect(() => {
    if (!API_URL || !path) return;
    let alive = true;
    const load = () =>
      api(path)
        .then((body) => {
          cache.set(path, body);
          if (alive) setState({ data: adapt(body), error: null });
        })
        .catch((error) => {
          if (!alive) return;
          if (error instanceof ApiError && error.status === 404) setState({ data: undefined, error });
          else {
            console.warn(`Content API unavailable for ${path}; showing built-in content.`, error.message);
            setState((s) => (s.data ? s : { data: fallback, error }));
          }
        });

    load();
    const onVisible = () => document.visibilityState === "visible" && load();
    refreshers.add(load);
    window.addEventListener("focus", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      refreshers.delete(load);
      window.removeEventListener("focus", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // adapt/fallback are module-level constants in every caller
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

// ── Adapters: API rows → the shapes the pages already use ──────────────────
const byName = new Map(staticTeam.map((m) => [m.name.toLowerCase(), m]));
const postBySlug = new Map(staticPosts.map((p) => [p.slug, p]));
const serviceBySlug = new Map(staticServices.map((s) => [s.id, s]));

const shortDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export const toTeamMember = (m) => ({
  id: m.id,
  name: m.name,
  role: m.position,
  specialty: m.specialty,
  bio: m.bio,
  funFact: m.funFact,
  linkedin: m.linkedin,
  twitter: m.twitter,
  // Uploaded photo first; otherwise the photo bundled with the site, if any.
  photo: m.imageUrl || byName.get(m.name.toLowerCase())?.photo || null,
});

export const toProject = (p) => ({
  id: p.slug,
  title: p.title,
  category: p.category,
  tags: p.tags ?? [],
  src: p.imageUrl,
  thumb: p.imageUrl,
  alt: p.imageAlt || p.title,
  description: p.description,
  client: p.client,
  year: String(p.year),
  services: p.services ?? [],
  outcomes: p.outcomes ?? [],
});

export const toPost = (p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  category: p.category,
  categoryColor: postBySlug.get(p.slug)?.categoryColor ?? "violet",
  author: p.authorName,
  date: shortDate(p.publishedAt),
  readTime: p.readTime ? `${p.readTime} min read` : "",
  image: p.imageUrl || postBySlug.get(p.slug)?.image || null,
  featured: p.featured,
});

export const toService = (s) => ({
  id: s.slug,
  title: s.name,
  description: s.description,
  features: s.features ?? [],
  image: s.imageUrl || serviceBySlug.get(s.slug)?.image || null,
});

export const toMilestone = (m) => ({ id: m.id, year: m.year, title: m.title, description: m.description, icon: m.icon });

// ── Hooks ───────────────────────────────────────────────────────────────────
const adaptTeam = (b) => b.team.map(toTeamMember);
const adaptProjects = (b) => b.projects.map(toProject);
const adaptPosts = (b) => b.posts.map(toPost);
const adaptServices = (b) => b.services.map(toService);
const adaptMilestones = (b) => b.milestones.map(toMilestone);
const adaptPost = (b) => toPost(b.post);

export const useTeam = () => useContent("/api/team", adaptTeam, staticTeam).data;
export const useProjects = () => useContent("/api/projects", adaptProjects, staticProjects).data;
export const usePosts = () => useContent("/api/posts?limit=50", adaptPosts, staticPosts).data;
export const useServices = () => useContent("/api/services", adaptServices, staticServices).data;
export const useMilestones = () => useContent("/api/milestones", adaptMilestones, staticMilestones).data;

// One post with its body. `data` is undefined when the post doesn't exist.
export function usePost(slug) {
  const fallback = postBySlug.get(slug);
  return useContent(`/api/posts/${encodeURIComponent(slug)}`, adaptPost, fallback);
}

// The founding year comes from the "Founded" milestone, so it's edited in
// one place (Admin → Milestones). FOUNDED_YEAR covers the offline case.
export function useFoundedYear() {
  const milestones = useMilestones();
  const founded = milestones?.find((m) => /found/i.test(m.title))?.year;
  return founded && /^\d{4}$/.test(founded) ? founded : String(FOUNDED_YEAR);
}
