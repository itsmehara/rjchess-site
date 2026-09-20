// Achievements. Add new entries at the top of the relevant list; the site
// renders them in the order written. Source: client's text (2026-09-19) cross-
// checked against the trophy inscriptions in his photos — where the two
// disagree, the inscription wins and the note says so.
export type Achievement = {
  year: string;
  title: string;
  detail?: string;
  photos?: { src: string; alt: string; wide?: boolean }[];
};

export const corporate: Achievement[] = [
  {
    year: "2025",
    title: "Champion — TCS Adibatla Chess Championship",
    photos: [{ src: "/photos/tcs-adibatla-2025-winner.jpg", alt: "TCS Adibatla Chess Championship 2025 — winner's trophy" }],
  },
  {
    year: "2025",
    title: "3rd place — SLAN Corporate Sports Meet, Season 1",
    photos: [{ src: "/photos/slan-corporate-sports-meet-s1-3rd.jpg", alt: "SLAN Corporate Sports Meet Season 1 — 3rd prize trophy" }],
  },
  {
    year: "2024",
    title: "Champion — TCS Adibatla Chess Championship",
    photos: [
      { src: "/photos/tcs-adibatla-2024-winner-gold.jpg", alt: "TCS Adibatla Chess Championship 2024 — winner's trophy" },
    ],
  },
  {
    year: "2024",
    title: "Runner-up — TCS Hyderabad Maitree Grandmaster Hunt",
    detail: "Men's section, Adibatla",
    photos: [
      { src: "/photos/tcs-maitree-2024-trophy.jpg", alt: "TCS Maitree Grandmaster Hunt 2024 — runner-up trophy" },
      { src: "/photos/tcs-maitree-2024-plaque.jpg", alt: "TCS Hyderabad Maitree Chess Championship 2024 — plaque" },
    ],
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
    photos: [{ src: "/photos/krishna-university-2017-18-team.jpg", alt: "Krishna University Inter-Collegiate Chess Tournament 2017–18 — the winning team on stage", wide: true }],
  },
  {
    year: "2017–18",
    title: "Winners — Siddhartha Inter-Institute Games & Sports",
    photos: [{ src: "/photos/siddhartha-2017-18-winners.jpg", alt: "Siddhartha Inter-Institute Games & Sports 2017–18 — winners' trophy" }],
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
