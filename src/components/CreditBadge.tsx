"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    nscCreditBadge?: { mount: (el: HTMLElement | null) => void };
  }
}

/**
 * Nischaya Creative Soft credit badge (lotus circle, popup on hover/tap), from the
 * nischaya-credit-badge skill. The script self-mounts every `[data-nsc-credit]` slot on
 * first load; the effect covers a footer that mounts later (client navigation, e.g. the
 * logo on Privacy → Home). Mounting is idempotent.
 */
export function CreditBadge() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => window.nscCreditBadge?.mount(ref.current), []);
  return (
    <>
      <div ref={ref} className="footer-credit" data-nsc-credit />
      <Script src="/nsc-credit-badge.js" strategy="afterInteractive" />
    </>
  );
}
