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
  title: "Brechó da Fátima | Marketplace & Curadoria Vintage",
  description: "Marketplace moderno de moda sustentável, roupas femininas, masculinas, vintage e calçados exclusivos em Santos - SP. Reserve direto pelo WhatsApp!",
  openGraph: {
    title: "Brechó da Fátima | Garimpos e Moda Circular",
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
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-rose-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
