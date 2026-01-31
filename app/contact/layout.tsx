import type { Metadata } from "next";

const SITE_URL = "https://acesuasola.com";

export const metadata: Metadata = {
  title: "Contact | Book a Concert or Wedding Photographer in Vancouver, BC",
  description:
    "Book Ace Suasola for professional concert photography, wedding day coverage, or creative projects in Vancouver, BC. Reach out via email at acesuasola@gmail.com or use the contact form. Available for events across Metro Vancouver, British Columbia, and worldwide.",
  openGraph: {
    title: "Contact & Book Ace Suasola Photography",
    description:
      "Book a professional concert and wedding photographer in Vancouver, BC. Available for events across British Columbia and worldwide.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact/#page`,
      name: "Contact Ace Suasola Photography",
      description:
        "Get in touch with Ace Suasola for photography bookings in Vancouver, BC. Concert, wedding, and event photography services.",
      url: `${SITE_URL}/contact`,
      mainEntity: {
        "@id": `${SITE_URL}/#business`,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
      ],
    },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    </>
  );
}
