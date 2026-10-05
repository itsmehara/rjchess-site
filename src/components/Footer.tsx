import Script from "next/script";
import { site, navLinks } from "@/content/site";
import { VisitCounter } from "./VisitCounter";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <b>{site.name}</b>
        <ul>
          {navLinks.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
        <a className="footer-mail" href={`mailto:${site.email}`}>{site.email}</a>
        <div className="footer-legal">
          <p className="footer-copy">
            <span className="mark" aria-hidden="true">&#9812;</span>
            <span>© {new Date().getFullYear()} {site.name} · {site.coach}. All rights reserved.</span>
          </p>
          {/* Nischaya Creative Soft credit badge — filled by /nsc-credit-badge.js */}
          <div className="footer-credit" data-nsc-credit />
        </div>
        <VisitCounter />
      </div>
      <Script src="/nsc-credit-badge.js" strategy="afterInteractive" />
    </footer>
  );
}
