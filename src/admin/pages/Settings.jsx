// Admin: your account, and (for owners) who can sign in to the console.
import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, Settings as SettingsIcon, ShieldCheck, Trash2, UserPlus } from "lucide-react";
// lucide-react 1.x dropped brand icons, so the GitHub mark comes from react-icons.
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { API_URL, ApiError, api } from "@/lib/api";
import BackendRequired from "../components/content/BackendRequired";
import { useAuth } from "../contexts/AuthContext";

const EMPTY = { email: "", name: "", role: "EDITOR", password: "" };

function GoogleMark() {
  return <span aria-hidden="true" className="text-xs font-bold">G</span>;
}

function SignInMethods({ signIn }) {
  const methods = [
    signIn.password && { key: "password", label: "Password", icon: <KeyRound className="size-3" /> },
    signIn.google && { key: "google", label: "Google", icon: <GoogleMark /> },
    signIn.github && { key: "github", label: "GitHub", icon: <FaGithub className="size-3" aria-hidden="true" /> },
  ].filter(Boolean);
  if (methods.length === 0) return <span className="text-xs text-muted-foreground">Google/GitHub on first sign-in</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {methods.map((m) => <Badge key={m.key} variant="outline" className="gap-1 font-normal">{m.icon} {m.label}</Badge>)}
    </div>
  );
}

function AdminAccess({ me }) {
  const [admins, setAdmins] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(null);

  const load = useCallback(() => api("/api/admin/users").then((b) => setAdmins(b.admins)).catch((err) => toast.error(err.message)), []);
  useEffect(() => {
    load();
  }, [load]);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const body = { email: form.email, name: form.name, role: form.role, ...(form.password ? { password: form.password } : {}) };
      const { admin } = await api("/api/admin/users", { method: "POST", body });
      toast.success(`${admin.email} can now sign in`);
      setForm(EMPTY);
      load();
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    const admin = confirming;
    setConfirming(null);
    try {
      await api(`/api/admin/users/${admin.id}`, { method: "DELETE" });
      toast.success(`${admin.email} no longer has access`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fieldErrors = (name) => errors[name]?.map((message) => ({ message }));

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium"><ShieldCheck className="size-5 text-primary" aria-hidden="true" /> Admin access</CardTitle>
        <CardDescription>
          Only people on this list can sign in. Google and GitHub sign-in never create accounts: they work for an email you've added here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 px-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="pl-6">Person</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Signs in with</TableHead>
              <TableHead className="w-16 pr-6"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(admins ?? []).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="pl-6">
                  <p className="font-medium text-foreground">{a.name}{a.id === me.id && <span className="ml-1.5 text-xs font-normal text-muted-foreground">(you)</span>}</p>
                  <p className="text-xs text-muted-foreground">{a.email}</p>
                </TableCell>
                <TableCell><Badge variant={a.role === "OWNER" ? "default" : "secondary"}>{a.role === "OWNER" ? "Owner" : "Editor"}</Badge></TableCell>
                <TableCell className="hidden md:table-cell"><SignInMethods signIn={a.signIn} /></TableCell>
                <TableCell className="pr-6 text-right">
                  {a.id !== me.id && (
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => setConfirming(a)} aria-label={`Remove ${a.email}`}>
                      <Trash2 />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <form onSubmit={add} noValidate className="px-6">
          <h3 className="mb-4 flex items-center gap-2 font-medium text-foreground"><UserPlus className="size-4 text-primary" aria-hidden="true" /> Add someone</h3>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.email) || undefined}>
              <FieldLabel htmlFor="new-admin-email">Email</FieldLabel>
              <Input id="new-admin-email" type="email" autoComplete="off" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={Boolean(errors.email) || undefined} />
              <FieldDescription>Use the address of their Google or GitHub account.</FieldDescription>
              <FieldError errors={fieldErrors("email")} />
            </Field>
            <Field data-invalid={Boolean(errors.name) || undefined}>
              <FieldLabel htmlFor="new-admin-name">Name</FieldLabel>
              <Input id="new-admin-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name) || undefined} />
              <FieldError errors={fieldErrors("name")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-admin-role">Role</FieldLabel>
              <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                <SelectTrigger id="new-admin-role" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor: manages content</SelectItem>
                  <SelectItem value="OWNER">Owner: also manages access</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field data-invalid={Boolean(errors.password) || undefined}>
              <FieldLabel htmlFor="new-admin-password">Password (optional)</FieldLabel>
              <Input id="new-admin-password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={Boolean(errors.password) || undefined} />
              <FieldDescription>Leave empty if they'll only use Google or GitHub. 12+ characters.</FieldDescription>
              <FieldError errors={fieldErrors("password")} />
            </Field>
          </FieldGroup>
          <Button type="submit" className="mt-5" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <UserPlus />} Give access
          </Button>
        </form>
      </CardContent>

      <AlertDialog open={Boolean(confirming)} onOpenChange={(o) => !o && setConfirming(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {confirming?.name}'s access?</AlertDialogTitle>
            <AlertDialogDescription>They're signed out immediately and can't sign in again unless you add them back.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90">Remove access</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default function Settings() {
  const { user } = useAuth();
  if (!API_URL) return <BackendRequired icon={SettingsIcon} title="Settings" />;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your account and who can use the admin console.</p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Your account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <div><p className="text-muted-foreground">Name</p><p className="font-medium text-foreground">{user.name}</p></div>
          <div><p className="text-muted-foreground">Email</p><p className="font-medium text-foreground">{user.email}</p></div>
          <div><p className="text-muted-foreground">Role</p><p className="font-medium text-foreground">{user.roleLabel}</p></div>
        </CardContent>
      </Card>

      {user.role === "OWNER" ? (
        <AdminAccess me={user} />
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="text-sm text-muted-foreground">Only owners can add or remove people. Ask an owner if someone needs access.</CardContent>
        </Card>
      )}
    </div>
  );
}
