// What each admin content screen shows and edits. Field names match the API
// (Backend/src/modules/content/schemas.js), which also validates them.
import { Briefcase, FileText, FolderKanban, Milestone, Quote, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const muted = (text) => <span className="text-muted-foreground">{text || "—"}</span>;
const title = (main, sub) => (
  <div className="min-w-0">
    <p className="truncate font-medium text-foreground">{main}</p>
    {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
  </div>
);
const published = (on) =>
  on ? (
    <Badge className="bg-green-50 text-green-800 ring-1 ring-inset ring-green-700/15">Live</Badge>
  ) : (
    <Badge className="bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-700/15">Hidden</Badge>
  );
const date = (iso) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

const ORDER = { name: "order", label: "Display order", type: "number", half: true, help: "Lower numbers show first." };
const IMAGE = { name: "imageUrl", label: "Image", type: "image", help: "Upload a JPEG, PNG, WebP or GIF (max 5 MB), or paste a link." };

export const team = {
  api: { path: "team" },
  icon: Users,
  title: "Team",
  singular: "Team member",
  labelKey: "name",
  description: "The people on the Team and About pages.",
  emptyHint: "Add the people clients will work with.",
  newHint: "They appear on the Team page as soon as you save.",
  defaults: { order: 0 },
  columns: [
    { key: "name", label: "Name", render: (m) => title(m.name, m.position) },
    { key: "specialty", label: "Specialty", className: "hidden md:table-cell", render: (m) => muted(m.specialty) },
    { key: "order", label: "Order", className: "w-20 tabular-nums" },
  ],
  fields: [
    { name: "name", label: "Full name", type: "text", required: true, half: true },
    { name: "position", label: "Role", type: "text", required: true, half: true, placeholder: "Lead developer" },
    { name: "specialty", label: "Specialty", type: "text", placeholder: "Frontend development and graphic design" },
    { name: "bio", label: "Bio", type: "textarea", rows: 4 },
    { name: "funFact", label: "Off the clock", type: "text", help: "A short, human detail." },
    IMAGE,
    { name: "linkedin", label: "LinkedIn URL", type: "url", half: true },
    { name: "twitter", label: "X / Twitter URL", type: "url", half: true },
    ORDER,
  ],
};

export const services = {
  api: { path: "services" },
  icon: Briefcase,
  title: "Services",
  singular: "Service",
  labelKey: "name",
  description: "What TTS offers, shown on the Services page.",
  emptyHint: "Add the services you want clients to find.",
  newHint: "The slug is used in links, e.g. /services#web.",
  defaults: { order: 0 },
  columns: [
    { key: "name", label: "Service", render: (s) => title(s.name, s.description) },
    { key: "features", label: "Features", className: "hidden md:table-cell", render: (s) => muted(`${s.features?.length ?? 0} listed`) },
    { key: "order", label: "Order", className: "w-20 tabular-nums" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "slug", from: "name", required: true, half: true },
    ORDER,
    { name: "description", label: "Description", type: "textarea", rows: 3, required: true },
    { name: "features", label: "Features", type: "tags", help: "Separate with commas: Responsive design, SEO optimisation, …" },
    IMAGE,
  ],
};

export const projects = {
  api: { path: "projects" },
  icon: FolderKanban,
  title: "Projects",
  singular: "Project",
  labelKey: "title",
  description: "Portfolio work on the Projects page. Hidden projects stay in the admin only.",
  emptyHint: "Add a project to show it in the portfolio.",
  newHint: "Keep it hidden until the write-up and images are ready.",
  wide: true,
  defaults: { year: String(new Date().getFullYear()), published: false },
  columns: [
    { key: "title", label: "Project", render: (p) => title(p.title, p.category) },
    { key: "client", label: "Client", className: "hidden md:table-cell", render: (p) => muted(p.client) },
    { key: "year", label: "Year", className: "w-20 tabular-nums" },
    { key: "published", label: "Status", className: "w-24", render: (p) => published(p.published) },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "slug", from: "title", required: true, half: true },
    { name: "category", label: "Category", type: "text", required: true, half: true, placeholder: "Web Design" },
    { name: "client", label: "Client", type: "text", half: true },
    { name: "year", label: "Year", type: "number", required: true, half: true },
    { name: "description", label: "Description", type: "textarea", rows: 5, required: true },
    { name: "tags", label: "Tags", type: "tags", help: "Comma-separated: React, Figma, Tailwind CSS" },
    { name: "services", label: "Services provided", type: "tags" },
    { name: "outcomes", label: "Outcomes", type: "tags", help: "Only results you can stand behind." },
    IMAGE,
    { name: "imageAlt", label: "Image description", type: "text", help: "For screen readers: what the image shows." },
    { name: "published", label: "Show on the site", type: "switch" },
  ],
};

export const testimonials = {
  api: { path: "testimonials" },
  icon: Quote,
  title: "Testimonials",
  singular: "Testimonial",
  labelKey: "customerName",
  description: "Client quotes. Only publish real, attributable ones: the seeded quotes are placeholders.",
  emptyHint: "Add a quote from a client who agreed to be named.",
  newHint: "Hidden until you switch it on.",
  defaults: { published: false },
  columns: [
    { key: "customerName", label: "Client", render: (t) => title(t.customerName, t.company) },
    { key: "quote", label: "Quote", className: "hidden max-w-md md:table-cell", render: (t) => <span className="line-clamp-1 text-muted-foreground">{t.quote}</span> },
    { key: "published", label: "Status", className: "w-24", render: (t) => published(t.published) },
  ],
  fields: [
    { name: "customerName", label: "Name", type: "text", required: true, half: true },
    { name: "company", label: "Role and company", type: "text", required: true, half: true, placeholder: "Founder, Ama's Bakery" },
    { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true },
    { ...IMAGE, label: "Photo" },
    { name: "published", label: "Show on the site", type: "switch", help: "Only with the client's permission." },
  ],
};

export const milestones = {
  api: { path: "milestones" },
  icon: Milestone,
  title: "Milestones",
  singular: "Milestone",
  labelKey: "title",
  description: "The timeline on the About page, in display order.",
  emptyHint: "Add the moments that shaped TTS.",
  newHint: "Shown on the About page timeline.",
  defaults: { order: 0 },
  columns: [
    { key: "year", label: "Year", className: "w-24 tabular-nums" },
    { key: "title", label: "Milestone", render: (m) => title(m.title, m.description) },
    { key: "order", label: "Order", className: "w-20 tabular-nums" },
  ],
  fields: [
    { name: "year", label: "Year", type: "text", required: true, half: true, placeholder: "2025 or Present" },
    ORDER,
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", rows: 4, required: true },
    {
      name: "icon", label: "Icon", type: "select", placeholder: "No icon",
      options: ["rocket", "package", "trending-up", "globe", "users", "award", "flag", "star"].map((v) => ({ value: v, label: v })),
    },
  ],
};

const STATUS = {
  DRAFT: "bg-amber-50 text-amber-800 ring-amber-700/15",
  REVIEW: "bg-secondary text-secondary-foreground ring-primary/15",
  PUBLISHED: "bg-green-50 text-green-800 ring-green-700/15",
};

export const posts = {
  api: { path: "posts", listKey: "posts", itemKey: "post" },
  icon: FileText,
  title: "Posts",
  singular: "Post",
  labelKey: "title",
  description: "Blog posts. Drafts and posts in review stay private until published.",
  emptyHint: "Write the first post.",
  newHint: "Saved as a draft unless you publish it.",
  wide: true,
  fetchOneForEdit: true, // the list leaves out the body
  filterParam: "status",
  filters: [
    { value: "", label: "All" },
    { value: "DRAFT", label: "Drafts" },
    { value: "REVIEW", label: "In review" },
    { value: "PUBLISHED", label: "Published" },
  ],
  defaults: { status: "DRAFT", featured: false },
  columns: [
    {
      key: "title",
      label: "Article",
      render: (p) => (
        <div className="flex min-w-0 items-center gap-2">
          {p.featured && <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" aria-label="Featured" />}
          {title(p.title, p.category)}
        </div>
      ),
    },
    { key: "authorName", label: "Author", className: "hidden md:table-cell", render: (p) => muted(p.authorName) },
    {
      key: "status",
      label: "Status",
      className: "w-28",
      render: (p) => <Badge className={`capitalize ring-1 ring-inset ${STATUS[p.status]}`}>{p.status.toLowerCase()}</Badge>,
    },
    { key: "publishedAt", label: "Date", className: "hidden w-32 tabular-nums text-muted-foreground sm:table-cell", render: (p) => date(p.publishedAt ?? p.updatedAt) },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "slug", from: "title", required: true, half: true, help: "The post's address: /blogs/your-slug" },
    { name: "category", label: "Category", type: "text", required: true, half: true, placeholder: "Cybersecurity" },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, required: true, help: "One or two sentences for cards and search results." },
    { name: "content", label: "Body", type: "markdown", rows: 16, required: true, help: "Markdown: ## headings, **bold**, [links](https://…), - lists." },
    IMAGE,
    { name: "readTime", label: "Read time (minutes)", type: "number", half: true },
    {
      name: "status", label: "Status", type: "select", half: true, required: true,
      options: [
        { value: "DRAFT", label: "Draft" },
        { value: "REVIEW", label: "In review" },
        { value: "PUBLISHED", label: "Published" },
      ],
    },
    { name: "authorName", label: "Byline", type: "text", omitEmpty: true, placeholder: "Defaults to your name" },
    { name: "featured", label: "Feature this post", type: "switch", help: "Featured posts lead the blog page." },
  ],
};
