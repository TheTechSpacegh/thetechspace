// The newest contact-form messages for the header bell: live from the API
// when VITE_API_URL is set, otherwise the sample inbox. `refresh` reloads them
// (the bell calls it each time it opens).
import { useCallback, useEffect, useState } from "react";
import { API_URL, api } from "@/lib/api";
import { mockLatestMessages } from "../data/mockData";
import { toMessagePreview } from "./useDashboardData";

const SAMPLE = { messages: mockLatestMessages.slice(0, 4), unread: mockLatestMessages.filter((m) => !m.read).length };

export function useInboxPreview() {
  const [inbox, setInbox] = useState(API_URL ? { messages: [], unread: 0 } : SAMPLE);

  const refresh = useCallback(() => {
    if (!API_URL) return;
    api("/api/admin/messages")
      .then((body) => setInbox({ messages: body.messages.slice(0, 4).map(toMessagePreview), unread: body.unread }))
      .catch(() => {});
  }, []);

  useEffect(refresh, [refresh]);

  return { ...inbox, refresh };
}
