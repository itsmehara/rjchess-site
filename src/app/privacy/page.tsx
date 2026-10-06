import type { Metadata } from "next";
import { Subpage } from "@/components/Subpage";
import { AnalyticsChoice } from "@/components/Analytics";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Privacy — ${site.name}`,
  description: "How RJChess uses the details you share and what this website measures.",
};

const UPDATED = "6 October 2026";

export default function PrivacyPage() {
  return (
    <Subpage current="/privacy/">
      <section className="section prose" id="privacy">
        <div className="wrap">
          <p className="eyebrow">Privacy</p>
          <h1>
            Your details, <em>kept simple</em>.
          </h1>
          <p className="lede">
            {site.name} is run by {site.coach}. This page explains what the website collects, why, and how to
            ask for it to be changed or deleted. Last updated {UPDATED}.
          </p>

          <h3>When you send an enquiry</h3>
          <p>
            The form asks for your name, phone number, city, and optionally your email, pincode, chess level,
            preferred date and time slots, and a message. These are used only to reply to you and arrange
            classes. They are saved to a private Google Sheet and sent to the academy&apos;s email
            ({site.email}); if you continue on WhatsApp, that conversation is on WhatsApp. Your details are never
            sold or shared for marketing.
          </p>
          <p>
            Enquiries are kept while we are in touch about classes. Email <a href={`mailto:${site.email}`}>{site.email}</a> any
            time to see, correct or delete what you sent.
          </p>

          <h3>Visit counter</h3>
          <p>
            The number of visits in the footer is a simple daily count. It uses no cookies and stores nothing about
            you — not your IP address, device or location.
          </p>

          <h3>Google Analytics — only if you allow it</h3>
          <p>
            With your permission, the site uses Google Analytics to see which pages are useful, roughly where
            visitors are (city or country), the type of device, and how people found the site. It sets cookies
            on your device. Google Analytics does not store your IP address. Nothing is used for advertising.
            If you choose &ldquo;No thanks&rdquo;, it is not loaded at all.
          </p>
          <AnalyticsChoice />

          <h3>Other small things</h3>
          <p>
            Your colour-theme choice and your analytics choice are remembered in your own browser only. Event
            listings link to the official sites of chess organisations, which have their own privacy policies.
          </p>
        </div>
      </section>
    </Subpage>
  );
}
