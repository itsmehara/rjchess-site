// Chess events & results — the source directory. This is hand-curated and
// always shown, so the section stays useful even when the automated feeds
// (scripts/collect-events.mjs → events.generated.json) are stale or failing.
// No logos: every organisation is named in text only — no endorsement implied.

export type Region = "ap" | "ts" | "india" | "intl" | "usa";

export const regions: { id: Region; label: string; short: string }[] = [
  { id: "ap", label: "Andhra Pradesh", short: "AP" },
  { id: "ts", label: "Telangana", short: "TS" },
  { id: "india", label: "All India", short: "India" },
  { id: "intl", label: "International", short: "World" },
  { id: "usa", label: "United States", short: "USA" },
];

export type SourceLink = { label: "Visit Website" | "Browse Events" | "View Calendar" | "View Results" | "Read News"; href: string };

export type Source = {
  id: string;
  name: string;
  region: Region;
  blurb: string;
  links: SourceLink[];
  // Which automated feed (key in events.generated.json) this source powers, if any.
  feed?: "ap" | "aicf" | "ts" | "fide";
};

export const sources: Source[] = [
  {
    id: "apca", name: "Andhra Chess Association", region: "ap", feed: "ap",
    blurb: "State body for Andhra Pradesh — state and district tournaments, prospectuses, online registration and results.",
    links: [{ label: "Browse Events", href: "https://apchess.org/all-events/all" }, { label: "Visit Website", href: "https://apchess.org/" }],
  },
  {
    id: "tsca", name: "Telangana State Chess Association", region: "ts", feed: "ts",
    blurb: "State and district championships across Telangana, with dates, venues and announcements.",
    links: [{ label: "Browse Events", href: "https://www.chesstelangana.com/events/" }, { label: "View Calendar", href: "https://www.chesstelangana.com/calendar/" }, { label: "Visit Website", href: "https://www.chesstelangana.com/" }],
  },
  {
    id: "aicf", name: "All India Chess Federation", region: "india", feed: "aicf",
    blurb: "National and FIDE-rated tournaments across India — dates, places and brochures.",
    links: [{ label: "Browse Events", href: "https://aicf.in/all-events/" }, { label: "Visit Website", href: "https://aicf.in/" }],
  },
  {
    id: "fide", name: "FIDE — International Chess Federation", region: "intl", feed: "fide",
    blurb: "World governing body: the international calendar, championships and official results coverage.",
    links: [{ label: "View Calendar", href: "https://calendar.fide.com/" }, { label: "Read News", href: "https://www.fide.com/news" }, { label: "Visit Website", href: "https://www.fide.com/" }],
  },
  {
    id: "worldchess", name: "World Chess", region: "intl",
    blurb: "Independent organiser and publisher (separate from FIDE) — tournament coverage and result summaries.",
    links: [{ label: "Read News", href: "https://worldchess.com/news" }, { label: "Visit Website", href: "https://worldchess.com/" }],
  },
  {
    id: "uschess", name: "US Chess Federation", region: "usa",
    blurb: "National body in the United States — upcoming tournaments and national event information.",
    links: [{ label: "Browse Events", href: "https://new.uschess.org/upcoming-tournaments" }, { label: "Visit Website", href: "https://new.uschess.org/play-chess" }],
  },
  {
    id: "chessresults", name: "Chess-Results", region: "intl",
    blurb: "The tournament results database organisers publish to — pairings, standings and round-by-round scores for events worldwide, including India.",
    links: [{ label: "View Results", href: "https://chess-results.com/" }],
  },
];
