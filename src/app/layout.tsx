import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brechó da Fátima | Marketplace & Curadoria Vintage em Santos",
  description: "Marketplace moderno de moda sustentável, roupas femininas, masculinas, vintage e calçados exclusivos em Santos - SP (Rua Antonio Bento, 76 - Vila Mathias). Reserve direto pelo WhatsApp!",
  keywords: [
    "brechó em santos",
    "brechó da fátima",
    "moda sustentável santos",
    "roupas vintage santos",
    "garimpo santos sp",
    "vila mathias brecho",
    "brecho baixada santista"
  ],
  openGraph: {
    title: "Brechó da Fátima | Garimpos e Moda Circular em Santos",
    description: "Peças selecionadas a dedo por Dona Fátima. Marque sua peça favorita e chame direto no WhatsApp (13) 97404-7020.",
    images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "Brechó da Fátima",
              "image": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200",
              "telephone": "+55-13-97404-7020",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua Antonio Bento, 76 - Fundos",
                "addressLocality": "Santos",
                "addressRegion": "SP",
                "postalCode": "11075-260",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -23.9522961,
                "longitude": -46.3312984
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Saturday",
                  "opens": "09:00",
                  "closes": "16:00"
                }
              ],
              "priceRange": "R$ 20 - R$ 150"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-rose-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
