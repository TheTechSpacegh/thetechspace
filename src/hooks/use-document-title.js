// Sets the browser tab title for the current page.
import { useEffect } from "react";

const SITE = "TheTechSpace";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE}: design, build and grow digital products`;
  }, [title]);
}
