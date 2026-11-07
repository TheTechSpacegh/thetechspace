// Admin console destinations: the sidebar renders `nav`, and the header search
// jumps to anything in `destinations` (pages plus common tasks).
import {
  Briefcase, FileText, FolderKanban, HelpCircle, KeyRound, LayoutDashboard, Mail, MessageSquare, Milestone,
  Quote, Settings, UserPlus, Users,
} from "lucide-react";

export const nav = [
  {
    label: "Content",
    items: [
      { title: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
      { title: "Posts", href: "/admin/posts", icon: FileText },
      { title: "Team", href: "/admin/team", icon: Users },
      { title: "Services", href: "/admin/services", icon: Briefcase },
      { title: "Projects", href: "/admin/projects", icon: FolderKanban },
      { title: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { title: "Milestones", href: "/admin/milestones", icon: Milestone },
      { title: "Messages", href: "/admin/contacts", icon: MessageSquare, badge: "unread" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", href: "/admin/settings", icon: Settings },
      { title: "Help Center", href: "/admin/help", icon: HelpCircle },
    ],
  },
];

const tasks = [
  { title: "Write a new post", href: "/admin/posts", icon: FileText, keywords: "blog article draft publish" },
  { title: "Newsletter subscribers", href: "/admin/contacts", icon: Mail, keywords: "email export csv inbox enquiries" },
  { title: "Change your password", href: "/admin/settings", icon: KeyRound, keywords: "account security" },
  { title: "Add or remove an admin", href: "/admin/settings", icon: UserPlus, keywords: "invite access people users owner editor" },
];

export const destinations = [
  ...nav.flatMap((group) => group.items.map((item) => ({ ...item, keywords: group.label }))),
  ...tasks,
];
