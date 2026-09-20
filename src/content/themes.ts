// Selectable colour themes. The palettes themselves live in globals.css under
// html[data-theme="…"]; this list only drives the picker and the URL/localStorage
// handling. "ink" is the default (no data-theme attribute needed).
export const THEME_KEY = "rjchess-theme";

export const themes = [
  { id: "ink", label: "Ink black & gold", swatch: ["#0a0a0c", "#d6a94a"] },
  { id: "forest", label: "Forest green & brass", swatch: ["#0b1f18", "#c9a227"] },
  { id: "navy", label: "Navy & silver", swatch: ["#0b1526", "#c8ccd4"] },
  { id: "burgundy", label: "Burgundy & gold", swatch: ["#240d12", "#d9ab4b"] },
] as const;

export type ThemeId = (typeof themes)[number]["id"];
