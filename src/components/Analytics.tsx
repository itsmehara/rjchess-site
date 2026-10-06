"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

// Google Analytics 4, consent first (UK/EU rules): nothing from Google loads until the
// visitor clicks Allow. The choice is kept in this browser; the Privacy page can change it.
// Renders nothing at all unless NEXT_PUBLIC_GA_ID is set.
const KEY = "rjchess-analytics";
const OPEN = "rjchess:analytics-choice"; // event the Privacy page fires to reopen the banner
type Choice = "granted" | "denied" | null;

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }
}

function read(): Choice {
  try { const v = localStorage.getItem(KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}
function save(c: Exclude<Choice, null>) {
  try { localStorage.setItem(KEY, c); } catch {}
}

function load(id: string) {
  if (window.gtag) { window.gtag("consent", "update", { analytics_storage: "granted" }); return; }
  window.dataLayer = window.dataLayer || [];
  // gtag must push the real `arguments` object, as Google's snippet does.
  window.gtag = function () { window.dataLayer!.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  window.gtag("config", id);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

function stop(id: string) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
  // Remove the _ga cookies set while it was allowed.
  const host = location.hostname.replace(/^www\./, "");
  document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n === "_ga" || n.startsWith("_ga_")).forEach((n) => {
    for (const d of ["", `; domain=${host}`, `; domain=.${host}`]) document.cookie = `${n}=; Max-Age=0; path=/${d}`;
  });
}

export function Analytics() {
  const id = site.analyticsId;
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!id) return;
    const c = read();
    if (c === "granted") load(id);
    // Deferred a tick so the banner mounts after hydration (same pattern as EnquiryForm).
    const t = c === null ? window.setTimeout(() => setAsk(true), 0) : 0;
    const reopen = () => setAsk(true);
    window.addEventListener(OPEN, reopen);
    return () => { window.clearTimeout(t); window.removeEventListener(OPEN, reopen); };
  }, [id]);

  if (!id || !ask) return null;
  const choose = (c: Exclude<Choice, null>) => {
    save(c);
    if (c === "granted") load(id); else stop(id);
    setAsk(false);
  };
  return (
    <div className="consent-bar" role="dialog" aria-label="Analytics choice">
      <p>
        May we use Google Analytics to see which pages help families find us? No ads, nothing sold.{" "}
        <Link href="/privacy/">Privacy</Link>
      </p>
      <div className="consent-actions">
        <button type="button" onClick={() => choose("denied")}>No thanks</button>
        <button type="button" onClick={() => choose("granted")}>Allow</button>
      </div>
    </div>
  );
}

// On the Privacy page: shows the current choice and reopens the banner to change it.
export function AnalyticsChoice() {
  const [choice, setChoice] = useState<Choice | "unknown">("unknown");
  useEffect(() => {
    const t = window.setTimeout(() => setChoice(read()), 0);
    const sync = () => window.setTimeout(() => setChoice(read()), 0);
    window.addEventListener("storage", sync);
    window.addEventListener("click", sync);
    return () => { window.clearTimeout(t); window.removeEventListener("storage", sync); window.removeEventListener("click", sync); };
  }, []);
  if (!site.analyticsId) return <p className="consent-state">Google Analytics is not in use on this site at the moment.</p>;
  return (
    <p className="consent-state">
      Your choice: <b>{choice === "granted" ? "Allowed" : choice === "denied" ? "Not allowed" : "Not chosen yet"}</b>{" "}
      <button type="button" className="link-btn" onClick={() => window.dispatchEvent(new Event(OPEN))}>Change</button>
    </p>
  );
}
