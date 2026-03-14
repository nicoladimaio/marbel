import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Navbar and Footer moved to (public)/layout.tsx
// import AdminMenu from "./components/AdminMenu";
// import { usePathname } from "next/navigation";
import CookieBannerConditional from "./components/CookieBannerConditional";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marbel.it"),
  title: {
    default: "MarBel | Impresa Edile a Marcianise, Capodrise, Caserta e Napoli",
    template: "%s | MarBel",
  },
  description:
    "Impresa edile specializzata in ristrutturazioni chiavi in mano, servizi per casa e locali commerciali a Marcianise, Capodrise, Caserta e Napoli.",
  keywords: [
    "impresa edile Marcianise",
    "impresa edile Capodrise",
    "ristrutturazioni Caserta",
    "ristrutturazioni Napoli",
    "preventivo ristrutturazione",
    "lavori edili provincia di Caserta",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://marbel.it",
    siteName: "MarBel",
    title: "MarBel | Impresa Edile a Marcianise, Capodrise, Caserta e Napoli",
    description:
      "Ristrutturazioni complete e servizi edili su misura a Marcianise, Capodrise, Caserta e Napoli.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Logo MarBel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarBel | Impresa Edile a Marcianise, Capodrise, Caserta e Napoli",
    description:
      "Ristrutturazioni complete e servizi edili su misura a Marcianise, Capodrise, Caserta e Napoli.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.ico?v=3", type: "image/x-icon" },
      { url: "/logo_notext.png?v=3", type: "image/png" },
    ],
    shortcut: "/logo.ico?v=3",
    apple: "/logo_notext.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "GeneralContractor"],
              name: "MarBel",
              image: "https://marbel.it/logo.png",
              logo: "https://marbel.it/logo.png",
              telephone: "02 12345678",
              email: "info@marbel.it",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Nazario Sauro 36",
                addressLocality: "Marcianise",
                addressRegion: "CE",
                postalCode: "81025",
                addressCountry: "IT",
              },
              areaServed: [
                "Marcianise",
                "Capodrise",
                "Caserta",
                "Napoli",
                "Campania",
                "Provincia di Caserta",
                "Provincia di Napoli",
              ],
              priceRange: "€€",
              openingHours: "Mo-Fr 09:00-18:00",
              url: "https://marbel.it",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Mostra CookieBanner solo se non siamo in /admin */}
        <CookieBannerConditional />
        {children}
      </body>
    </html>
  );
}
