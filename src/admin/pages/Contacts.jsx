// Admin: contact-form inbox (list + reading pane) and newsletter subscribers.
import { useCallback, useEffect, useState } from "react";
import { Download, Inbox, Mail, MailOpen, MessageSquare, Reply, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { API_URL, api } from "@/lib/api";
import { cn } from "@/lib/utils";
import BackendRequired from "../components/content/BackendRequired";
import { timeAgo } from "../hooks/useDashboardData";

const fullDate = (iso) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

function MessagesPanel() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const load = useCallback(async () => {
    try {
      setData(await api(`/api/admin/messages${unreadOnly ? "?unread=1" : ""}`));
    } catch (err) {
      toast.error(err.message);
      setData({ messages: [], unread: 0, total: 0 });
    }
  }, [unreadOnly]);

  useEffect(() => {
    load();
  }, [load]);

  const selected = data?.messages.find((m) => m.id === selectedId) ?? null;

  const setRead = async (m, read) => {
    setData((d) => ({ ...d, unread: d.unread + (read ? -1 : 1), messages: d.messages.map((x) => (x.id === m.id ? { ...x, read } : x)) }));
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "PATCH", body: { read } });
    } catch (err) {
      toast.error(err.message);
      load();
    }
  };

  const openMessage = (m) => {
    setSelectedId(m.id);
    if (!m.read) setRead(m, true);
  };

  const remove = async (m) => {
    try {
      await api(`/api/admin/messages/${m.id}`, { method: "DELETE" });
      setSelectedId(null);
      toast.success("Message deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!data) {
    return <div className="flex flex-col gap-3 p-6">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>;
  }

  return (
    <div className="grid min-h-[30rem] lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{data.unread}</span> unread · {data.total} {unreadOnly ? "shown" : "total"}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setUnreadOnly((v) => !v)} aria-pressed={unreadOnly}>
            {unreadOnly ? "Show all" : "Unread only"}
          </Button>
        </div>
        {data.messages.length === 0 ? (
          <Empty className="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
              <EmptyTitle>{unreadOnly ? "All caught up" : "No messages yet"}</EmptyTitle>
              <EmptyDescription>Enquiries from the site's contact form land here and in your email.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ul className="max-h-[36rem] divide-y overflow-y-auto">
            {data.messages.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => openMessage(m)}
                  aria-current={m.id === selectedId ? "true" : undefined}
                  className={cn("flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-muted/60", m.id === selectedId && "bg-secondary")}
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={cn("truncate text-sm", m.read ? "text-foreground/80" : "font-semibold text-foreground")}>
                      {!m.read && <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary align-middle" aria-hidden="true" />}
                      {m.firstName} {m.lastName}
                      {!m.read && <span className="sr-only"> (unread)</span>}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                  </span>
                  {m.projectType && <span className="text-xs text-primary">{m.projectType}</span>}
                  <span className="line-clamp-1 text-sm text-muted-foreground">{m.details}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-6">
        {selected ? (
          <article className="flex flex-col gap-5">
            <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selected.firstName} {selected.lastName}</h2>
                <p className="text-sm text-muted-foreground">
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                  {selected.phone && <> · <a href={`tel:${selected.phone}`} className="hover:underline">{selected.phone}</a></>}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{fullDate(selected.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a href={`mailto:${selected.email}?subject=${encodeURIComponent("Re: your enquiry to TheTechSpace")}`}><Reply /> Reply</a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => setRead(selected, !selected.read)}>
                  {selected.read ? <><Mail /> Mark unread</> : <><MailOpen /> Mark read</>}
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => remove(selected)} aria-label="Delete message">
                  <Trash2 />
                </Button>
              </div>
            </header>
            {(selected.projectType || selected.budget) && (
              <div className="flex flex-wrap gap-2">
                {selected.projectType && <Badge variant="outline">{selected.projectType}</Badge>}
                {selected.budget && <Badge variant="outline">Budget: {selected.budget}</Badge>}
              </div>
            )}
            <p className="whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm leading-relaxed text-foreground">{selected.details}</p>
          </article>
        ) : (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon"><MessageSquare /></EmptyMedia>
              <EmptyTitle>Pick a message</EmptyTitle>
              <EmptyDescription>Opening a message marks it as read.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}

function SubscribersPanel() {
  const [subscribers, setSubscribers] = useState(null);

  useEffect(() => {
    api("/api/admin/subscribers")
      .then((b) => setSubscribers(b.subscribers))
      .catch((err) => {
        toast.error(err.message);
        setSubscribers([]);
      });
  }, []);

  const remove = async (s) => {
    try {
      await api(`/api/admin/subscribers/${s.id}`, { method: "DELETE" });
      setSubscribers((list) => list.filter((x) => x.id !== s.id));
      toast.success(`${s.email} removed`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!subscribers) return <div className="p-6"><Skeleton className="h-40 rounded-lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b px-6 py-3">
        <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{subscribers.length}</span> active subscribers</p>
        <Button asChild variant="outline" size="sm">
          {/* A plain link: the browser sends the session cookie and saves the file. */}
          <a href={`${API_URL}/api/admin/subscribers?format=csv`}><Download /> Export CSV</a>
        </Button>
      </div>
      {subscribers.length === 0 ? (
        <Empty className="py-12">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Users /></EmptyMedia>
            <EmptyTitle>No subscribers yet</EmptyTitle>
            <EmptyDescription>Sign-ups from the newsletter section appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-6">Email</TableHead>
              <TableHead>Subscribed</TableHead>
              <TableHead className="w-16 pr-6"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="pl-6 font-medium">{s.email}</TableCell>
                <TableCell className="text-muted-foreground">{fullDate(s.subscribedAt)}</TableCell>
                <TableCell className="pr-6 text-right">
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => remove(s)} aria-label={`Remove ${s.email}`}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default function Contacts() {
  if (!API_URL) return <BackendRequired icon={MessageSquare} title="Messages" />;
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enquiries from the contact form and newsletter sign-ups.</p>
      </div>
      <Tabs defaultValue="inbox" className="gap-4">
        <TabsList>
          <TabsTrigger value="inbox"><Inbox /> Inbox</TabsTrigger>
          <TabsTrigger value="subscribers"><Users /> Subscribers</TabsTrigger>
        </TabsList>
        <Card className="gap-0 overflow-hidden rounded-2xl py-0">
          <TabsContent value="inbox"><MessagesPanel /></TabsContent>
          <TabsContent value="subscribers"><SubscribersPanel /></TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
