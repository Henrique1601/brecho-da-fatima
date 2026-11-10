"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowUpRight } from "lucide-react";
import { STORE_DATA } from "@/data/storeData";
import { createWhatsAppLink } from "@/lib/utils";

const SLIDES = [
  {
    badge: "Curadoria Exclusiva • Dona Fátima",
    title: "Moda com Alma, Estilo & Sustentabilidade",
    subtitle: "Peças vintage selecionadas a dedo em Praia Grande/SP. Garimpe roupas únicas com qualidade de loja grande e preços de brechó.",
    cta: "Explorar Garimpo",
    tagline: "Sem intermediários • Fale direto no Zap",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-rose-950/90 via-zinc-950/80 to-transparent"
  },
  {
    badge: "Novidades da Semana",
    title: "Tamanhos do PP ao Plus Size & Roupas Masculinas",
    subtitle: "Acervo renovado semanalmente com alfaiataria, jeans retrô, blusas de seda e calçados em ótimo estado.",
    cta: "Ver Categorias",
    tagline: "100% Peças Originais Higienizadas",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-amber-950/90 via-zinc-950/80 to-transparent"
  },
  {
    badge: "Visite Nossa Loja Física",
    title: "Venha experimentar e tomar um café com a gente!",
    subtitle: "Atendimento caloroso, provador aconchegante e localização privilegiada no litoral.",
    cta: "Como Chegar",
    tagline: "WhatsApp: (13) 97404-7020",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80",
    gradient: "from-emerald-950/90 via-zinc-950/80 to-transparent"
  }
];

interface HeroBannerProps {
  onScrollToProducts: () => void;
  onOpenLocation: () => void;
}

export function HeroBanner({ onScrollToProducts, onOpenLocation }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] overflow-hidden bg-zinc-950 text-white select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background image com overlay cinematográfico */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-950/40 to-zinc-950" />
        </motion.div>
      </AnimatePresence>

      {/* Conteúdo sobreposto */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          
          <motion.div
            key={`badge-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{slide.badge}</span>
          </motion.div>

          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            {slide.title}
          </motion.h1>

          <motion.p
            key={`desc-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm sm:text-lg text-zinc-300 leading-relaxed max-w-xl"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              onClick={current === 2 ? onOpenLocation : onScrollToProducts}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 font-semibold text-sm sm:text-base text-white shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <span>{slide.cta}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href={createWhatsAppLink(STORE_DATA.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-emerald-600/90 hover:bg-emerald-600 backdrop-blur-md border border-white/20 text-sm sm:text-base font-semibold text-white transition-all hover:border-emerald-400"
            >
              <span>Chamar Dona Fátima</span>
            </a>
          </motion.div>

          <div className="pt-2 text-xs text-zinc-400 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-rose-400" />
            <span>{slide.tagline}</span>
          </div>

        </div>
      </div>

      {/* Controles de navegação do carrossel */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-colors"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 transition-colors"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicadores de slides */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? "w-8 bg-rose-500" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
