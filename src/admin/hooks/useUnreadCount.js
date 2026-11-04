// Unread contact-form messages for the sidebar badge: live from the API when
// VITE_API_URL is set, otherwise counted from the sample inbox.
import { useEffect, useState } from "react";
import { API_URL, api } from "@/lib/api";
import { mockLatestMessages } from "../data/mockData";

const SAMPLE_UNREAD = mockLatestMessages.filter((m) => !m.read).length;

export function useUnreadCount() {
  const [unread, setUnread] = useState(API_URL ? 0 : SAMPLE_UNREAD);

  useEffect(() => {
    if (!API_URL) return;
    const controller = new AbortController();
    api("/api/admin/messages?unread=1", { signal: controller.signal })
      .then((body) => setUnread(body.unread))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return unread;
}
