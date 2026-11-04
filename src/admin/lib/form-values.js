// Converts between API items and the admin form's string/boolean values.
// Kept out of ResourceForm.jsx so that file exports only components.

export const slugify = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

// API item → form values (everything a string or boolean, ready for inputs).
export function toFormValues(fields, item = {}, defaults = {}) {
  const values = {};
  for (const f of fields) {
    const v = item[f.name] ?? defaults[f.name];
    if (f.type === "switch") values[f.name] = Boolean(v);
    else if (f.type === "tags") values[f.name] = Array.isArray(v) ? v.join(", ") : v ?? "";
    else values[f.name] = v === null || v === undefined ? "" : String(v);
  }
  return values;
}

// Form values → request body. Optional empty fields become null; required
// ones are sent as-is so the API can say what's missing.
export function toPayload(fields, values) {
  const body = {};
  for (const f of fields) {
    const raw = values[f.name];
    if (f.type === "switch") body[f.name] = Boolean(raw);
    else if (f.type === "tags") body[f.name] = String(raw ?? "").split(",").map((t) => t.trim()).filter(Boolean);
    else if (f.type === "number") body[f.name] = raw === "" ? (f.required ? undefined : null) : Number(raw);
    else {
      const s = String(raw ?? "").trim();
      if (s === "" && f.omitEmpty) continue;
      body[f.name] = s === "" && !f.required ? null : s;
    }
  }
  return body;
}
