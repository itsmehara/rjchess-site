import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static"; // written to out/sitemap.xml at build time

// Only pages meant for Google. Play and Co-trainers are "coming soon" (noindex) —
// add them here when they get real content, and drop `index: false` on the page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/privacy/`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
