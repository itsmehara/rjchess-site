import Link from "next/link";
import { site, waLink } from "@/content/site";
import { NavMenu } from "./NavMenu";
import "./hero.css";

// Shared frame for the standalone pages (Play, Co-trainers): the same wordmark
// and menu as the main site, with hash links pointing back to the home page.
export function Subpage({ current, children }: { current: string; children: React.ReactNode }) {
  return (
    <>
      <header className="nav is-stuck subnav">
        <Link className="wordmark" href="/">
          <span className="mark" aria-hidden="true">&#9812;</span>
          <span className="wordmark-text">
            <b>{site.brand}</b>
          </span>
        </Link>
        <NavMenu active={current} base="/" />
        <div className="nav-actions">
          <a className="wa-btn" href={waLink()} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </header>
      <main className="subpage">{children}</main>
    </>
  );
}
