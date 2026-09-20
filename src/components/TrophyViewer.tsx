"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  title: string;
  sub?: string;
  onClose: () => void;
};

// Full-screen "splash" viewer for a transparent trophy cutout: warm spotlight,
// soft ground shadow, and a gentle pointer-driven tilt on desktop. Never opens
// on its own — the gallery figure is a <button> that mounts this.
export function TrophyViewer({ src, alt, title, sub, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }, []);

  return (
    <div
      className={`trophy-viewer${ready ? " is-ready" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trophy-viewer-title"
      onClick={onClose}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="tv-spot" aria-hidden="true" />
      <button ref={closeRef} type="button" className="tv-close" onClick={onClose} aria-label="Close trophy viewer">
        <span aria-hidden="true">&times;</span>
        <small>Esc</small>
      </button>
      <div className="tv-stage" ref={stageRef} onClick={(e) => e.stopPropagation()}>
        <div
          className="tv-tilt"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- transparent cutout, static export */}
          <img src={src} alt={alt} onLoad={() => setReady(true)} draggable={false} />
          <div className="tv-shadow" aria-hidden="true" />
        </div>
        <div className="tv-caption">
          <b id="trophy-viewer-title">{title}</b>
          {sub && <span>{sub}</span>}
        </div>
      </div>
    </div>
  );
}
