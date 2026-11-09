// Admin: your account, and (for owners) who can sign in to the console.
import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, MailPlus, Pencil, Settings as SettingsIcon, ShieldCheck, Trash2, UserPlus } from "lucide-react";
// lucide-react 1.x dropped brand icons, so the GitHub mark comes from react-icons.
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { API_URL, ApiError, api } from "@/lib/api";
import BackendRequired from "../components/content/BackendRequired";
import { useAuth } from "../contexts/AuthContext";

const EMPTY = { email: "", name: "", role: "EDITOR", password: "" };
const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };
const LOGIN_URL = `${window.location.origin}/admin/login`;

// Tells the owner whether the invite email went out, and what to do if not.
function announceInvite(email, invite, { resend = false } = {}) {
  if (invite?.sent) {
    toast.success(resend ? `Invite sent again to ${email}` : `${email} can now sign in. We've emailed them how.`);
  } else if (invite?.reason === "send_failed") {
    toast.warning(`${resend ? "" : `${email} can now sign in, but `}the invite email didn't send. Try again, or send them ${LOGIN_URL} yourself.`);
  } else {
    toast.info(`${resend ? "" : `${email} can now sign in. `}Email isn't set up yet, so let them know yourself: ${LOGIN_URL}`, { duration: 10000 });
  }
}

function ChangePassword({ user, onChanged }) {
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const hasPassword = user.hasPassword !== false;

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setErrors({ confirmPassword: ["The two new passwords don't match"] });
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      const body = { newPassword: form.newPassword, ...(hasPassword ? { currentPassword: form.currentPassword } : {}) };
      const { admin } = await api("/api/auth/password", { method: "PUT", body });
      onChanged(admin);
      setForm(EMPTY_PASSWORDS);
      toast.success(hasPassword ? "Password changed. Other devices have been signed out." : "Password set. You can now sign in with it too.");
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, autoComplete, description) => (
    <Field data-invalid={Boolean(errors[name]) || undefined}>
      <FieldLabel htmlFor={`account-${name}`}>{label}</FieldLabel>
      <PasswordInput
        id={`account-${name}`} autoComplete={autoComplete} value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })} aria-invalid={Boolean(errors[name]) || undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldError errors={errors[name]?.map((message) => ({ message }))} />
    </Field>
  );

  return (
    <form onSubmit={submit} noValidate className="border-t pt-6">
      <h3 className="mb-1 flex items-center gap-2 font-medium text-foreground"><KeyRound className="size-4 text-primary" aria-hidden="true" /> {hasPassword ? "Change password" : "Set a password"}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {hasPassword ? "Changing it signs you out everywhere else." : "You sign in with Google or GitHub. A password gives you a second way in."}
      </p>
      <FieldGroup className="grid gap-5 sm:grid-cols-3">
        {hasPassword && field("currentPassword", "Current password", "current-password")}
        {field("newPassword", "New password", "new-password", "12+ characters.")}
        {field("confirmPassword", "Confirm new password", "new-password")}
      </FieldGroup>
      <Button type="submit" className="mt-5" disabled={saving || !form.newPassword || (hasPassword && !form.currentPassword)}>
        {saving ? <Loader2 className="animate-spin" /> : <KeyRound />} {hasPassword ? "Change password" : "Set password"}
      </Button>
    </form>
  );
}

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

// Your own name, saved in place; the button appears once it changes.
function NameField({ user, onChanged }) {
  const [name, setName] = useState(user.name);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const dirty = name.trim() !== user.name;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { admin } = await api("/api/auth/me", { method: "PATCH", body: { name } });
      onChanged(admin);
      setName(admin.name);
      toast.success("Name updated");
    } catch (err) {
      setError(err instanceof ApiError && err.fields?.name ? err.fields.name[0] : err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} noValidate>
      <Field data-invalid={Boolean(error) || undefined}>
        <FieldLabel htmlFor="account-name">Name</FieldLabel>
        <div className="flex gap-2">
          <Input id="account-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={Boolean(error) || undefined} />
          {dirty && (
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving && <Loader2 className="animate-spin" />} Save
            </Button>
          )}
        </div>
        <FieldError errors={error ? [{ message: error }] : undefined} />
      </Field>
    </form>
  );
}

