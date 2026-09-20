// Collects chess event/result facts from the sources that permit lightweight
// automated access, and writes src/content/events.generated.json for the
// Events section. Zero dependencies — Node 18+ (global fetch).
//
//   node scripts/collect-events.mjs          # refresh every source
//   npm run events:refresh                   # same
//
// Rules this script follows (see src/content/events.ts for the source list):
// - Facts only: name, dates, place, and the source's own URLs. No article text,
//   images or PDFs are copied — visitors are sent to the source.
// - One source failing never affects another; the previous good data for that
//   source is kept and marked with its old checkedAt so the site can flag it.
// - Every URL is validated (https, on the source's own host) before it is kept.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../src/content/events.generated.json");
const UA = "RJChessAcademy-events/1.0 (+https://rjchess.com; daily check of public event listings)";
const TIMEOUT = 45_000; // apchess.org's completed-events call is slow

// ---------- helpers ----------
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#8211": "–", "#8217": "’", "#8216": "‘", "#038": "&", "#8220": "“", "#8221": "”" };
const decode = (s) => s.replace(/&(#?\w+);/g, (m, e) => ENT[e] ?? (e[0] === "#" ? String.fromCodePoint(parseInt(e.slice(1), 10)) : m));
const text = (s) => decode(String(s ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const cap = (s, n = 160) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const href = (s) => (String(s).match(/href=["']([^"']+)["']/) || [])[1];
const iso = (d) => (d instanceof Date && !isNaN(d) ? d.toISOString().slice(0, 10) : undefined);
const MONTHS = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
// "September 27, 2026" | "27-09-2026" | "2026-09-27" -> "2026-09-27"
function parseDate(s) {
  s = text(s);
  let m;
  if ((m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/))) return iso(new Date(Date.UTC(+m[3], MONTHS[m[1].toLowerCase()], +m[2])));
  if ((m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/))) return iso(new Date(Date.UTC(+m[3], +m[2] - 1, +m[1])));
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return m[0].slice(0, 10);
  return undefined;
}
function okUrl(u, host) {
  try { const x = new URL(u); return x.protocol === "https:" && x.hostname.endsWith(host) ? x.href : undefined; } catch { return undefined; }
}
async function get(url, init = {}) {
  const r = await fetch(url, { ...init, headers: { "user-agent": UA, ...(init.headers || {}) }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
}
const dedupe = (items) => {
  const seen = new Set();
  return items.filter((e) => { const k = (e.name.toLowerCase().replace(/[^a-z0-9]+/g, "") + "|" + (e.start || "")); if (seen.has(k)) return false; seen.add(k); return true; });
};

// ---------- sources ----------
const collectors = {
  // Andhra Chess Association — the DataTables JSON the public events page loads.
  async ap(prevItems) {
    const host = "apchess.org";
    const rows = async (path, n) => JSON.parse(await get(`https://apchess.org/${path}`, {
      method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "x-requested-with": "XMLHttpRequest" },
      body: `draw=1&start=0&length=${n}`,
    })).data;
    // Upcoming: [date, prospectus, name(+event link), _, register, ...]
    const up = (await rows("all-events-datatable-ajax/all", 100)).map((r) => ({
      name: cap(text(r[2])), start: parseDate(r[0]), url: okUrl(href(r[2]), host),
      brochure: okUrl(href(r[1]), host), register: okUrl(href(r[4]), host), completed: false,
    }));
    // Completed: [date, name(+event link), ...] — the endpoint ignores ordering,
    // so take everything and keep the newest few with a real date.
    let done = [];
    try {
      done = (await rows("all-events-completed-datatable-ajax/all", 1000))
        .map((r) => ({ name: cap(text(r[1])), start: parseDate(r[0]), url: okUrl(href(r[1]), host), completed: true }))
        .filter((e) => e.start && e.start > "2000").sort((a, b) => (a.start < b.start ? 1 : -1)).slice(0, 12);
    } catch (e) {
      // Keep last run's completed list rather than dropping the results view.
      done = (prevItems || []).filter((e) => e.completed);
      console.log(`ap completed list skipped (${e.message}) — kept ${done.length} previous`);
    }
    return dedupe([...up, ...done].filter((e) => e.name && e.url));
  },

  // All India Chess Federation — the public "All Events" table.
  async aicf() {
    const html = await get("https://aicf.in/all-events/");
    const out = [];
    for (const tr of html.match(/<tr[\s\S]*?<\/tr>/g) || []) {
      const td = (tr.match(/<td[\s\S]*?<\/td>/g) || []);
      if (td.length < 5) continue;
      const [name, code, start, end, place, brochure] = td;
      const e = { name: cap(text(name)), code: text(code), start: parseDate(start), end: parseDate(end), place: cap(text(place), 60),
        brochure: okUrl(href(brochure || ""), "aicf.in"), url: "https://aicf.in/all-events/" };
      if (e.name && e.start) out.push(e);
    }
    // The table lists the whole year; keep what is upcoming or ended recently.
    const cutoff = iso(new Date(Date.now() - 45 * 864e5));
    return dedupe(out.filter((e) => (e.end || e.start) >= cutoff));
  },

  // Telangana State Chess Association — WordPress "event" posts (title + link
  // + published date; the dates of the event itself are only in the prose).
  async ts() {
    const list = JSON.parse(await get("https://www.chesstelangana.com/wp-json/wp/v2/event?per_page=20&_fields=title,link,date"));
    return list.map((p) => ({ name: cap(text(p.title?.rendered)), url: okUrl(p.link, "chesstelangana.com"), published: parseDate(p.date) }))
      .filter((e) => e.name && e.url);
  },

  // FIDE — official news RSS (results coverage, announcements).
  async fide() {
    const xml = await get("https://www.fide.com/rss");
    return (xml.match(/<item>[\s\S]*?<\/item>/g) || []).slice(0, 12).map((it) => {
      const tag = (t) => text((it.match(new RegExp(`<${t}>([\\s\\S]*?)</${t}>`)) || [])[1]?.replace(/^<!\[CDATA\[|\]\]>$/g, ""));
      const d = new Date(tag("pubDate"));
      return { name: cap(tag("title")), url: okUrl(tag("link"), "fide.com"), published: iso(d) };
    }).filter((e) => e.name && e.url);
  },
};

// ---------- validation ----------
// A source can change its page layout without failing outright — columns
// shift, names become numbers, dates land in the wrong field. Every row is
// checked before it is kept, and a sudden collapse in row count is treated
// as a failure (previous data kept) rather than published.
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const isHttps = (u) => typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u);
function validRow(e) {
  if (typeof e.name !== "string") return false;
  const name = e.name.trim();
  if (name.length < 4 || name.length > 200 || /^[\d\s.,-]+$/.test(name)) return false; // empty, absurd, or just a number
  if (!isHttps(e.url)) return false;
  for (const k of ["start", "end", "published"]) if (e[k] !== undefined && !DATE.test(e[k])) return false;
  if (e.start && e.end && e.end < e.start) delete e.end; // swapped columns — keep the start only
  for (const k of ["register", "brochure", "results"]) if (e[k] !== undefined && !isHttps(e[k])) delete e[k];
  for (const k of ["place", "code"]) if (e[k] !== undefined && typeof e[k] !== "string") delete e[k];
  return true;
}
function validate(id, items, prevCount) {
  const good = items.filter(validRow);
  const dropped = items.length - good.length;
  if (dropped) console.log(`${id}: dropped ${dropped} malformed row(s)`);
  if (!good.length) throw new Error("no valid rows");
  if (dropped > good.length) throw new Error(`most rows malformed (${dropped}/${items.length}) — layout probably changed`);
  if (prevCount >= 10 && good.length < prevCount * 0.4) throw new Error(`row count collapsed ${prevCount} → ${good.length} — layout probably changed`);
  return good;
}

// ---------- run ----------
let prev = {};
try { prev = JSON.parse(readFileSync(OUT, "utf8")).sources || {}; } catch {}
const now = new Date().toISOString();
const sources = {};
for (const [id, fn] of Object.entries(collectors)) {
  try {
    const raw = await fn(prev[id]?.items);
    if (!raw.length) throw new Error("no items parsed — page structure may have changed");
    const items = validate(id, raw, prev[id]?.items?.length ?? 0);
    sources[id] = { checkedAt: now, ok: true, items };
    console.log(`${id}: ${items.length} items`);
  } catch (e) {
    const old = prev[id];
    sources[id] = { ...(old || { items: [] }), ok: false, error: String(e.message || e), failedAt: now };
    console.log(`${id}: FAILED (${e.message}) — kept ${old?.items?.length ?? 0} previous items`);
  }
}
const out = { generatedAt: now, sources };
JSON.parse(JSON.stringify(out)); // round-trip: the file must be readable before it is written
writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
console.log("wrote", OUT);
// Non-zero exit when every source failed, so CI never commits a run that did nothing.
if (Object.values(sources).every((s) => !s.ok)) { console.error("all sources failed"); process.exit(1); }
