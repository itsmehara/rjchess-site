import { site } from "@/content/site";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <div>
          <p className="eyebrow">About the coach</p>
          <h2 className="coach-name">{site.coach}</h2>
          <p className="coach-titles">
            {profile.titles.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <p className="lede">{profile.intro}</p>
          <p className="lede">
            Lessons run online and in person — games played,
            positions reviewed and mistakes worked through together, so every session ends with
            something concrete to practise.
          </p>
          <ul className="stats">
            {profile.stats.map((s) => (
              <li key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
                {s.note && <small>{s.note}</small>}
              </li>
            ))}
          </ul>
        </div>
        <figure className="portrait">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images pre-sized */}
          <img src={profile.photo} alt={profile.photoAlt} width={960} height={1200} />
          <figcaption>
            {site.coach}
            {profile.titles.map((t) => (
              <small key={t}>{t}</small>
            ))}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
