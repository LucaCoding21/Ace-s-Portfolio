import type { MetadataRoute } from "next";
import { shows, allPhotos, newPhotos } from "@/lib/shows";

const SITE_URL = "https://acesuasola.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${SITE_URL}/images/newpics/ace.jpg`,
        `${SITE_URL}/acephoto.jpg`,
      ],
    },
    {
      url: `${SITE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      images: shows.map((show) => `${SITE_URL}${show.coverImage}`),
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic gallery pages with image references
  const showPages: MetadataRoute.Sitemap = shows.map((show) => ({
    url: `${SITE_URL}/show/${show.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: show.slug === "concerts" ? 0.9 : 0.8,
    images: show.images.slice(0, 20).map((img) => `${SITE_URL}${img}`),
  }));

  return [...staticPages, ...showPages];
}
