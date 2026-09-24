"use client";

import { useEffect, useRef, useState } from "react";
import { site, navLinks, waLink } from "@/content/site";
import { NavMenu } from "./NavMenu";
import "./hero.css";

// ---- The only list to edit when new frames arrive. ----
// `bright` picks the heavier scrim, needed on any light-walled frame or the
// ivory headline stops being readable over it.
const IMAGES = [
  { src: "/hero/hall-king.jpg", label: "The empty hall", bright: false },
  { src: "/hero/marble-pair.jpg", label: "Queen and King", bright: true },
  { src: "/hero/palace-pair.jpg", label: "The royal pair", bright: true },
  { src: "/hero/palace-king.jpg", label: "The white King", bright: true },
];
const MOVES = ["m1", "m2", "m3", "m4", "m5", "m6"];

// Walking images and moves at different rates pairs every image with every
// move before anything repeats: 4 x 6 = 12 scenes.
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const SCENES = Array.from(
  { length: (IMAGES.length * MOVES.length) / gcd(IMAGES.length, MOVES.length) },
  (_, i) => ({ ...IMAGES[i % IMAGES.length], move: MOVES[i % MOVES.length] }),
);

// Two speeds for the visitor. The camera animation always outlasts the scene
// so the frame is still moving while it dissolves out.
type Speed = "slow" | "fast";
const SPEEDS: Record<Speed, { scene: number; fade: number }> = {
  slow: { scene: 12000, fade: 2200 },
  fast: { scene: 8000, fade: 1600 },
};
const CAMERA_OVERRUN = 3500;

