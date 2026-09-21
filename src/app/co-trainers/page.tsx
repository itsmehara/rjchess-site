import type { Metadata } from "next";
import { Subpage } from "@/components/Subpage";
import { site, waLink } from "@/content/site";

export const metadata: Metadata = {
  title: `Co-trainers — ${site.name}`,
  description: "Trainers who coach alongside Jagadeesh Babu — coming soon.",
};

export default function CoTrainersPage() {
  return (
    <Subpage current="/co-trainers/">
      <section className="section" id="co-trainers">
        <div className="wrap">
          <p className="eyebrow">Co-trainers</p>
          <h2>
            Coaches who train <em>alongside</em> Jagadeesh.
          </h2>
          <p className="lede">
            Profiles, ratings and the levels each coach takes will appear here as they join.
          </p>
          <div className="soon-tag">Coming soon</div>
          <div className="soon-grid" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className="soon-card">
                <span className="avatar">♞</span>
                <b />
                <i />
              </div>
            ))}
          </div>
          <p className="lede small">
            A coach interested in joining?{" "}
            <a href={waLink("Hi Jagadeesh, I'm a chess coach and would like to talk about co-training.")} target="_blank" rel="noopener">
              Message on WhatsApp
            </a>.
          </p>
        </div>
      </section>
    </Subpage>
  );
}
