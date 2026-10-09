"use client";

import { useSyncExternalStore } from "react";
import { themes, type ThemeId, THEME_KEY, DEFAULT_THEME } from "@/content/themes";

// Small fixed palette switch so the owner can compare looks before choosing.
// The theme is the `data-theme` attribute on <html>; it persists in
// localStorage and `?theme=<id>` in the URL wins (and is saved), so a link can
// be sent for review. The <head> script in layout.tsx applies the same choice
// before first paint so nothing flashes.
const ids = themes.map((t) => t.id) as string[];

function read(): ThemeId {
  const t = document.documentElement.getAttribute("data-theme");
  return t && ids.includes(t) ? (t as ThemeId) : DEFAULT_THEME;
}
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
function apply(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {}
}

export function ThemePicker() {
  const theme = useSyncExternalStore(subscribe, read, () => DEFAULT_THEME as ThemeId);

  return (
    <fieldset className="theme-picker">
      <legend>Colour theme</legend>
      <span className="tp-label" aria-hidden="true">Theme</span>
      {themes.map((t) => (
        <label key={t.id} title={t.label}>
          <input type="radio" name="theme" value={t.id} checked={theme === t.id} onChange={() => apply(t.id)} aria-label={t.label} />
          <span className="swatch" style={{ "--sw-a": t.swatch[0], "--sw-b": t.swatch[1] } as React.CSSProperties} />
        </label>
      ))}
    </fieldset>
  );
}
