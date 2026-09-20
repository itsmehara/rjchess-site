import { site } from "@/content/site";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap about-grid">
        <div>
          <p className="eyebrow">About the coach</p>
          <h2>
            {site.coach}, <em>FIDE-rated</em> player and coach.
          </h2>
          <p className="lede">{profile.intro}</p>
          <p className="lede">
            Lessons run online on {profile.platforms.join(" and ")}, and in person — games played,
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
            <small>Chess coach · {site.brand}</small>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
