import { students } from "@/content/students";

export function Students() {
  return (
    <section className="section" id="students">
      <div className="wrap">
        <p className="eyebrow">Students</p>
        <h2>
          Their wins are the <em>real</em> record.
        </h2>
        <p className="lede">
          Students trained here have earned FIDE and USCF ratings and taken district and state
          titles. Each one started exactly where you are now.
        </p>

        {students.length === 0 ? (
          <div className="pending">
            <b>Student stories coming soon.</b> Photos and results are being added with each
            family&apos;s permission — check back shortly, or ask on WhatsApp about students at
            your level.
          </div>
        ) : (
          <div className="student-grid">
            {students.map((s, i) => (
              <article className="student-card" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images pre-sized */}
                {s.photo && <img src={s.photo} alt={s.photoAlt ?? s.name ?? "Student"} loading="lazy" />}
                <div>
                  <small>{s.year}</small>
                  <b>{s.name ?? "RJChess student"}</b>
                  <p>{s.achievement}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
