import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Navbar and Footer moved to (public)/layout.tsx
// import AdminMenu from "./components/AdminMenu";
// import { usePathname } from "next/navigation";
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarBel - Impresa Edile",
  description:
    "Impresa edile specializzata in costruzioni chiavi in mano, ristrutturazioni e progettazione personalizzata a Caserta, Napoli, Campania e provincia. Servizi entro 35km dalla sede.",
  icons: {
    icon: "../public/logo.png",
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
              "@type": "LocalBusiness",
              name: "MarBel - Impresa Edile Caserta Napoli Campania",
              image: "/logo.png",
              telephone: "02 12345678",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Via Nazzaro Sauro 36",
                addressLocality: "Marcianise",
                addressRegion: "CE",
                postalCode: "81025",
                addressCountry: "IT",
              },
              areaServed: [
                "Caserta",
                "Napoli",
                "Campania",
                "Provincia di Caserta",
                "Provincia di Napoli",
              ],
              url: "https://marbel.it",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookieBanner />
        {children}
      </body>
    </html>
  );
}
