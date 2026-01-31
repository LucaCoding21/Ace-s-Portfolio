import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Bodoni_Moda } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://acesuasola.com";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ace Suasola | Vancouver Concert & Wedding Photographer",
    template: "%s | Ace Suasola Photography",
  },
  description:
    "Ace Suasola is a professional concert and wedding photographer based in Vancouver, British Columbia. Specializing in live music photography at festivals and club shows, wedding day coverage, and creative editorial projects. Serving Metro Vancouver, the Fraser Valley, and all of BC. Book a session at acesuasola@gmail.com.",
  keywords: [
    "Vancouver photographer",
    "concert photographer Vancouver",
    "wedding photographer Vancouver",
    "Vancouver photography",
    "live music photographer Vancouver",
    "event photographer Vancouver BC",
    "Vancouver wedding photography",
    "concert photography Vancouver BC",
    "professional photographer Vancouver",
    "music photographer Vancouver",
    "Vancouver event photography",
    "wedding photos Vancouver BC",
    "live concert photography",
    "photographer Vancouver BC",
    "Ace Suasola",
    "Ace Suasola Photography",
  ],
  authors: [{ name: "Ace Suasola", url: SITE_URL }],
  creator: "Ace Suasola",
  publisher: "Ace Suasola Photography",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Ace Suasola | Vancouver Concert & Wedding Photographer",
    description:
      "Ace Suasola is a professional concert and wedding photographer based in Vancouver, BC. Capturing authentic moments at live shows, weddings, and creative projects across British Columbia.",
    url: SITE_URL,
    siteName: "Ace Suasola Photography",
    images: [
      {
        url: "/images/newpics/ace.jpg",
        width: 1200,
        height: 630,
        alt: "Ace Suasola, Concert and Wedding Photographer in Vancouver, BC",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Suasola | Vancouver Concert & Wedding Photographer",
    description:
      "Ace Suasola is a professional concert and wedding photographer in Vancouver, BC. Live music, weddings, and creative projects.",
    creator: "@acesuasola",
    images: ["/images/newpics/ace.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "CA-BC",
    "geo.placename": "Vancouver",
    "geo.position": "49.2827;-123.1207",
    "ICBM": "49.2827, -123.1207",
    // GEO: Help AI engines understand content structure
    "article:author": "Ace Suasola",
    "profile:username": "acesuasola",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "PhotographyBusiness"],
      "@id": `${SITE_URL}/#business`,
      name: "Ace Suasola Photography",
      url: SITE_URL,
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/newpics/ace.jpg`,
        width: 1200,
        height: 630,
        caption: "Ace Suasola, professional concert and wedding photographer in Vancouver, BC",
      },
      logo: `${SITE_URL}/images/newpics/ace.jpg`,
      description:
        "Ace Suasola Photography is a professional concert and wedding photography service based in Vancouver, British Columbia. Specializing in live music photography at festivals and club shows, wedding day coverage from ceremony to reception, and creative portrait and editorial projects. Serving clients across Metro Vancouver, the Fraser Valley, Whistler, and all of British Columbia.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vancouver",
        addressRegion: "BC",
        postalCode: "V6B",
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 49.2827,
        longitude: -123.1207,
      },
      areaServed: [
        { "@type": "City", name: "Vancouver" },
        { "@type": "City", name: "Burnaby" },
        { "@type": "City", name: "Surrey" },
        { "@type": "City", name: "Richmond" },
        { "@type": "AdministrativeArea", name: "Metro Vancouver" },
        { "@type": "AdministrativeArea", name: "British Columbia" },
      ],
      priceRange: "$$",
      email: "acesuasola@gmail.com",
      sameAs: [
        "https://instagram.com/acesuasola",
        "https://youtube.com/@AceSuasola",
        "https://linkedin.com/in/acesuasola",
      ],
      knowsAbout: [
        "Concert Photography",
        "Wedding Photography",
        "Event Photography",
        "Live Music Photography",
        "Portrait Photography",
        "Editorial Photography",
        "Festival Photography",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Photography Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Concert & Live Music Photography",
              description: "Professional photography for concerts, festivals, and live music events in Vancouver, BC.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Wedding Photography",
              description: "Full-day wedding photography coverage including ceremony, reception, and portraits in Vancouver and across British Columbia.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Creative & Editorial Photography",
              description: "Portrait sessions, editorial shoots, and commissioned creative photography projects.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ace Suasola Photography",
      description: "Portfolio and booking site for Ace Suasola, a professional concert and wedding photographer based in Vancouver, BC.",
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en-CA",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Ace Suasola",
      givenName: "Ace",
      familyName: "Suasola",
      jobTitle: "Professional Photographer",
      description: "Ace Suasola is a professional concert and wedding photographer based in Vancouver, British Columbia. Known for capturing high-energy live music moments and authentic wedding day stories.",
      url: SITE_URL,
      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/acephoto.jpg`,
        caption: "Ace Suasola, Vancouver photographer",
      },
      sameAs: [
        "https://instagram.com/acesuasola",
        "https://youtube.com/@AceSuasola",
        "https://linkedin.com/in/acesuasola",
      ],
      worksFor: { "@id": `${SITE_URL}/#business` },
      knowsAbout: [
        "Concert Photography",
        "Wedding Photography",
        "Live Music Photography",
        "Event Photography",
      ],
      workLocation: {
        "@type": "City",
        name: "Vancouver",
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "British Columbia",
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Portfolio",
          item: `${SITE_URL}/work`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Contact",
          item: `${SITE_URL}/contact`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} ${bodoni.variable}`}>
      <body className="font-body bg-primary text-white antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        {/* GEO: Hidden semantic content for AI search engines - visually hidden but crawlable */}
        <div className="sr-only" role="contentinfo" aria-label="About Ace Suasola Photography">
          <h2>About Ace Suasola Photography</h2>
          <p>
            Ace Suasola is a professional photographer based in Vancouver, British Columbia, Canada.
            Ace specializes in concert photography, wedding photography, and creative editorial projects.
            With experience shooting live music at Vancouver venues and festivals, Ace captures the raw energy
            of performances in dynamic, high-contrast imagery. For weddings, Ace provides full-day coverage
            including ceremony, reception, and couple portraits across Metro Vancouver, the Fraser Valley,
            Whistler, and destinations throughout British Columbia.
          </p>
          <p>
            Services offered include concert and live music photography, wedding day coverage,
            engagement and couple portraits, editorial and commercial photography, and event photography.
            Ace Suasola Photography is available for bookings across British Columbia and worldwide.
          </p>
          <p>
            Contact Ace Suasola at acesuasola@gmail.com or visit the contact page to book a session.
            Follow on Instagram @acesuasola for the latest work.
          </p>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
