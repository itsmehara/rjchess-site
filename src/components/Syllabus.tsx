"use client";

import { useRef, useSyncExternalStore } from "react";
import { syllabus } from "@/content/syllabus";

function useActiveStep(ref: React.RefObject<HTMLOListElement | null>) {
  // Which card is nearest the centre of the swipe track (phones only; on
  // wider screens the track doesn't scroll and this stays 0).
  return useSyncExternalStore(
    (cb) => {
      const el = ref.current;
      if (!el) return () => {};
      el.addEventListener("scroll", cb, { passive: true });
      return () => el.removeEventListener("scroll", cb);
    },
    () => {
      const el = ref.current;
      if (!el || el.scrollWidth <= el.clientWidth) return 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0, dist = Infinity;
      Array.from(el.children).forEach((li, i) => {
        const c = (li as HTMLElement).offsetLeft + (li as HTMLElement).offsetWidth / 2;
        if (Math.abs(c - mid) < dist) { dist = Math.abs(c - mid); best = i; }
      });
      return best;
    },
    () => 0,
  );
}

export function Syllabus() {
  const track = useRef<HTMLOListElement>(null);
  const active = useActiveStep(track);
  return (
    <section className="section alt" id="syllabus">
      <div className="wrap">
        <p className="eyebrow">Training syllabus</p>
        <h2>
          Five levels, <em>placed</em> by where you are today.
        </h2>
        <p className="lede">{syllabus.summary}</p>

        <ol className="path" aria-label="Training levels" ref={track}>
          {syllabus.levels.map((l, i) => (
            <li className="level" key={`${l.name}-${l.stage}`} tabIndex={0}>
              <p className="for">Step {String(i + 1).padStart(2, "0")}</p>
              <h3>
                {l.name}
                {l.stage && <span className="lvl-stage">{l.stage}</span>}
              </h3>
              <p className="blurb">{l.blurb}</p>
            </li>
          ))}
        </ol>
        <p className="path-hint">Hover or tap a level to enlarge it.</p>
        <div className="path-dots" aria-hidden="true">
          {syllabus.levels.map((l, i) => <i key={`${l.name}-${l.stage}`} className={i === active ? "on" : undefined} />)}
        </div>
        <p className="path-swipe" aria-hidden="true">Swipe through the five steps</p>

        <div className="placement">
          {syllabus.placement.map((p, i) => (
            <article key={p.title}>
              <p className="for">{String(i + 1).padStart(2, "0")}</p>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>

        <ul className="formats">
          {syllabus.formats.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="lede small">The detailed syllabus for each level is shared once the student is placed — message on WhatsApp to arrange the first session.</p>
      </div>
    </section>
  );
}
