// Awards gallery — the 16 owner-selected trophy/plaque images (2026-09-20 set).
// Captions are taken from the inscriptions on the pieces themselves; where the
// inscription is sparse (e.g. "CHESS WINNER") the event is identified from the
// owner's own notes, not from the piece. Portraits and team photos are not
// awards and live elsewhere. Add new entries at the top of the relevant group.
export type Award = {
  src: string;
  alt: string;
  title: string;
  sub?: string;
  /** Optional transparent cutout — enables the full-screen trophy viewer. */
  cutout?: string;
};

export const awardGroups: { heading: string; items: Award[] }[] = [
  {
    heading: "Corporate",
    items: [
      {
        src: "/awards/tcs-adibatla-chess-winner-blue-2025.jpg",
        alt: "Blue and gold trophy inscribed TCS Adibatla Chess Championship 2025 — Winner",
        title: "TCS Adibatla Chess Championship 2025",
        sub: "Winner",
        cutout: "/awards/tcs-adibatla-chess-winner-blue-2025-cutout.webp",
      },
      {
        src: "/awards/corporate-sports-meet-third-prize.jpg",
        alt: "Gold trophy inscribed SLAN Corporate Sports Meet Season 1 — 3rd Prize",
        title: "SLAN Corporate Sports Meet, Season 1",
        sub: "3rd prize",
        cutout: "/awards/corporate-sports-meet-third-prize-cutout.webp",
      },
      {
        src: "/awards/tcs-adibatla-chess-winner-gold.jpg",
        alt: "Gold trophy with ribbons inscribed TCS Adibatla Chess Championship 2024 — Winner",
        title: "TCS Adibatla Chess Championship 2024",
        sub: "Winner",
        cutout: "/awards/tcs-adibatla-chess-winner-gold-2024-cutout.webp",
      },
      {
        src: "/awards/tcs-maitree-runner-up-trophy.jpg",
        alt: "Gold knight trophy inscribed TCS Hyderabad Maitree Grandmaster Hunt, The Chess Championship 2024 — Runner Up (Men), Adibatla",
        title: "TCS Hyderabad Maitree Grandmaster Hunt 2024",
        sub: "Runner-up (Men), Adibatla",
      },
      {
        src: "/awards/tcs-maitree-helping-hands.jpg",
        alt: "Wooden plaque inscribed TCS Maitree Helping Hands — TCS Hyderabad Maitree Grandmaster Hunt, The Chess Championship 2024",
        title: "TCS Hyderabad Maitree Grandmaster Hunt 2024",
        sub: "Helping Hands plaque",
      },
      {
        src: "/awards/tcs-adibatla-2023-chess-winner.jpg",
        alt: "Gold trophy inscribed Chess Winner — TCS Adibatla Chess Championship 2023",
        title: "TCS Adibatla Chess Championship 2023",
        sub: "Chess Winner",
        cutout: "/awards/tcs-adibatla-2023-chess-winner-cutout.webp",
      },
    ],
  },
  {
    heading: "District & open events",
    items: [
      {
        src: "/awards/krishna-district-rapid-blitz-2024.jpg",
        alt: "Plaque for the Krishna District Rapid & Blitz Championship 2024, 13 October 2024, Triveni School, Gudivada, organised by SRR Charitable Trust",
        title: "Krishna District Rapid & Blitz Championship 2024",
        sub: "Triveni School, Gudivada · SRR Charitable Trust",
        cutout: "/awards/krishna-district-rapid-blitz-2024-cutout.webp",
      },
      {
        src: "/awards/krishna-district-open-women-2024-green-school.jpg",
        alt: "Plaque for the Krishna District Open & Women Chess Championship 2024, 12 May 2024, Green School, Penamaluru",
        title: "Krishna District Open & Women Chess Championship 2024",
        sub: "Green School, Penamaluru",
        cutout: "/awards/krishna-district-open-women-2024-green-school-cutout.webp",
      },
      {
        src: "/awards/krishna-district-open-2024-green-school.jpg",
        alt: "Black king memento for the Krishna District Open Chess Tournament 2024, 24 March 2024, Green School, Poranki",
        title: "Krishna District Open Chess Tournament 2024",
        sub: "Green School, Poranki",
        cutout: "/awards/krishna-district-open-2024-green-school-cutout.webp",
      },
      {
        src: "/awards/krishna-district-under-25-chess-2019-first-prize-vuyyuru-player.jpg",
        alt: "Star trophy inscribed Krishna District Under-25 Chess Tournament 2019 — 1st Prize, Vuyyuru Player, organised by Krishna District Chess Association",
        title: "Krishna District Under-25 Chess Tournament 2019",
        sub: "1st prize · Vuyyuru player",
      },
      {
        src: "/awards/krishna-district-under-25-chess-chief-guest-2019.jpg",
        alt: "Plaque inscribed Krishna District Under-25 Chess Tournament 2019 — Chief Guest, A.G. & S.G. Siddhartha College, Vuyyuru, 16 June 2019",
        title: "Krishna District Under-25 Chess Tournament 2019",
        sub: "Chief guest · Vuyyuru",
      },
    ],
  },
  {
    heading: "University & college",
    items: [
      {
        src: "/awards/kruic-chess-men-women-2017-18-runner-men.jpg",
        alt: "Trophy inscribed KRUIC Chess (Men & Women) Tournament 2017–18 — Runner (Men), organised by K.B.N. College, Vijayawada",
        title: "KRUIC Chess Tournament 2017–18",
        sub: "Runner-up (Men) · K.B.N. College",
      },
      {
        src: "/awards/siddhartha-inter-institutional-games-sports-2017-18-winners.jpg",
        alt: "Gold cup inscribed Siddhartha Inter Institutional Games & Sports 2017–18 — Winners",
        title: "Siddhartha Inter-Institutional Games & Sports 2017–18",
        sub: "Winners",
      },
      {
        src: "/awards/siddhartha-kuic-chess-tournament-2016.jpg",
        alt: "Star plaque for the KUIC Chess Tournament, 8–10 September 2016, Vijayawada, hosted by Siddhartha Institute of Hotel Management & Catering Technology",
        title: "KUIC Chess Tournament 2016",
        sub: "Siddhartha Institute of Hotel Management, Vijayawada",
      },
      {
        src: "/awards/nalanda-kruic-chess-2015-16.jpg",
        alt: "Trophy inscribed KRUIC Chess (Men) Tournament 2015–16, organised by Nalanda Degree College, Vijayawada",
        title: "KRUIC Chess (Men) Tournament 2015–16",
        sub: "Nalanda Degree College",
      },
      {
        src: "/awards/ag-sg-siddhartha-degree-college-men-second-place.jpg",
        alt: "Shield plaque inscribed Men 2nd Place, organised by A.G. & S.G. Siddhartha Degree College",
        title: "A.G. & S.G. Siddhartha Degree College",
        sub: "Men · 2nd place",
        cutout: "/awards/ag-sg-siddhartha-degree-college-men-second-place-cutout.webp",
      },
    ],
  },
];

export const teamPhoto = {
  src: "/photos/krishna-university-2017-18-team.jpg",
  alt: "Krishna University Inter-Collegiate Chess Tournament 2017–18 — the winning team on stage",
  caption: "2017–18 — Krishna University Inter-Collegiate Chess Tournament, winning team",
};
