"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

// Footer visit counter, kept by the same Apps Script as the enquiry form
// (apps-script/enquiry-to-sheet.gs). One visit per browser tab session, so
// reloads and section jumps don't inflate it. Renders nothing until the
// endpoint is configured and has answered. Renders an <li> for the footer's meta line.
const SEEN = "rjchess-visit-counted";

export function VisitCounter() {
  const [visits, setVisits] = useState<number | null>(null);

  useEffect(() => {
    if (!site.enquiryEndpoint) return;
    let counted = false;
    try { counted = sessionStorage.getItem(SEEN) === "1"; } catch {}
    const ctl = new AbortController();
    fetch(`${site.enquiryEndpoint}?action=${counted ? "count" : "visit"}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: { ok?: boolean; visits?: unknown }) => {
        if (!j.ok || typeof j.visits !== "number") return;
        try { sessionStorage.setItem(SEEN, "1"); } catch {}
        setVisits(j.visits);
      })
      .catch(() => {});
    return () => ctl.abort();
  }, []);

  if (visits === null) return null;
  return (
    <li className="footer-visits">
      <span aria-hidden="true">&#9823;</span> {visits.toLocaleString("en-IN")} {visits === 1 ? "visit" : "visits"}
    </li>
  );
}
