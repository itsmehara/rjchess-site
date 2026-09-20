"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { regions, sources, type Region } from "@/content/events";
import feed from "@/content/events.generated.json";

type View = "upcoming" | "results" | "sources";
type Item = {
  key: string;
  region: Region;
  source: string;
  name: string;
  start?: string;
  end?: string;
  place?: string;
  published?: string;
  url: string;
  register?: string;
  brochure?: string;
  kind: "event" | "announcement" | "news";
  completed?: boolean;
};

type Feed = typeof feed;
type FeedSource = Feed["sources"][keyof Feed["sources"]];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-09-27" → "27 Sep 2026" (date-only, so no time-zone shifting)
const fmt = (d?: string) => (d ? `${+d.slice(8, 10)} ${MONTHS[+d.slice(5, 7) - 1]} ${d.slice(0, 4)}` : "");
const range = (a?: string, b?: string) => (!b || b === a ? fmt(a) : `${fmt(a)} – ${fmt(b)}`);
const STALE_DAYS = 3;

function todayIST() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function status(it: Item, today: string): "upcoming" | "ongoing" | "completed" {
  if (it.completed) return "completed";
  if (!it.start) return "upcoming";
  if (it.start > today) return "upcoming";
  if ((it.end || it.start) >= today) return "ongoing";
  return "completed";
}

// Flatten the collector's per-source lists into one shape.
function items(data: Feed): Item[] {
  const s = data.sources as Record<string, FeedSource & { items: Record<string, unknown>[] }>;
  const out: Item[] = [];
  const push = (region: Region, source: string, kind: Item["kind"], list: Record<string, unknown>[] = []) =>
    list.forEach((e, i) => {
      // Skip anything a stale or hand-edited file could contain that the collector would have rejected.
      if (typeof e.name !== "string" || typeof e.url !== "string" || !e.url.startsWith("https://")) return;
      out.push({ key: `${source}-${i}`, region, source, kind, ...(e as Omit<Item, "key" | "region" | "source" | "kind">) });
    });
  push("ap", "Andhra Chess Association", "event", s.ap?.items);
  push("india", "All India Chess Federation", "event", s.aicf?.items);
  push("ts", "Telangana State Chess Association", "announcement", s.ts?.items);
  push("intl", "FIDE", "news", s.fide?.items);
  return out;
}

