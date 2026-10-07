import { Subpage } from "@/components/Subpage";
import Link from "next/link";
import { site } from "@/content/site";
import { pageMeta } from "@/content/seo";

export const metadata = pageMeta({
  title: `Co-trainers — ${site.name}`,
  description: "Trainers who coach alongside Jagadeesh Babu — coming soon.",
  path: "/co-trainers/",
  index: false,
});

export default function CoTrainersPage() {
  return (
    <Subpage current="/co-trainers/">
      <section className="section" id="co-trainers">
        <div className="wrap">
          <p className="eyebrow">Co-trainers</p>
          <h1>
            Coaches who train <em>alongside</em> Jagadeesh.
          </h1>
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
            A coach interested in joining? <Link href="/?enquiry=general#contact">Contact us</Link> and mention co-training.
          </p>
        </div>
      </section>
    </Subpage>
  );
}
