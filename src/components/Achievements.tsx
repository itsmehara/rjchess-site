"use client";

import { useState } from "react";
import { corporate, university, coaching, type Achievement } from "@/content/achievements";
import { awardGroups, teamPhoto, type Award } from "@/content/awards";
import { TrophyViewer } from "./TrophyViewer";

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

function AwardFigure({ a, onOpen }: { a: Award; onOpen?: (a: Award) => void }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- static export, images pre-sized
    <img src={a.src} alt={a.alt} loading="lazy" width={960} height={1200} />
  );
  return (
    <figure className={a.cutout ? "has-viewer" : undefined}>
      {a.cutout && onOpen ? (
        <button type="button" className="award-open" onClick={() => onOpen(a)} aria-label={`View ${a.title} trophy full screen`}>
          {img}
          <span className="award-hint" aria-hidden="true">View</span>
        </button>
      ) : (
        img
      )}
      <figcaption>
        <b>{a.title}</b>
        {a.sub && <span>{a.sub}</span>}
      </figcaption>
    </figure>
  );
}

export function Achievements() {
  const [open, setOpen] = useState<Award | null>(null);
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
            <figure className="ach-team">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images pre-sized */}
              <img src={teamPhoto.src} alt={teamPhoto.alt} loading="lazy" width={1448} height={1086} />
              <figcaption>{teamPhoto.caption}</figcaption>
            </figure>
          </div>
        </div>

        <div className="awards">
          <h3 className="awards-heading">Trophies &amp; awards</h3>
          {awardGroups.map((g) => (
            <div key={g.heading} className="awards-group">
              <p className="awards-label">{g.heading}</p>
              <div className="ach-photos">
                {g.items.map((a) => (
                  <AwardFigure key={a.src} a={a} onOpen={setOpen} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="coaching-note">{coaching.summary}</p>
      </div>

      {open?.cutout && (
        <TrophyViewer src={open.cutout} alt={open.alt} title={open.title} sub={open.sub} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