const pad = (n: number) => String(n).padStart(2, "0");

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const layer0 = useRef<HTMLDivElement>(null);
  const layer1 = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);

  // Sequencer state lives in refs: it changes on timers, not renders.
  const state = useRef({ speed: "slow" as Speed, paused: false, current: 0, activeLayer: 0, transitioning: false, timer: 0 });
  const [control, setControl] = useState<Speed | "pause">("slow");
  const [scene, setScene] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState("");

  // Scroll-spy: the menu item for the section the visitor is reading stays
  // lit. "Reading" = the last section whose top has passed the upper 40% of
  // the viewport; nothing is lit while the hero is on screen. A click lights
  // its item at once, before the smooth scroll lands.
  useEffect(() => {
    const sections = navLinks
      .filter((n) => n.href.startsWith("#")) // route links (Play, Co-trainers) aren't sections
      .map((n) => ({ href: n.href, el: document.querySelector<HTMLElement>(n.href) }))
      .filter((x): x is { href: string; el: HTMLElement } => Boolean(x.el));
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = "";
      for (const { href, el } of sections) if (el.getBoundingClientRect().top <= line) current = href;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Pin the nav once the ribbon has scrolled away, so the menu is reachable
  // from every section.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stage = stageRef.current!;
    const layers = [layer0.current!, layer1.current!];
    const s = state.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const preloaded = SCENES.map(
      ({ src }) =>
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = src;
          if (image.complete) resolve();
        }),
    );

    const applySpeed = () => {
      const sp = SPEEDS[s.speed];
      stage.style.setProperty("--fade", sp.fade + "ms");
      stage.style.setProperty("--scene-dur", sp.scene + "ms");
      stage.style.setProperty("--cam-dur", sp.scene + CAMERA_OVERRUN + "ms");
    };
    const restartProgress = () => {
      const p = progressRef.current;
      if (!p) return;
      p.style.animation = "none";
      void p.offsetWidth;
      p.style.animation = "";
    };
    const restartMove = (el: HTMLElement, move: string) => {
      el.classList.remove(move);
      void el.offsetWidth;
      el.classList.add(move);
    };
    const schedule = () => {
      window.clearTimeout(s.timer);
      if (!s.paused && !reducedMotion) s.timer = window.setTimeout(showNext, SPEEDS[s.speed].scene);
    };

    async function showNext() {
      if (s.transitioning) return;
      s.transitioning = true;
      window.clearTimeout(s.timer);

      const nextIndex = (s.current + 1) % SCENES.length;
      await preloaded[nextIndex];

      const outgoing = layers[s.activeLayer];
      s.activeLayer = s.activeLayer === 0 ? 1 : 0;
      const incoming = layers[s.activeLayer];
      s.current = nextIndex;
      const next = SCENES[nextIndex];

      // Reset the incoming layer and flush it at opacity 0. A forced reflow is
      // used rather than requestAnimationFrame because rAF never fires in a
      // background tab — the sequence would stall there.
      incoming.classList.remove("is-visible", ...MOVES);
      incoming.style.backgroundImage = `url("${next.src}")`;
      void incoming.offsetWidth;
      incoming.classList.add(next.move);
      void incoming.offsetWidth;

      setScene(nextIndex);
      incoming.classList.add("is-visible");
      outgoing.classList.remove("is-visible");
      stage.classList.toggle("is-bright", next.bright);
      restartProgress();
      schedule();

      // Only strip the outgoing move once it has fully faded, so it keeps
      // drifting all the way out instead of snapping back mid-dissolve.
      window.setTimeout(() => {
        if (!outgoing.classList.contains("is-visible")) outgoing.classList.remove(...MOVES);
        s.transitioning = false;
      }, SPEEDS[s.speed].fade + 150);
    }

    const onControl = (e: Event) => {
      const choice = (e as CustomEvent<Speed | "pause">).detail;
      if (choice === "pause") {
        s.paused = true;
        stage.classList.add("is-paused");
        window.clearTimeout(s.timer);
        return;
      }
      const wasPaused = s.paused;
      s.paused = false;
      stage.classList.remove("is-paused");
      // Re-time the running scene so the change is felt immediately.
      if (choice !== s.speed || wasPaused) {
        s.speed = choice;
        applySpeed();
        restartMove(layers[s.activeLayer], SCENES[s.current].move);
        restartProgress();
      }
      schedule();
    };
    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(s.timer);
      else if (!s.paused) schedule();
    };

    stage.addEventListener("hero-control", onControl);
    document.addEventListener("visibilitychange", onVisibility);

    applySpeed();
    stage.classList.toggle("is-bright", SCENES[0].bright);
    layers[0].style.backgroundImage = `url("${SCENES[0].src}")`;
    layers[1].style.backgroundImage = `url("${SCENES[1].src}")`;
    layers[0].classList.add(SCENES[0].move);
    schedule();

    return () => {
      window.clearTimeout(s.timer);
      stage.removeEventListener("hero-control", onControl);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const choose = (choice: Speed | "pause") => {
    setControl(choice);
    stageRef.current?.dispatchEvent(new CustomEvent("hero-control", { detail: choice }));
  };

  return (
    <div className="stage" ref={stageRef} id="top">
      <div className="shots" aria-hidden="true">
        <div className="shot is-visible" ref={layer0} />
        <div className="shot" ref={layer1} />
      </div>
      <div className="atmosphere" aria-hidden="true" />
      <div className="atmosphere-bright" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="ribbon" aria-label="Contact">
        <div className="ribbon-track">
          {[0, 1].map((i) => (
            <div className="ribbon-group" key={i} aria-hidden={i === 1}>
              <b>Personal chess coaching</b>
              <span className="dot" />
              <a href={waLink()}>WhatsApp {site.whatsappDisplay}</a>
              <span className="dot" />
              <span>Online &amp; in person</span>
              <span className="dot" />
              <span>FIDE-rated player</span>
              <span className="dot" />
            </div>
          ))}
        </div>
      </div>

      <header className={stuck ? "nav is-stuck" : "nav"}>
        <a className="wordmark" href="#top">
          <span className="mark" aria-hidden="true">&#9812;</span>
          <span className="wordmark-text">
            <b>{site.brand}</b>
          </span>
        </a>
        <NavMenu active={active} onPick={setActive} />
        <div className="nav-actions">
          <div className="speed-control" role="group" aria-label="Background motion">
            <button type="button" className={control === "slow" ? "on" : ""} onClick={() => choose("slow")}>Slow</button>
            <button type="button" className={control === "fast" ? "on" : ""} onClick={() => choose("fast")}>Fast</button>
            <button
              type="button"
              className={control === "pause" ? "on" : ""}
              onClick={() => choose(control === "pause" ? "slow" : "pause")}
              aria-label={control === "pause" ? "Resume motion" : "Pause motion"}
              title={control === "pause" ? "Resume motion" : "Pause motion"}
            >
              <span className="pause-glyph" aria-hidden="true" />
            </button>
          </div>
          <a className="wa-btn" href={waLink()}>WhatsApp</a>
        </div>
      </header>

      <section className="hero">
        <p className="kicker"><span />Online &amp; personal coaching</p>
        <h1>Every master<br />was once a <em>beginner</em>.</h1>
        <p className="hero-note">
          Personal chess training with {site.coach} — FIDE-rated player, ten years of coaching and
          more than 300 students taught, from first moves to rated tournament play.
        </p>
        <p className="fee-line">Fee structure shared on request — message to discuss a batch.</p>
        <div className="hero-actions">
          <a className="primary" href={waLink("Hi Jagadeesh, I'd like to know more about chess coaching.")}>
            Talk on WhatsApp <span aria-hidden="true">&#8599;</span>
          </a>
          <a href="#syllabus">Training syllabus <span aria-hidden="true">&#8599;</span></a>
        </div>
      </section>

      <aside className="status" aria-hidden="true">
        <span className="seq">{pad(scene + 1)} / {pad(SCENES.length)}</span>
        <div className="progress"><i ref={progressRef} /></div>
        <p>{SCENES[scene].label}</p>
      </aside>
    </div>
  );
}
