# RJChess Academy

Single-page site for chess coach Jagadeesh Babu — Next.js (App Router), exported as static HTML so it can be hosted anywhere.

This is the deployable application, in its own independent git repository. Research, drafts,
and background material for this project live one level up, in a separate workspace repo —
not included here and not needed to run this app.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

Content lives in `src/content/*.ts` — edit those files to update the About text, achievements,
students and syllabus; no code changes needed. Enquiry form: set `NEXT_PUBLIC_ENQUIRY_ENDPOINT`
(see `.env.example`) to the Google Apps Script `/exec` URL to save enquiries to the Google Sheet;
unset, the form hands straight over to WhatsApp.

## Chess events & results

`src/components/Events.tsx` shows upcoming tournaments, results/news and an
official-source directory, filtered by region (AP, Telangana, India, world, USA).

- **Source directory** (always shown): `src/content/events.ts` — hand-curated links,
  text names only, no logos.
- **Automated data**: `src/content/events.generated.json`, written by
  `npm run events:refresh` (`scripts/collect-events.mjs`, zero dependencies).
  Sources that permit it: Andhra Chess Association (public JSON), AICF (public
  events table), Telangana SCA (WordPress REST — announcements only), FIDE (news RSS).
  US Chess, World Chess, FIDE calendar and Chess-Results are links only.
  Only names, dates, places and the source's own URLs are stored; each source
  fails independently and keeps its last good data. The section shows
  "Last checked" and flags stale data after 3 days.
- **Live on page load (optional)**: set `NEXT_PUBLIC_EVENTS_FEED_URL` to a URL that
  serves the same JSON (a tiny worker/function on the host that runs the collector
  and caches it for ~24h). The widget then refreshes from it when a visitor opens the
  page and shows "Live"; the bundled snapshot remains the fallback. The sources
  themselves don't send CORS headers, so the browser can't fetch them directly.
- **Schedule**: `.github/workflows/deploy.yml` refreshes the data daily (03:30 IST),
  commits the JSON if it changed, builds and publishes to GitHub Pages. Active as
  soon as the repo is on GitHub with Pages set to "GitHub Actions".

## Deployment — GitHub Pages

1. Push this repo to GitHub (public). In **Settings → Pages** set Source to
   **GitHub Actions**. The `Deploy` workflow builds `out/` and publishes it on
   every push to `main`, daily (events refresh), or manually from the Actions tab.
2. **Custom domain** (recommended): add `rjchess.com` under Settings → Pages and
   point the domain's DNS at GitHub Pages (A records `185.199.108–111.153`, CNAME
   `www` → `<user>.github.io`). Enable "Enforce HTTPS" once the certificate is issued.
3. Without a custom domain the site is served from `https://<user>.github.io/<repo>/`,
   and asset paths (`/hero/…`, `/photos/…`) would break — either name the repo
   `<user>.github.io` (served at the root) or use the custom domain.
4. Enquiry endpoint: set a repository **variable** `NEXT_PUBLIC_ENQUIRY_ENDPOINT`
   (Settings → Secrets and variables → Actions → Variables) to the Apps Script
   `/exec` URL; the workflow passes it to the build.

`public/.nojekyll` is required — Pages otherwise skips Next's `_next/` folder.
