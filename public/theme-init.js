// Applies the saved / linked colour theme before first paint so the page never
// flashes the default. Keep the id list in sync with src/content/themes.ts.
(function () {
  try {
    var ok = ["ink", "forest"];
    var key = "rjchess-theme";
    var q = new URLSearchParams(location.search).get("theme");
    var t = q || localStorage.getItem(key);
    if (q && ok.indexOf(q) > -1) localStorage.setItem(key, q);
    if (t && ok.indexOf(t) > -1 && t !== "ink") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
