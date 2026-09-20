// Training levels and how a student is placed. Client's instruction
// (2026-09-20): five levels, no topic lists — the level is assigned per student
// from their current standing, and the detailed syllabus is explained to the
// student or parents directly. Formats come from the 2026-09-06 call.
export const syllabus = {
  summary:
    "Five levels, one path. Every student is placed by where they stand today — not by age or how long they have played — and moves up as their results show they are ready.",
  levels: [
    { name: "Beginner", stage: "Level 1", blurb: "The rules, the pieces and the first real games." },
    { name: "Beginner", stage: "Level 2", blurb: "Playing full games with a plan — basic tactics, checkmates and openings." },
    { name: "Intermediate", stage: "Level 1", blurb: "Regular play with results to improve in school and club events." },
    { name: "Intermediate", stage: "Level 2", blurb: "Structured preparation for rated tournaments and a first FIDE rating." },
    { name: "Advanced", stage: "", blurb: "Serious tournament play — pushing the rating and competing for titles." },
  ],
  // How placement works — shown as three steps beside the levels.
  placement: [
    {
      title: "Placement",
      text: "We start from the student's current level, not the calendar. After the first sessions the student is placed in one of the five levels, and the syllabus for that level is explained to the student or parents directly.",
    },
    {
      title: "Projection",
      text: "Within a couple of sessions I can share an approximate projection — where the student can realistically get to, and roughly how long that takes — so parents know what to expect.",
    },
    {
      title: "Commitment",
      text: "When the student and family stay interested and consistent, I take personal interest in the plan and its execution. Long-term wins for the student are the goal — that is what makes the coaching worthwhile for me too.",
    },
  ],
  formats: ["Online, on Lichess and Chess.com", "In person", "Group batches and one-to-one"],
};
