// Loads and edits one admin collection (team, posts, …) through the API.
import { useCallback, useEffect, useState } from "react";
import { API_URL, api } from "@/lib/api";
import { announceContentChange } from "@/lib/content";

export function useResource({ path, listKey = path, itemKey = "item", query = "" }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const base = `/api/admin/${path}`;

  const reload = useCallback(async () => {
    try {
      setError(null);
      const body = await api(`${base}${query}`);
      setItems(body[listKey]);
    } catch (err) {
      setError(err);
    }
  }, [base, listKey, query]);

  useEffect(() => {
    if (API_URL) reload();
  }, [reload]);

  const getOne = useCallback(async (id) => (await api(`${base}/${id}`))[itemKey], [base, itemKey]);

  const create = useCallback(
    async (data) => {
      const body = await api(base, { method: "POST", body: data });
      announceContentChange();
      await reload();
      return body[itemKey];
    },
    [base, itemKey, reload],
  );

  const update = useCallback(
    async (id, data) => {
      const body = await api(`${base}/${id}`, { method: "PATCH", body: data });
      announceContentChange();
      await reload();
      return body[itemKey];
    },
    [base, itemKey, reload],
  );

  const remove = useCallback(
    async (id) => {
      await api(`${base}/${id}`, { method: "DELETE" });
      announceContentChange();
      setItems((list) => list?.filter((item) => item.id !== id) ?? list);
    },
    [base],
  );

  return { items, error, reload, getOne, create, update, remove };
}

// Uploads one image to /api/admin/uploads and returns its public URL.
export async function uploadImage(file) {
  const form = new FormData();
  form.set("file", file);
  const res = await fetch(`${API_URL}/api/admin/uploads`, { method: "POST", credentials: "include", body: form });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error?.message ?? `Upload failed (${res.status})`);
  return body.url;
}
