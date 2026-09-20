import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Achievements } from "@/components/Achievements";
import { Students } from "@/components/Students";
import { Syllabus } from "@/components/Syllabus";
import { Events } from "@/components/Events";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ThemePicker } from "@/components/ThemePicker";

export default function Home() {
  return (
    <>
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
