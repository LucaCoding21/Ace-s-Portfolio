import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ACE SUASOLA | Concert Photography",
  description:
    "Concert and music photography portfolio by Ace Suasola. Capturing the energy, chaos, and beauty of live music.",
  keywords: [
    "concert photography",
    "music photography",
    "live music",
    "photographer",
    "Ace Suasola",
  ],
  openGraph: {
    title: "ACE SUASOLA | Concert Photography",
    description: "Capturing the energy, chaos, and beauty of live music.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="font-body bg-primary text-white antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
