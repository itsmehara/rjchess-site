import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static"; // written to out/robots.txt at build time

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
