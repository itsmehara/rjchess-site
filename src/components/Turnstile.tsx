"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile — a free, privacy-friendly "are you human" check. In
// "interaction-only" mode it is invisible for almost everyone; a suspicious
// visitor sees a single tick box. The token goes with the enquiry and the Apps
// Script verifies it with Cloudflare before saving (apps-script/enquiry-to-sheet.gs).
type TS = {
  render: (el: HTMLElement, o: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TS; onTurnstileLoad?: () => void } }

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";
let loading: Promise<TS> | null = null;
function api(): Promise<TS> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return (loading ??= new Promise((resolve, reject) => {
    window.onTurnstileLoad = () => resolve(window.turnstile!);
    const s = document.createElement("script");
    s.src = SRC; s.async = true; s.defer = true;
    s.onerror = () => { loading = null; reject(new Error("turnstile load failed")); };
    document.head.appendChild(s);
  }));
}

/** Renders the check; reports a fresh token (or null when it expires / fails). Bump `resetKey` after each send. */
export function Turnstile({ siteKey, onToken, resetKey }: { siteKey: string; onToken: (t: string | null) => void; resetKey: number }) {
  const el = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const cb = useRef(onToken);
  useEffect(() => { cb.current = onToken; }, [onToken]);

  useEffect(() => {
    let gone = false;
    api().then((ts) => {
      if (gone || !el.current || id.current) return;
      id.current = ts.render(el.current, {
        sitekey: siteKey,
        theme: "dark",
        appearance: "interaction-only",
        action: "enquiry",
        callback: (t: string) => cb.current(t),
        "expired-callback": () => cb.current(null),
        "error-callback": () => cb.current(null),
      });
    }).catch(() => cb.current(null));
    return () => { gone = true; if (id.current && window.turnstile) window.turnstile.remove(id.current); id.current = null; };
  }, [siteKey]);

  // A token is single-use: after each send, get a new one.
  useEffect(() => {
    if (resetKey && id.current && window.turnstile) { cb.current(null); window.turnstile.reset(id.current); }
  }, [resetKey]);

  return <div className="ts-box" ref={el} />;
}
