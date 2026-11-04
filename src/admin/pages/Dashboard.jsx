// Admin overview — composed from Shadcn Space dashboard-shell-01 patterns
// (statistics, sales-overview chart, product table) using shadcn/ui parts.
import { Link } from "react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowRight, ArrowUpRight, FileText, Users, Briefcase, MessageSquare, Plus } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "../contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "../hooks/useDashboardData";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

const statusVariant = {
  published: "bg-green-50 text-green-800 ring-1 ring-inset ring-green-700/15",
  draft: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-700/15",
  review: "bg-secondary text-secondary-foreground ring-1 ring-inset ring-primary/15",
};

const chartConfig = {
  websites: { label: "Websites", color: "var(--chart-1)" },
  design: { label: "UI/UX & brand", color: "var(--chart-2)" },
  marketing: { label: "Marketing", color: "var(--chart-3)" },
};

const sitePages = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About", source: { label: "Milestones", to: "/admin/milestones" } },
  { path: "/services", name: "Services", source: { label: "Services", to: "/admin/services" } },
  { path: "/team", name: "Team", source: { label: "Team", to: "/admin/team" } },
  { path: "/blogs", name: "Blog", source: { label: "Posts", to: "/admin/posts" } },
  { path: "/contact", name: "Contact", source: { label: "Messages", to: "/admin/contacts" } },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, error } = useDashboardData();

  if (error) {
    return (
      <div role="alert" className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm">
        <p className="font-medium text-foreground">The dashboard couldn't load.</p>
        <p className="mt-1 text-muted-foreground">{error.message}. Refresh to try again.</p>
      </div>
    );
  }
  if (!data) return <DashboardSkeleton />;

  const { stats, enquiries, messages, unread, totalMessages, posts } = data;
  const enquiriesThisMonth = enquiries.at(-1)?.total ?? 0;

  const small = [
    { title: "Team members", value: stats.teamMembers, icon: Users, to: "/admin/team" },
    { title: "Active services", value: stats.activeServices, icon: Briefcase, to: "/admin/services" },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* ── Heading ── */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-foreground">
            {greeting()}, {user?.name?.split(" ")[0] || "Daniel"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!data.live && (
            <Badge variant="outline" className="h-7 border-amber-300 bg-amber-50 px-2.5 text-amber-800">Sample data</Badge>
          )}
          <Button asChild className="rounded-lg">
            <Link to="/admin/posts"><Plus /> New post</Link>
          </Button>
        </div>
      </div>

      {/* ── Statistics (dashboard-shell-01 / statistics pattern) ── */}
      <div className="grid grid-cols-12 gap-6">
        <Card className="relative col-span-12 overflow-hidden rounded-2xl xl:col-span-6">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Site activity</CardTitle>
            <CardDescription>Content and enquiries across thetechspace</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Published posts</p>
              <p className="text-3xl font-semibold tabular-nums text-card-foreground">{stats.totalPosts}</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-xs text-muted-foreground">Enquiries this month</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-semibold tabular-nums text-card-foreground">{enquiriesThisMonth}</p>
                <Badge className="bg-secondary font-medium text-secondary-foreground">{unread} unread</Badge>
              </div>
            </div>
          </CardContent>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-10 hidden size-44 rounded-full border-[18px] border-secondary sm:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-2 right-16 hidden size-14 rounded-2xl bg-primary/90 sm:block" />
        </Card>

        {small.map((s) => (
          <Card key={s.title} className="col-span-12 rounded-2xl sm:col-span-6 xl:col-span-3">
            <CardContent className="flex items-start justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium text-card-foreground">{s.title}</p>
                  <p className="text-3xl font-semibold tabular-nums text-card-foreground">{s.value}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-fit rounded-lg">
                  <Link to={s.to}>Manage <ArrowRight /></Link>
                </Button>
              </div>
              <div className="rounded-full p-3 outline outline-border">
                <s.icon className="size-4 text-primary" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ── Enquiries chart (sales-overview-chart pattern) ── */}
        <Card className="col-span-12 rounded-2xl xl:col-span-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Enquiries by service</CardTitle>
            <CardDescription>Contact-form requests over the last six months</CardDescription>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/contacts">Inbox <ArrowRight /></Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart accessibilityLayer data={enquiries}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={28} allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="websites" stackId="a" fill="var(--color-websites)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="design" stackId="a" fill="var(--color-design)" />
                <Bar dataKey="marketing" stackId="a" fill="var(--color-marketing)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* ── Inbox ── */}
        <Card className="col-span-12 gap-0 rounded-2xl pb-0 xl:col-span-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Inbox</CardTitle>
            <CardDescription>{unread} unread of {totalMessages}</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y">
              {messages.length === 0 && (
                <li className="px-6 py-6 text-sm text-muted-foreground">No messages yet. Enquiries from the contact form land here.</li>
              )}
              {messages.map((m) => (
                <li key={m.id}>
                  <Link to="/admin/contacts" className="flex items-start gap-3 px-6 py-3 hover:bg-muted/60">
                    <Avatar className="size-9">
                      <AvatarFallback className={`text-[11px] font-bold text-white ${m.color}`}>{m.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate text-sm ${m.read ? "text-foreground/80" : "font-semibold text-foreground"}`}>
                          {!m.read && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" aria-hidden="true" />}
                          {m.name}
                          {!m.read && <span className="sr-only"> (unread)</span>}
                        </p>
                        <span className="shrink-0 text-xs text-muted-foreground">{m.time}</span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">{m.message}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ── Posts table (top-product-table pattern) ── */}
        <Card className="col-span-12 gap-0 rounded-2xl pb-0 xl:col-span-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Recent blog posts</CardTitle>
            <CardAction>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/posts">All posts <ArrowRight /></Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="pl-6">Article</TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary">
                          <FileText className="size-4 text-primary" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-foreground/80 md:table-cell">{post.author}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize ${statusVariant[post.status]}`}>{post.status}</Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right text-muted-foreground tabular-nums">{post.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ── Live site ── */}
        <Card className="col-span-12 gap-0 rounded-2xl xl:col-span-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium">Live site</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-green-600" aria-hidden="true" /> All pages live
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ul className="divide-y">
              {sitePages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 px-6 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.source ? (
                        <>Content from <Link to={p.source.to} className="font-medium text-primary hover:underline">{p.source.label}</Link></>
                      ) : (
                        "Homepage"
                      )}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="icon" className="size-8">
                    <Link to={p.path} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.name} page (opens in a new tab)`}>
                      <ArrowUpRight />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
            <MessageSquare className="mr-1.5 size-3.5" aria-hidden="true" />
            {data.live ? "Contact form messages arrive in the inbox and by email" : "Connect the backend (VITE_API_URL) to receive contact-form messages"}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" aria-busy="true" aria-label="Loading dashboard">
      <Skeleton className="h-12 w-72 rounded-xl" />
      <div className="grid grid-cols-12 gap-6">
        <Skeleton className="col-span-12 h-40 rounded-2xl xl:col-span-6" />
        <Skeleton className="col-span-12 h-40 rounded-2xl sm:col-span-6 xl:col-span-3" />
        <Skeleton className="col-span-12 h-40 rounded-2xl sm:col-span-6 xl:col-span-3" />
        <Skeleton className="col-span-12 h-80 rounded-2xl xl:col-span-8" />
        <Skeleton className="col-span-12 h-80 rounded-2xl xl:col-span-4" />
      </div>
    </div>
  );
}
