import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brechó da Fátima",
    short_name: "Brechó Fátima",
    description:
      "Marketplace moderno de moda sustentável, garimpos e curadoria vintage em Santos - SP.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#e11d48",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
