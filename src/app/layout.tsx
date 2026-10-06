import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import { site } from "@/content/site";
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

export const metadata: Metadata = {
  title: `${site.name} — Chess coaching with ${site.coach}`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
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
