// Dashboard numbers: live from the API when VITE_API_URL is set, otherwise
// the sample data in mockData.js (marked as such in the UI).
import { useEffect, useState } from "react";
import { API_URL, api } from "@/lib/api";
import { mockEnquiries, mockLatestMessages, mockRecentPosts, mockStats } from "../data/mockData";

// Contact-form "project type" options → the chart's three series.
const SERIES = {
  "Website Design & Development": "websites",
  "Web or mobile app": "websites",
  "UI/UX Design": "design",
  "Graphic Design & Branding": "design",
  "Marketing & SEO": "marketing",
  "Digital Strategy": "marketing",
};

const AVATAR_COLORS = ["bg-violet-600", "bg-sky-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600"];

const monthLabel = (key) =>
  new Date(`${key}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });

const dateLabel = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

export function timeAgo(iso, now = Date.now()) {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days < 7 ? `${days}d ago` : dateLabel(iso);
}

const SAMPLE = {
  live: false,
  stats: { totalPosts: mockStats.totalPosts, teamMembers: mockStats.teamMembers, activeServices: mockStats.activeServices },
  enquiries: mockEnquiries.map((m) => ({ ...m, total: m.websites + m.design + m.marketing })),
  messages: mockLatestMessages,
  unread: mockLatestMessages.filter((m) => !m.read).length,
  totalMessages: mockLatestMessages.length,
  posts: mockRecentPosts,
};

function fromApi(stats, inbox, posts) {
  return {
    live: true,
    stats: { totalPosts: stats.posts.published, teamMembers: stats.team, activeServices: stats.services },
    enquiries: stats.enquiriesByMonth.map(({ month, total, byType }) => {
      const row = { month: monthLabel(month), websites: 0, design: 0, marketing: 0, total };
      for (const [type, count] of Object.entries(byType)) {
        if (SERIES[type]) row[SERIES[type]] += count;
      }
      return row;
    }),
    messages: inbox.messages.slice(0, 5).map((m, i) => ({
      id: m.id,
      name: `${m.firstName} ${m.lastName}`,
      email: m.email,
      message: m.details,
      time: timeAgo(m.createdAt),
      initials: `${m.firstName[0] ?? ""}${m.lastName[0] ?? ""}`.toUpperCase(),
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      read: m.read,
    })),
    unread: stats.messages.unread,
    totalMessages: stats.messages.total,
    posts: posts.posts.slice(0, 5).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      slug: p.slug,
      author: p.authorName,
      status: p.status.toLowerCase(),
      date: dateLabel(p.publishedAt ?? p.updatedAt),
    })),
  };
}

export function useDashboardData() {
  const [state, setState] = useState({ data: API_URL ? null : SAMPLE, error: null });

  useEffect(() => {
    if (!API_URL) return;
    const controller = new AbortController();
    const { signal } = controller;
    Promise.all([api("/api/admin/stats", { signal }), api("/api/admin/messages", { signal }), api("/api/admin/posts", { signal })])
      .then(([stats, inbox, posts]) => setState({ data: fromApi(stats, inbox, posts), error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ data: null, error });
      });
    return () => controller.abort();
  }, []);

  return state;
}
