import type { MetadataRoute } from "next";
import { publicPaths } from "@/lib/validation";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return publicPaths.map((path) => ({
    url: url + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
