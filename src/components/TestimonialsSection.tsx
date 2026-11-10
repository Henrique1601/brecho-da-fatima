"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";
import { STORE_DATA } from "@/data/storeData";
import { createWhatsAppLink } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  piece: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Camila Ribeiro",
    location: "Gonzaga, Santos",
    piece: "Jaqueta Jeans Vintage 90s",
    rating: 5,
    comment: "Gente, a peça veio impecável! Cheirosa, passada e parecendo que saiu de loja de shopping. A Dona Fátima me atendeu com todo carinho do mundo pelo WhatsApp. Já virei cliente fiel!",
    date: "Há 3 dias",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "2",
    name: "Mariana Alencar",
    location: "Vila Mathias, Santos",
    piece: "Vestido Midi Floral",
    rating: 5,
    comment: "Moro pertinho da loja na Antonio Bento e fui até os fundos experimentar. O atendimento é acolhedor demais, um café delicioso e garimpos que não acho em lugar nenhum da Baixada!",
    date: "Semana passada",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "3",
    name: "Lucas Mendonça",
    location: "Boqueirão, Santos",
    piece: "Camisa Linho Puro",
    rating: 5,
    comment: "Achado surreal de brechó. A camisa de linho estava praticamente nova e por menos de um terço do preço de loja. Paguei no Pix e a reserva foi na hora pelo WhatsApp.",
    date: "Há 2 semanas",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "4",
    name: "Renata Duarte",
    location: "Ponta da Praia, Santos",
    piece: "Blazer Tweed Alfaiataria",
    rating: 5,
    comment: "Estava procurando uma peça clássica de alfaiataria há meses. A curadoria da Dona Fátima tem muito bom gosto. As fotos do site mostram exatamente cada detalhe!",
    date: "Há 1 mês",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  }
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[current];

  return (
    <section className="w-full py-16 sm:py-20 bg-gradient-to-b from-transparent via-rose-50/40 to-transparent dark:via-rose-950/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Garimpadeiras de Santos & Região</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Quem Garimpa com a Dona Fátima Ama!
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Veja o que nossas clientes reais dizem sobre a experiência, o atendimento e o estado de conservação das peças.
          </p>
        </div>

        {/* Card de Depoimento em Destaque com Transição Fluida */}
        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="relative p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xl"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-rose-100 dark:text-rose-950/60 stroke-rose-200 dark:stroke-rose-900/40 pointer-events-none" />

              {/* Estrelas */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-zinc-400 ml-2">{t.date}</span>
              </div>

              {/* Texto do depoimento */}
              <p className="font-serif text-base sm:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed italic mb-6">
                "{t.comment}"
              </p>

              {/* Perfil da Cliente */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-rose-300 dark:border-rose-900"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.location}</p>
                    <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                      Garimpou: {t.piece}
                    </span>
                  </div>
                </div>

                <a
                  href={createWhatsAppLink(STORE_DATA.whatsapp, `Olá, Dona Fátima! Vi os depoimentos no site e também quero garimpar!`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Falar com Dona Fátima</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controles de Navegação */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === current ? "w-6 bg-rose-600" : "w-1.5 bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  aria-label={`Ir para depoimento ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-zinc-600 dark:text-zinc-300 transition-colors shadow-sm"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
