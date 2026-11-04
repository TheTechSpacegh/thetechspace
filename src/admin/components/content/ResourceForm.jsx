// Builds an edit form from a field list (see src/admin/lib/resources.jsx).
// Value conversion to and from the API lives in src/admin/lib/form-values.js.
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { uploadImage } from "../../hooks/useResource";
import { slugify } from "../../lib/form-values";

function ImageInput({ id, value, onChange, invalid }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setUploadError("");
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border bg-muted">
          {value ? <img src={value} alt="" className="size-full object-cover" /> : <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />}
        </div>
        <Input id={id} type="url" inputMode="url" placeholder="https://…" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined} />
        <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={busy} className="shrink-0">
          {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />} Upload
        </Button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" tabIndex={-1} onChange={pick} />
      </div>
      {uploadError && <p role="alert" className="text-sm text-destructive">{uploadError}</p>}
    </div>
  );
}

export default function ResourceForm({ fields, values, onChange, errors = {}, slugLocked, onSlugEdit }) {
  const set = (name) => (value) => onChange({ ...values, [name]: value });

  // Typing the title also fills the slug until the slug is edited by hand.
  const setWithSlug = (f) => (value) => {
    const next = { ...values, [f.name]: value };
    for (const target of fields.filter((x) => x.type === "slug" && x.from === f.name)) {
      if (!slugLocked) next[target.name] = slugify(value);
    }
    onChange(next);
  };

  return (
    <FieldGroup className="grid grid-cols-2 gap-5">
      {fields.map((f) => {
        const id = `field-${f.name}`;
        const fieldErrors = errors[f.name]?.map((message) => ({ message }));
        const invalid = Boolean(fieldErrors?.length);
        const value = values[f.name];
        const drivesSlug = fields.some((x) => x.type === "slug" && x.from === f.name);
        const onValue = drivesSlug ? setWithSlug(f) : set(f.name);

        if (f.type === "switch") {
          return (
            <Field key={f.name} orientation="horizontal" className={cn("col-span-2 rounded-lg border p-3", f.half && "sm:col-span-1")}>
              <Switch id={id} checked={Boolean(value)} onCheckedChange={onValue} />
              <div className="flex flex-col gap-0.5">
                <FieldLabel htmlFor={id}>{f.label}</FieldLabel>
                {f.help && <FieldDescription>{f.help}</FieldDescription>}
              </div>
            </Field>
          );
        }

        let control;
        if (f.type === "textarea" || f.type === "markdown") {
          control = (
            <Textarea
              id={id}
              rows={f.rows ?? 4}
              value={value}
              onChange={(e) => onValue(e.target.value)}
              placeholder={f.placeholder}
              aria-invalid={invalid || undefined}
              className={f.type === "markdown" ? "font-mono text-sm" : undefined}
            />
          );
        } else if (f.type === "select") {
          control = (
            <Select value={value || undefined} onValueChange={onValue}>
              <SelectTrigger id={id} className="w-full" aria-invalid={invalid || undefined}>
                <SelectValue placeholder={f.placeholder ?? "Choose…"} />
              </SelectTrigger>
              <SelectContent>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        } else if (f.type === "image") {
          control = <ImageInput id={id} value={value} onChange={onValue} invalid={invalid} />;
        } else {
          control = (
            <Input
              id={id}
              type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
              inputMode={f.type === "number" ? "numeric" : undefined}
              value={value}
              onChange={(e) => {
                if (f.type === "slug") onSlugEdit?.();
                onValue(f.type === "slug" ? e.target.value.toLowerCase() : e.target.value);
              }}
              placeholder={f.placeholder}
              aria-invalid={invalid || undefined}
              className={f.type === "slug" ? "font-mono text-sm" : undefined}
            />
          );
        }

        return (
          <Field key={f.name} data-invalid={invalid || undefined} className={cn("col-span-2", f.half && "sm:col-span-1")}>
            <FieldLabel htmlFor={id}>
              {f.label}
              {f.required && <span className="text-destructive" aria-hidden="true">*</span>}
            </FieldLabel>
            {control}
            {f.help && <FieldDescription>{f.help}</FieldDescription>}
            <FieldError errors={fieldErrors} />
          </Field>
        );
      })}
    </FieldGroup>
  );
}