// Side panel for one admin: name, role and (for others) a new password.
function EditAdmin({ admin, me, onClose, onSaved }) {
  const [form, setForm] = useState({ name: admin.name, role: admin.role, password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const isMe = admin.id === me.id;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const changes = {
        ...(form.name.trim() !== admin.name ? { name: form.name } : {}),
        ...(form.role !== admin.role ? { role: form.role } : {}),
      };
      if (Object.keys(changes).length) await api(`/api/admin/users/${admin.id}`, { method: "PATCH", body: changes });
      if (form.password) await api(`/api/admin/users/${admin.id}/password`, { method: "PUT", body: { password: form.password } });
      toast.success(form.password ? `Saved. ${admin.name} has been signed out; share the new password with them.` : "Saved");
      onSaved({ selfChanged: isMe && Object.keys(changes).length > 0 });
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const fieldErrors = (name) => errors[name]?.map((message) => ({ message }));

  return (
    <Sheet open onOpenChange={(o) => !o && !saving && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <form onSubmit={save} noValidate className="flex min-h-0 flex-1 flex-col">
          <SheetHeader className="border-b">
            <SheetTitle>Edit {isMe ? "your access" : admin.name}</SheetTitle>
            <SheetDescription>{admin.email}</SheetDescription>
          </SheetHeader>
          <FieldGroup className="flex-1 gap-5 overflow-y-auto p-4">
            <Field data-invalid={Boolean(errors.name) || undefined}>
              <FieldLabel htmlFor="edit-admin-name">Name</FieldLabel>
              <Input id="edit-admin-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={Boolean(errors.name) || undefined} />
              <FieldError errors={fieldErrors("name")} />
            </Field>
            <Field data-invalid={Boolean(errors.role) || undefined}>
              <FieldLabel htmlFor="edit-admin-role">Role</FieldLabel>
              <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                <SelectTrigger id="edit-admin-role" className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EDITOR">Editor: manages content</SelectItem>
                  <SelectItem value="OWNER">Owner: also manages access</SelectItem>
                </SelectContent>
              </Select>
              {isMe && form.role === "EDITOR" && admin.role === "OWNER" && (
                <FieldDescription>You'll lose access to this page once you save.</FieldDescription>
              )}
              <FieldError errors={fieldErrors("role")} />
            </Field>
            {!isMe && (
              <Field data-invalid={Boolean(errors.password) || undefined} className="border-t pt-5">
                <FieldLabel htmlFor="edit-admin-password">Set a new password (optional)</FieldLabel>
                <PasswordInput id="edit-admin-password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={Boolean(errors.password) || undefined} />
                <FieldDescription>For someone who's locked out. 12+ characters. It signs them out everywhere; share it with them yourself.</FieldDescription>
                <FieldError errors={fieldErrors("password")} />
              </Field>
            )}
          </FieldGroup>
          <SheetFooter className="flex-row justify-end border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving && <Loader2 className="animate-spin" />} Save</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function AdminAccess({ me, onSelfChanged }) {
  const [admins, setAdmins] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [editing, setEditing] = useState(null);

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
      const { admin, invite } = await api("/api/admin/users", { method: "POST", body });
      announceInvite(admin.email, invite);
      setForm(EMPTY);
      load();
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const [resending, setResending] = useState(null);
  const resendInvite = async (admin) => {
    setResending(admin.id);
    try {
      const { invite } = await api(`/api/admin/users/${admin.id}/invite`, { method: "POST" });
      announceInvite(admin.email, invite, { resend: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(null);
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
              <TableHead className="w-32 pr-6"><span className="sr-only">Actions</span></TableHead>
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
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => setEditing(a)} aria-label={`Edit ${a.email}`} title="Edit">
                      <Pencil />
                    </Button>
                    {a.id !== me.id && (
                      <>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => resendInvite(a)} disabled={resending === a.id} aria-label={`Resend invite to ${a.email}`} title="Resend invite">
                        {resending === a.id ? <Loader2 className="animate-spin" /> : <MailPlus />}
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => setConfirming(a)} aria-label={`Remove ${a.email}`} title="Remove access">
                        <Trash2 />
                      </Button>
                      </>
                    )}
                  </div>
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
              <PasswordInput id="new-admin-password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={Boolean(errors.password) || undefined} />
              <FieldDescription>Leave empty if they'll only use Google or GitHub. 12+ characters.</FieldDescription>
              <FieldError errors={fieldErrors("password")} />
            </Field>
          </FieldGroup>
          <Button type="submit" className="mt-5" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <UserPlus />} Give access
          </Button>
        </form>
      </CardContent>

      {editing && (
        <EditAdmin
          key={editing.id}
          admin={editing}
          me={me}
          onClose={() => setEditing(null)}
          onSaved={({ selfChanged }) => {
            setEditing(null);
            if (selfChanged) onSelfChanged();
            else load();
          }}
        />
      )}

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
  const { user, updateUser } = useAuth();
  // After editing your own name or role in the admin list.
  const refreshMe = () => api("/api/auth/me").then((b) => updateUser(b.admin)).catch(() => {});
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
        <CardContent className="flex flex-col gap-6">
          <div className="grid items-start gap-x-8 gap-y-4 text-sm sm:grid-cols-[minmax(0,20rem)_auto_auto]">
            <NameField key={user.name} user={user} onChanged={updateUser} />
            <div><p className="font-medium text-foreground">Email</p><p className="mt-2.5 text-muted-foreground">{user.email}</p></div>
            <div><p className="font-medium text-foreground">Role</p><p className="mt-2.5 text-muted-foreground">{user.roleLabel}</p></div>
          </div>
          <ChangePassword user={user} onChanged={updateUser} />
        </CardContent>
      </Card>

      {user.role === "OWNER" ? (
        <AdminAccess key={`${user.role}-${user.name}`} me={user} onSelfChanged={refreshMe} />
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="text-sm text-muted-foreground">Only owners can add or remove people. Ask an owner if someone needs access.</CardContent>
        </Card>
      )}
    </div>
  );
}