const SMALL = new Set(["of", "and", "the", "for", "in", "on", "to", "a", "an", "&"]);
// Organisers often publish names in capitals; make them readable, keep acronyms.
function title(name: string) {
  name = name.replace(/(\d+)\s+(st|nd|rd|th)\b/gi, "$1$2"); // "9 th" → "9th"
  const letters = name.replace(/[^a-z]/gi, "");
  const upper = letters.replace(/[^A-Z]/g, "").length;
  if (letters.length < 8 || upper / letters.length < 0.7) return name;
  return name.toLowerCase().replace(/[a-z0-9]+(?:[’'][a-z]+)?/g, (w, i) =>
    (i && SMALL.has(w)) ? w : /^(fide|ap|tcs|u\d+|\d+(st|nd|rd|th))$/.test(w) ? (w.startsWith("u") ? w.toUpperCase() : w.replace(/^(\d+)(st|nd|rd|th)$/, "$1$2").toUpperCase()) : w[0].toUpperCase() + w.slice(1),
  ).replace(/\b(\d+)(ST|ND|RD|TH)\b/g, (m, n, sfx) => n + sfx.toLowerCase());
}
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const CAP = 60; // rows per region tab — the official site has the rest
// Optional live feed: a URL serving JSON in the same shape as
// events.generated.json (e.g. a small worker that runs the collector and caches
// it). When set, the widget refreshes from it on load; the bundled snapshot is
// the fallback and the server-rendered HTML.
const LIVE_URL = process.env.NEXT_PUBLIC_EVENTS_FEED_URL ?? "";

// Only trust a live payload that looks like the collector's output.
function sane(j: unknown): j is Feed {
  if (!j || typeof j !== "object") return false;
  const f = j as Partial<Feed>;
  if (typeof f.generatedAt !== "string" || !f.sources || typeof f.sources !== "object") return false;
  return Object.values(f.sources).every(
    (s) => s && typeof s === "object" && Array.isArray((s as FeedSource).items) && typeof (s as FeedSource).checkedAt === "string",
  );
}

const LABEL = { upcoming: "Upcoming", results: "Results & news", sources: "Official sources" } as const;
const tag = (st: string) => (st === "news" ? "News" : st === "announcement" ? "Notice" : st[0].toUpperCase() + st.slice(1));

export function Events() {
  const [view, setView] = useState<View>("upcoming");
  const [region, setRegion] = useState<Region>("ap");
  const [data, setData] = useState<Feed>(feed);
  const [live, setLive] = useState(false);
  const today = useSyncExternalStore(() => () => {}, todayIST, () => feed.generatedAt.slice(0, 10));

  useEffect(() => {
    if (!LIVE_URL) return;
    const ctl = new AbortController();
    fetch(LIVE_URL, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: Feed) => { if (sane(j)) { setData(j); setLive(true); } })
      .catch(() => {});
    return () => ctl.abort();
  }, []);

  const all = useMemo(() => items(data), [data]);
  const cutoff = new Date(Date.parse(today) - 60 * 864e5).toISOString().slice(0, 10);

  // Per-region lists for the current view (counts feed the tabs).
  const byRegion = useMemo(() => {
    const m = {} as Record<Region, Item[]>;
    for (const r of regions) {
      const mine = all.filter((it) => it.region === r.id);
      if (view === "upcoming") {
        const dated = mine.filter((it) => it.kind === "event" && status(it, today) !== "completed").sort((a, b) => a.start!.localeCompare(b.start!));
        const posts = mine.filter((it) => it.kind === "announcement" && (it.published || "") >= cutoff).sort((a, b) => (b.published || "").localeCompare(a.published || ""));
        m[r.id] = [...dated, ...posts].slice(0, CAP);
      } else {
        m[r.id] = mine
          .filter((it) => it.kind === "news" || (it.kind === "event" && status(it, today) === "completed"))
          .sort((a, b) => (b.start || b.published || "").localeCompare(a.start || a.published || ""))
          .slice(0, CAP);
      }
    }
    return m;
  }, [all, view, today, cutoff]);

  const list = byRegion[region];
  const dir = sources.filter((s) => s.region === region);
  const feeds = Object.entries(data.sources) as [string, FeedSource][];
  const stale = feeds.some(([, f]) => !f.ok || Date.parse(today) - Date.parse(f.checkedAt) > STALE_DAYS * 864e5);
  const checked = feeds.map(([, f]) => f.checkedAt).sort().at(-1) || data.generatedAt;
  const regionLabel = regions.find((r) => r.id === region)?.label;

  return (
    <section className="section" id="events">
      <div className="wrap">
        <p className="eyebrow">Chess events &amp; results</p>
        <h2>
          Where to <em>play next</em>, and how it went.
        </h2>
        <p className="lede">
          Tournaments and results from the official chess bodies, region by region. Pick a region — every entry links to the organiser&apos;s own
          page for the prospectus, registration and results.
        </p>

        <div className="evw" role="region" aria-label="Chess events and results">
          <div className="evw-head">
            <div className="ev-tabs" role="tablist" aria-label="View">
              {(Object.keys(LABEL) as View[]).map((v) => (
                <button key={v} type="button" role="tab" aria-selected={view === v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
                  {LABEL[v]}
                </button>
              ))}
            </div>
            <p className="evw-checked">
              {live ? "Live · " : ""}Checked {fmt(checked.slice(0, 10))}
              {stale ? " · may be out of date" : ""}
            </p>
          </div>

          <div className="evw-body">
            <div className="ev-regions" role="tablist" aria-label="Region" aria-orientation="vertical">
              {regions.map((r) => {
                const n = view === "sources" ? sources.filter((s) => s.region === r.id).length : byRegion[r.id].length;
                return (
                  <button key={r.id} type="button" role="tab" aria-selected={region === r.id} className={region === r.id ? "on" : ""} onClick={() => setRegion(r.id)}>
                    <span>{r.label}</span>
                    <b aria-label={`${n} ${view === "sources" ? "sources" : "entries"}`}>{n}</b>
                  </button>
                );
              })}
            </div>

            <div className="evw-pane" role="tabpanel" aria-label={`${LABEL[view]} — ${regionLabel}`} tabIndex={0}>
              {view === "sources" ? (
                <ol className="ev-srcs">
                  {dir.map((s) => (
                    <li key={s.id}>
                      <p className="ev-title">
                        <span className="ev-icon" aria-hidden="true">♞</span> {s.name}
                        {s.feed && <span className="ev-tag auto">Auto-updated</span>}
                      </p>
                      <p className="ev-blurb">{s.blurb}</p>
                      <p className="ev-links">
                        {s.links.map((l) => (
                          <a key={l.href} href={l.href} {...ext} aria-label={`${l.label}: ${s.name} (opens in new tab)`}>{l.label} <i>↗</i></a>
                        ))}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : list.length === 0 ? (
                <div className="ev-empty">
                  <p>
                    {dir.some((s) => s.feed)
                      ? `Nothing ${view === "upcoming" ? "upcoming" : "published"} for ${regionLabel} right now.`
                      : `${regionLabel} listings aren't collected automatically yet.`}{" "}
                    The official site has the latest:
                  </p>
                  <p className="ev-links">
                    {dir.flatMap((s) => s.links.slice(0, 1).map((l) => (
                      <a key={l.href} href={l.href} {...ext} aria-label={`${l.label}: ${s.name} (opens in new tab)`}>{s.name} <i>↗</i></a>
                    )))}
                  </p>
                </div>
              ) : (
                <ol className="ev-rows">
                  {list.map((it) => {
                    const st = it.kind === "event" ? status(it, today) : it.kind;
                    const d = it.start || it.published;
                    return (
                      <li key={it.key} className={`ev-row is-${st}`}>
                        <div className="ev-date" aria-hidden="true">
                          {d ? (
                            <>
                              <span className="day">{+d.slice(8, 10)}{it.end && it.end !== it.start ? `–${+it.end.slice(8, 10)}` : ""}</span>
                              <span className="mon">{MONTHS[+d.slice(5, 7) - 1]}</span>
                            </>
                          ) : (
                            <span className="mon">TBA</span>
                          )}
                        </div>
                        <div className="ev-body">
                          <p className="ev-title">
                            <a href={it.url} {...ext} aria-label={`${it.name} — ${it.source} (opens in new tab)`}>{title(it.name)}</a>
                          </p>
                          <p className="ev-sub">
                            <span className="sr-only">{d ? (it.kind === "event" ? range(it.start, it.end) : `Published ${fmt(d)}`) + ". " : ""}</span>
                            {st !== (view === "upcoming" ? "upcoming" : "completed") && <span className={`ev-tag ${st}`}>{tag(st)}</span>}
                            {it.place && <span>{it.place}</span>}
                            {it.kind === "announcement" && <span>Posted {fmt(it.published)}</span>}
                            {it.kind === "news" && <span>{fmt(it.published)}</span>}
                            <span>{it.source}</span>
                          </p>
                        </div>
                        <p className="ev-links">
                          {it.register && st !== "completed" && (
                            <a href={it.register} {...ext} aria-label={`Register for ${it.name} on the official site (opens in new tab)`}>Register <i>↗</i></a>
                          )}
                          {it.brochure && (
                            <a href={it.brochure} {...ext} aria-label={`Prospectus for ${it.name} (PDF, opens in new tab)`}>Prospectus <i>PDF</i></a>
                          )}
                          <a href={it.url} {...ext} aria-label={`${it.kind === "news" ? "Read" : "Official page for"} ${it.name} (opens in new tab)`}>
                            {it.kind === "news" ? "Read" : "Official page"} <i>↗</i>
                          </a>
                        </p>
                      </li>
                    );
                  })}
                  <li className="ev-tail">
                    {view === "results" ? "Standings are published by the organisers — nothing here is summarised by us. " : ""}
                    Full list on{" "}
                    {dir.filter((s) => s.feed).map((s, i) => (
                      <span key={s.id}>{i ? " and " : ""}<a href={s.links[0].href} {...ext}>{s.name} ↗</a></span>
                    ))}
                    .
                  </li>
                </ol>
              )}
            </div>
          </div>
        </div>
        <p className="ev-note">
          Event names, dates and links are shown as published by each organisation — nothing is copied beyond those facts, and no endorsement is implied.
        </p>
      </div>
    </section>
  );
}
