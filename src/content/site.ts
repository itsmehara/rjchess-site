// Site-wide facts. Everything here is public on the live site.
export const site = {
  brand: "RJChess",
  brandSuffix: "Academy",
  name: "RJChess Academy",
  coach: "Jagadeesh Babu",
  tagline: "Every master was once a beginner.",
  description:
    "Personal chess coaching by Jagadeesh Babu — FIDE-rated player, 10+ years of teaching, 300+ students trained. Online and in-person, from first moves to tournament play.",
  whatsappNumber: "918187092749",
  whatsappDisplay: "+91 81870 92749",
  // Set to the deployed Google Apps Script web-app URL (ends in /exec) to have
  // enquiries land in the client's Google Sheet. Left empty, the enquiry form
  // opens WhatsApp with the message pre-filled instead.
  enquiryEndpoint: process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "",
};

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}` + (text ? `?text=${encodeURIComponent(text)}` : "");

export const nav = [
  { href: "#about", label: "About" },
  { href: "#achievements", label: "Achievements" },
  { href: "#students", label: "Students" },
  { href: "#syllabus", label: "Syllabus" },
  { href: "#events", label: "Events" },
  { href: "#contact", label: "Contact" },
];
