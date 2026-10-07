import { Subpage } from "@/components/Subpage";
import { BoardPreview } from "@/components/BoardPreview";
import Link from "next/link";
import { site } from "@/content/site";
import { pageMeta } from "@/content/seo";

export const metadata = pageMeta({
  title: `Play — ${site.name}`,
  description: "Play a friend on the RJChess board — coming soon.",
  path: "/play/",
  index: false,
});

export default function PlayPage() {
  return (
    <Subpage current="/play/">
      <section className="section" id="play">
        <div className="wrap">
          <p className="eyebrow">Play</p>
          <h1>
            Play a friend, <em>right here</em>.
          </h1>
          <p className="lede">
            Two players, one shared code, two clocks and the move list on the side. The board resets
            after checkmate. It is being built — for now, here is what it will look like.
          </p>
          <div className="soon-tag">Coming soon</div>
          <BoardPreview />
          <p className="lede small">
            Want a game today? <Link href="/?enquiry=general#contact">Contact the trainer</Link> and he will set one up online.
          </p>
        </div>
      </section>
    </Subpage>
  );
}
