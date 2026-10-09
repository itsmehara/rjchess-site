// Selectable colour themes. The palettes themselves live in globals.css under
// html[data-theme="…"]; this list only drives the picker and the URL/localStorage
// handling. The default is set on <html data-theme> in layout.tsx (no saved choice → forest);
// "ink" is the base palette in :root, so data-theme="ink" simply means no overrides.
export const THEME_KEY = "rjchess-theme";
export const DEFAULT_THEME = "forest";

export const themes = [
  { id: "ink", label: "Ink black & gold", swatch: ["#0a0a0c", "#d6a94a"] },
  { id: "forest", label: "Forest green & brass", swatch: ["#0b1f18", "#c9a227"] },
] as const;

export type ThemeId = (typeof themes)[number]["id"];
