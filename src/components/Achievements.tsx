import { corporate, university, coaching, type Achievement } from "@/content/achievements";

function List({ items }: { items: Achievement[] }) {
  return (
    <ul className="ach-list">
      {items.map((a, i) => (
        <li key={i}>
          <span className="year">{a.year}</span>
          <div>
            <div className="title">{a.title}</div>
            {a.detail && <div className="detail">{a.detail}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Achievements() {
  const photos = [...corporate, ...university].flatMap((a) =>
    (a.photos ?? []).map((p) => ({ ...p, caption: `${a.year} — ${a.title}` })),
  );
  return (
    <section className="section alt" id="achievements">
      <div className="wrap">
        <p className="eyebrow">Achievements</p>
        <h2>
          Played for the win, <em>on and off</em> the board.
        </h2>
        <p className="lede">
          A FIDE-rated player since 2018, with podium finishes at university and corporate level —
          and a growing list of students with results of their own.
        </p>

        <div className="ach-groups">
          <div className="ach-group">
            <h3>Corporate championships</h3>
            <List items={corporate} />
          </div>
          <div className="ach-group">
            <h3>University championships</h3>
            <List items={university} />
          </div>
        </div>

        {photos.length > 0 && (
          <div className="ach-photos">
            {photos.map((p) => (
              <figure key={p.src} className={p.wide ? "wide" : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images pre-sized */}
                <img src={p.src} alt={p.alt} loading="lazy" />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <p className="coaching-note">{coaching.summary}</p>
      </div>
    </section>
  );
}
