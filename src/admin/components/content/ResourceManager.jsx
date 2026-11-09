// One admin screen for any content collection: a table, a side-panel editor
// and a delete confirmation, driven by a config from src/admin/lib/resources.js.
// Built from shadcn/ui Table, Sheet, AlertDialog and Tabs (Shadcn Space
// dashboard-shell-01 table pattern).
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { API_URL, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useResource } from "../../hooks/useResource";
import BackendRequired from "./BackendRequired";
import ResourceForm from "./ResourceForm";
import { toFormValues, toPayload } from "../../lib/form-values";

export default function ResourceManager({ config }) {
  const [filter, setFilter] = useState(config.filters?.[0]?.value ?? "");
  const resource = useResource({ ...config.api, query: filter ? `?${config.filterParam}=${filter}` : "" });
  const [editing, setEditing] = useState(null); // null | { item?: object }
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [slugLocked, setSlugLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [opening, setOpening] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { getOne } = resource;

  // Opens one item straight from a link (the header search adds ?edit=<id>).
  const openById = useCallback(
    async (id) => {
      try {
        const item = await getOne(id);
        setErrors({});
        setSlugLocked(true);
        setValues(toFormValues(config.fields, item, config.defaults));
        setEditing({ item });
      } catch {
        toast.error(`That ${config.singular.toLowerCase()} couldn't be found. It may have been deleted.`);
      }
    },
    [getOne, config],
  );

  useEffect(() => {
    if (!editId || !API_URL) return;
    setSearchParams((params) => {
      params.delete("edit");
      return params;
    }, { replace: true });
    openById(editId);
  }, [editId, openById, setSearchParams]);

  if (!API_URL) return <BackendRequired icon={config.icon} title={config.title} />;

  const open = async (item) => {
    setErrors({});
    setSlugLocked(Boolean(item));
    if (item && config.fetchOneForEdit) {
      setOpening(item.id);
      try {
        item = await resource.getOne(item.id);
      } catch (err) {
        toast.error(err.message);
        return;
      } finally {
        setOpening(null);
      }
    }
    setValues(toFormValues(config.fields, item ?? {}, config.defaults));
    setEditing({ item });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const body = toPayload(config.fields, values);
      if (editing.item) await resource.update(editing.item.id, body);
      else await resource.create(body);
      toast.success(`${config.singular} ${editing.item ? "saved" : "created"}`);
      setEditing(null);
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const item = confirming;
    setConfirming(null);
    try {
      await resource.remove(item.id);
      toast.success(`${config.singular} deleted`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const items = resource.items;
  const label = (item) => item[config.labelKey] ?? config.singular;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{config.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button onClick={() => open(null)} className="rounded-lg">
          <Plus /> New {config.singular.toLowerCase()}
        </Button>
      </div>

      {config.filters && (
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            {config.filters.map((f) => (
              <TabsTrigger key={f.value || "all"} value={f.value}>{f.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <Card className="gap-0 overflow-hidden rounded-2xl py-0">
        {resource.error ? (
          <div role="alert" className="p-6 text-sm">
            <p className="font-medium text-foreground">Couldn't load {config.title.toLowerCase()}.</p>
            <p className="mt-1 text-muted-foreground">{resource.error.message}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={resource.reload}>Try again</Button>
          </div>
        ) : items === null ? (
          <div className="flex flex-col gap-3 p-6" aria-busy="true" aria-label={`Loading ${config.title.toLowerCase()}`}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
          </div>
        ) : items.length === 0 ? (
          <Empty className="py-14">
            <EmptyHeader>
              <EmptyMedia variant="icon"><config.icon /></EmptyMedia>
              <EmptyTitle>No {config.title.toLowerCase()} {filter ? "here" : "yet"}</EmptyTitle>
              <EmptyDescription>{config.emptyHint}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => open(null)} variant="outline" className="rounded-lg"><Plus /> New {config.singular.toLowerCase()}</Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {config.columns.map((c, i) => (
                  <TableHead key={c.key} className={cn(i === 0 && "pl-6", c.className)}>{c.label}</TableHead>
                ))}
                <TableHead className="w-28 pr-6 text-right"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="cursor-pointer" onClick={() => open(item)}>
                  {config.columns.map((c, i) => (
                    <TableCell key={c.key} className={cn("truncate py-3", i === 0 && "pl-6", c.className)}>
                      {c.render ? c.render(item) : item[c.key]}
                    </TableCell>
                  ))}
                  <TableCell className="pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => open(item)} aria-label={`Edit ${label(item)}`}>
                      {opening === item.id ? <Loader2 className="animate-spin" /> : <Pencil />}
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => setConfirming(item)} aria-label={`Delete ${label(item)}`}>
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={Boolean(editing)} onOpenChange={(o) => !o && !saving && setEditing(null)}>
        <SheetContent className={cn("flex w-full flex-col gap-0 p-0", config.wide ? "sm:max-w-2xl" : "sm:max-w-xl")}>
          <form onSubmit={save} className="flex min-h-0 flex-1 flex-col" noValidate>
            <SheetHeader className="border-b px-6 py-5">
              <SheetTitle>{editing?.item ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}</SheetTitle>
              <SheetDescription>{editing?.item ? label(editing.item) : config.newHint}</SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              {editing && (
                <ResourceForm
                  fields={config.fields}
                  values={values}
                  onChange={setValues}
                  errors={errors}
                  slugLocked={slugLocked}
                  onSlugEdit={() => setSlugLocked(true)}
                />
              )}
            </div>
            <SheetFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
              {editing?.item && (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={saving}
                  onClick={() => {
                    const item = editing.item;
                    setEditing(null);
                    setConfirming(item);
                  }}
                >
                  <Trash2 /> Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="animate-spin" />} {editing?.item ? "Save changes" : `Create ${config.singular.toLowerCase()}`}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <AlertDialog open={Boolean(confirming)} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirming ? `"${label(confirming)}"` : ""}?</AlertDialogTitle>
            <AlertDialogDescription>
              It disappears from the site straight away. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
