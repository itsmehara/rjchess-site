import type { NextConfig } from "next";

// Static export: the site is plain HTML/CSS/JS so it can sit on any host
// (Hostinger, Cloudflare Pages, GitHub Pages…) — hosting is not decided yet.
// Enquiries go straight from the browser to a Google Apps Script, so no server
// is needed.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
