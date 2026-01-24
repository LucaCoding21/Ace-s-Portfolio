import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

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

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "ACE | Concert & Wedding Photographer in Vancouver",
  description:
    "Vancouver-based concert and wedding photographer. Capturing raw energy at live shows and timeless moments at weddings. Available for bookings in Vancouver, BC and beyond.",
  keywords: [
    "Vancouver photographer",
    "concert photography Vancouver",
    "wedding photographer Vancouver",
    "music photography",
    "live music photographer",
    "event photographer Vancouver BC",
    "wedding photography BC",
    "Ace photographer",
    "Vancouver concert photos",
  ],
  openGraph: {
    title: "ACE | Concert & Wedding Photographer in Vancouver",
    description: "Vancouver-based photographer capturing raw energy at concerts and timeless moments at weddings.",
    type: "website",
    locale: "en_CA",
  },
  other: {
    "geo.region": "CA-BC",
    "geo.placename": "Vancouver",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} ${playfair.variable}`}>
      <body className="font-body bg-primary text-white antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
