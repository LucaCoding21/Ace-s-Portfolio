import type { Metadata } from "next";
import { getShowBySlug } from "@/lib/shows";

const SITE_URL = "https://acesuasola.com";

type Props = {
  params: Promise<{ slug: string }>;
};

const descriptionMap: Record<string, string> = {
  concerts:
    "Browse Ace Suasola's concert photography portfolio featuring live music performances in Vancouver, BC. High-energy images from festivals, club shows, and live events across the city. Available for concert and festival photography bookings.",
  weddings:
    "View Ace Suasola's wedding photography gallery showcasing ceremonies and receptions across Vancouver and British Columbia. Authentic, candid moments captured with an editorial eye. Now booking weddings for the upcoming season.",
  projects:
    "Explore Ace Suasola's creative photography projects including portraits, editorial shoots, and commissioned work in Vancouver, BC. A curated collection of artistic and commercial photography.",
};

const titleMap: Record<string, string> = {
  concerts: "Concert Photography Gallery | Live Music in Vancouver, BC",
  weddings: "Wedding Photography Gallery | Vancouver & BC Weddings",
  projects: "Creative Photography Projects | Vancouver Photographer",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const show = getShowBySlug(slug);

  if (!show) {
    return {
      title: "Gallery Not Found",
    };
  }

  const title = titleMap[slug] || `${show.title} Gallery`;
  const description = descriptionMap[slug] || show.description;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Ace Suasola Photography`,
      description,
      type: "website",
      images: [
        {
          url: show.coverImage,
          width: 1200,
          height: 630,
          alt: `${show.title} photography by Ace Suasola in Vancouver, BC`,
        },
      ],
    },
    alternates: {
      canonical: `/show/${slug}`,
    },
  };
}

export default function ShowLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // We need to generate schema inline - use a wrapper
  return (
    <>
      {children}
      <ShowSchema params={params} />
    </>
  );
}

async function ShowSchema({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const show = getShowBySlug(slug);
  if (!show) return null;

  const description = descriptionMap[slug] || show.description;

  const gallerySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageGallery",
        "@id": `${SITE_URL}/show/${slug}/#gallery`,
        name: `${show.title} Photography by Ace Suasola`,
        description,
        url: `${SITE_URL}/show/${slug}`,
        author: { "@id": `${SITE_URL}/#person` },
        provider: { "@id": `${SITE_URL}/#business` },
        numberOfItems: show.images.length,
        image: show.images.slice(0, 10).map((img, i) => ({
          "@type": "ImageObject",
          url: `${SITE_URL}${img}`,
          name: `${show.title.toLowerCase()} photography Vancouver photo ${i + 1}`,
          author: { "@id": `${SITE_URL}/#person` },
          contentLocation: {
            "@type": "City",
            name: "Vancouver",
            containedInPlace: { "@type": "AdministrativeArea", name: "British Columbia" },
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE_URL}/work` },
          { "@type": "ListItem", position: 3, name: show.title, item: `${SITE_URL}/show/${slug}` },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
    />
  );
}
