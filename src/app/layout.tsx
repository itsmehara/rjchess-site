import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { site } from "@/content/site";
import { DEFAULT_THEME } from "@/content/themes";
import { Analytics } from "@/components/Analytics";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Site-wide defaults. Each page sets its own title, description and canonical URL.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — Chess coaching with ${site.coach}`,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/hero/hall-king.jpg", width: 1672, height: 941, alt: `${site.name} — chess coaching with ${site.coach}` }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved / linked theme before first paint; see ThemePicker. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- must run before paint (~300 B) */}
        <script src="/theme-init.js" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
