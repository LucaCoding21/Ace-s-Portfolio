import type { Metadata } from "next";

const SITE_URL = "https://acesuasola.com";

export const metadata: Metadata = {
  title: "Photography Portfolio | Concerts, Weddings & Creative Projects",
  description:
    "Browse the complete photography portfolio of Ace Suasola, a professional photographer in Vancouver, BC. Featuring concert and live music photography, wedding day galleries, and creative editorial projects. Serving clients across Metro Vancouver and British Columbia.",
  openGraph: {
    title: "Photography Portfolio | Ace Suasola Photography",
    description:
      "Explore concert, wedding, and creative project photography by Ace Suasola. Professional photographer based in Vancouver, BC.",
    type: "website",
  },
  alternates: {
    canonical: "/work",
  },
};

const portfolioSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/work/#collection`,
      name: "Ace Suasola Photography Portfolio",
      description:
        "A curated collection of concert, wedding, and creative photography by Ace Suasola. Based in Vancouver, British Columbia, Canada.",
      url: `${SITE_URL}/work`,
      author: { "@id": `${SITE_URL}/#person` },
      provider: { "@id": `${SITE_URL}/#business` },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: 3,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Concert Photography",
            url: `${SITE_URL}/show/concerts`,
            description: "Live music and concert photography from Vancouver venues and festivals.",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Wedding Photography",
            url: `${SITE_URL}/show/weddings`,
            description: "Wedding day photography across Vancouver and British Columbia.",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Creative Projects",
            url: `${SITE_URL}/show/projects`,
            description: "Portraits, editorial shoots, and commissioned creative photography.",
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE_URL}/work` },
      ],
    },
  ],
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
    </>
  );
}
