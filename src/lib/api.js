// Thin wrapper around the TTS API (Backend/ in its own repo). Every call sends
// the session cookie, and every error carries the API's message and per-field
// details so forms can show them.
export const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error?.message ?? `Request failed (${status})`);
    this.status = status;
    this.code = body?.error?.code;
    this.fields = body?.error?.fields;
  }
}

export async function api(path, { method = "GET", body, signal } = {}) {
  if (!API_URL) throw new ApiError(0, { error: { code: "no_api", message: "The TTS backend isn't connected yet" } });
  const res = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}
