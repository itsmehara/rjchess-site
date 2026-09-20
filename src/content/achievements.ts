// Achievements. Add new entries at the top of the relevant list; the site
// renders them in the order written. Source: client's text (2026-09-19) cross-
// checked against the trophy inscriptions in his photos — where the two
// disagree, the inscription wins and the note says so. Trophy images live in
// awards.ts.
export type Achievement = {
  year: string;
  title: string;
  detail?: string;
};

export const corporate: Achievement[] = [
  {
    year: "2025",
    title: "Champion — TCS Adibatla Chess Championship",
  },
  {
    year: "2025",
    title: "3rd place — SLAN Corporate Sports Meet, Season 1",
  },
  {
    year: "2024",
    title: "Champion — TCS Adibatla Chess Championship",
  },
  {
    year: "2024",
    title: "Runner-up — TCS Hyderabad Maitree Grandmaster Hunt",
    detail: "Men's section, Adibatla",
  },
  { year: "2024", title: "3rd place — SLAN 2024" },
  { year: "2023", title: "Champion — TCS Adibatla Chess Championship" },
];

export const university: Achievement[] = [
  {
    year: "2018",
    title: "2nd place — Inter-University Chess Championship",
    detail: "Selected for the South Zone Chess Championship",
  },
  {
    year: "2017–18",
    title: "Winners — Krishna University Inter-Collegiate Chess Tournament",
    detail: "Team event",
  },
  {
    year: "2017–18",
    title: "Winners — Siddhartha Inter-Institute Games & Sports",
  },
  {
    year: "2017",
    title: "2nd place — Inter-University Chess Championship",
    detail: "Selected for the South Zone Chess Championship",
  },
  {
    year: "2015",
    title: "2nd place — Inter-University Chess Championship",
    detail: "Selected for the South Zone Chess Championship",
  },
];

export const coaching = {
  summary:
    "More than 300 students trained so far. Several have gone on to earn FIDE ratings — the highest at 1670 — and many have won district and state championships. A number of students in the US have also earned USCF ratings.",
};
