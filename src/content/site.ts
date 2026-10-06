// Site-wide facts. Everything here is public on the live site.
export const site = {
  brand: "RJChess",
  name: "RJChess",
  coach: "Jagadeesh Babu",
  tagline: "Every master was once a beginner.",
  description:
    "Personal chess coaching by Jagadeesh Babu — FIDE-rated player, 10+ years of teaching, 300+ students trained. Online and in-person, from first moves to tournament play.",
  whatsappNumber: "918187092749",
  whatsappDisplay: "+91 81870 92749",
  email: "rjchesslearnings@gmail.com",
  // Set to the deployed Google Apps Script web-app URL (ends in /exec) to have
  // enquiries land in the client's Google Sheet. Left empty, the enquiry form
  // opens WhatsApp with the message pre-filled instead.
  enquiryEndpoint: process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "",
  // Google Analytics 4 measurement ID (G-…). Empty = no analytics and no consent banner.
  analyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "",
};

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}` + (text ? `?text=${encodeURIComponent(text)}` : "");

export type NavItem = { href: string; label: string; menu?: { href: string; label: string }[] };

// Menu. "Events & more" groups the special cases: Events is a section of the
// page; Play and Co-trainers are their own pages (both "coming soon").
export const nav: NavItem[] = [
  { href: "#about", label: "About" },
  { href: "#achievements", label: "Achievements" },
  { href: "#students", label: "Students" },
  { href: "#syllabus", label: "Syllabus" },
  {
    href: "#events",
    label: "Events & more",
    menu: [
      { href: "#events", label: "Events & results" },
      { href: "/play/", label: "Play a friend" },
      { href: "/co-trainers/", label: "Co-trainers" },
    ],
  },
  { href: "#contact", label: "Contact" },
];

/** Every link, flattened — for the footer and the scroll-spy. */
export const navLinks = nav.flatMap((n) => (n.menu ? n.menu : [n]));
