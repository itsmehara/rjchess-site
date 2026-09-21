import { syllabus } from "@/content/syllabus";

export function Syllabus() {
  return (
    <section className="section alt" id="syllabus">
      <div className="wrap">
        <p className="eyebrow">Training syllabus</p>
        <h2>
          Five levels, <em>placed</em> by where you are today.
        </h2>
        <p className="lede">{syllabus.summary}</p>

        <ol className="path" aria-label="Training levels">
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
