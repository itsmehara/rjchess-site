import type { Metadata } from "next";
import { site } from "./site";

// Per-page metadata. Next.js replaces (does not merge) a page's openGraph object
// with the layout's, so every page builds the full set here.
const ogImage = { url: "/hero/hall-king.jpg", width: 1672, height: 941, alt: `${site.name} — chess coaching with ${site.coach}` };

export function pageMeta({ title, description, path, index = true }: { title: string; description: string; path: string; index?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_IN", url: path, title, description, images: [ogImage] },
    // "Coming soon" pages: kept out of Google until they have real content; links on them still count.
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}

/** Structured data for the home page — only facts already shown on the site. */
export function homeJsonLd() {
  const org = `${site.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: site.name,
        alternateName: "RJ Chess",
        inLanguage: "en-IN",
        publisher: { "@id": org },
      },
      {
        "@type": "EducationalOrganization",
        "@id": org,
        name: site.name,
        alternateName: "RJ Chess",
        url: `${site.url}/`,
        description: site.description,
        email: site.email,
        telephone: `+${site.whatsappNumber}`,
        image: `${site.url}${ogImage.url}`,
        founder: { "@id": `${site.url}/#coach` },
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#coach`,
        name: site.coach,
        jobTitle: "Chess coach",
        image: `${site.url}/photos/jagadeesh-portrait.jpg`,
        worksFor: { "@id": org },
      },
    ],
  };
}
