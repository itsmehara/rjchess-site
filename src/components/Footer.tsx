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
        {/* Bottom line: small print on the left (pipe-separated; stacked on phones), credit badge on the right */}
        <div className="footer-legal">
          <ul className="footer-meta">
            <li className="footer-copy">
              <span className="mark" aria-hidden="true">&#9812;</span>
              <span>© {new Date().getFullYear()} {site.name} · {site.coach}. All rights reserved.</span>
            </li>
            <li>
              <a className="footer-mail" href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <VisitCounter />
          </ul>
          {/* Nischaya Creative Soft credit badge — filled by /nsc-credit-badge.js */}
          <div className="footer-credit" data-nsc-credit />
        </div>
      </div>
      <Script src="/nsc-credit-badge.js" strategy="afterInteractive" />
    </footer>
  );
}
