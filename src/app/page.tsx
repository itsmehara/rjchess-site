import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Achievements } from "@/components/Achievements";
import { Students } from "@/components/Students";
import { Syllabus } from "@/components/Syllabus";
import { Events } from "@/components/Events";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ThemePicker } from "@/components/ThemePicker";
import { site } from "@/content/site";
import { homeJsonLd, pageMeta } from "@/content/seo";

export const metadata = pageMeta({
  title: `${site.name} — Chess coaching with ${site.coach}`,
  description: site.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaped so the JSON can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <main>
        <About />
        <Achievements />
        <Students />
        <Syllabus />
        <Events />
        <Contact />
      </main>
      <Footer />
      <ThemePicker />
    </>
  );
}
