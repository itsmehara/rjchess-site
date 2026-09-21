"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";

// The menu list used by the hero nav and the standalone pages. A group item
// ("Events & more") is a dropdown on wide screens and flat links in the phone
// strip, where a floating panel would be clipped by the strip's scrolling.
export function NavMenu({ active, onPick, base = "" }: { active: string; onPick?: (href: string) => void; base?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const href = (h: string) => (h.startsWith("#") ? `${base}${h}` : h);
  const link = (h: string, label: string, cls?: string) =>
    h.startsWith("#") ? (
      <a href={href(h)} className={cls} onClick={() => { onPick?.(h); setOpen(null); }}>{label}</a>
    ) : (
      <Link href={h} className={cls}>{label}</Link>
    );

  return (
    <ul className="menu" ref={ref}>
      {nav.map((n) =>
        n.menu ? (
          <li key={n.href} className={open === n.href ? "has-menu is-open" : "has-menu"}>
            <button
              type="button"
              className={n.menu.some((m) => m.href === active) ? "is-active" : undefined}
              aria-haspopup="true"
              aria-expanded={open === n.href}
              onClick={() => setOpen(open === n.href ? null : n.href)}
            >
              {n.label} <i aria-hidden="true">▾</i>
            </button>
            <ul className="submenu">
              {n.menu.map((m) => (
                <li key={m.href}>{link(m.href, m.label, active === m.href ? "is-active" : undefined)}</li>
              ))}
            </ul>
            {/* Phone strip: the same links, flat. */}
            {n.menu.map((m) => (
              <span key={"flat" + m.href} className="flat">{link(m.href, m.label, active === m.href ? "is-active" : undefined)}</span>
            ))}
          </li>
        ) : (
          <li key={n.href}>{link(n.href, n.label, active === n.href ? "is-active" : undefined)}</li>
        ),
      )}
    </ul>
  );
}
