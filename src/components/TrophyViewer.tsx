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
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Modal: Tab / Shift+Tab stay inside — the close button is the viewer's only control.
      if (e.key === "Tab") { e.preventDefault(); closeRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [onClose]);

  // Pointer-driven tilt (mouse hover or finger drag). While the pointer is
  // away the trophy idles on a slow CSS sway instead.
  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    if (e.pointerType !== "mouse" && e.buttons === 0) return;
    const r = stageRef.current.getBoundingClientRect();
    const px = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
    setTilt({ x: py * -16, y: px * 26 });
  }, []);

  return (
    <div
      className={`trophy-viewer${ready ? " is-ready" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trophy-viewer-title"
      onClick={onClose}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt(null)}
      onPointerUp={() => setTilt(null)}
    >
      <div className="tv-spot" aria-hidden="true" />
      <button ref={closeRef} type="button" className="tv-close" onClick={onClose} aria-label="Close trophy viewer">
        <span aria-hidden="true">&times;</span>
        <small>Esc</small>
      </button>
      <div className="tv-stage" ref={stageRef} onClick={(e) => e.stopPropagation()}>
        <div
          className={`tv-tilt${tilt ? " is-live" : ""}`}
          style={tilt ? { transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` } : undefined}
        >
          <div className="tv-object" style={{ "--tv-src": `url(${src})` } as React.CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element -- transparent cutout, static export */}
            <img src={src} alt={alt} onLoad={() => setReady(true)} draggable={false} />
            <span className="tv-sheen" aria-hidden="true" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- mirrored copy for the floor reflection */}
          <img className="tv-reflection" src={src} alt="" aria-hidden="true" draggable={false} />
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
