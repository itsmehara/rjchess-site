import { site, nav } from "@/content/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <b>{site.name}</b>
        <ul>
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
        <span>© {new Date().getFullYear()} {site.name} · {site.coach}</span>
      </div>
    </footer>
  );
}
