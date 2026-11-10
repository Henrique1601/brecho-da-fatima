"use client";

import React from "react";
import { 
  Heart, 
  Phone, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Recycle, 
  ArrowUp 
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { STORE_DATA } from "@/data/storeData";
import { createWhatsAppLink } from "@/lib/utils";

interface FooterProps {
  onOpenLocation: () => void;
}

export function Footer({ onOpenLocation }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Banner de Destaques de Confiança */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-12 mb-12 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Moda Sustentável</h4>
              <p className="text-xs text-zinc-500">Dando uma nova vida a roupas e calçados exclusivos.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Curadoria Dona Fátima</h4>
              <p className="text-xs text-zinc-500">Peças selecionadas uma a uma com muito amor e carinho.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">100% Higienizadas</h4>
              <p className="text-xs text-zinc-500">Prontas para vestir logo após a retirada ou entrega.</p>
            </div>
          </div>
        </div>

        {/* Informações da Loja */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-black text-rose-600">Brechó da Fátima</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
              O seu marketplace de moda circular e vintage no litoral. Peças únicas, preços justos e compra direta e humana pelo WhatsApp sem burocracia de carrinhos demorados.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={STORE_DATA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-pink-600 hover:scale-110 transition-transform shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={createWhatsAppLink(STORE_DATA.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-emerald-600 hover:scale-110 transition-transform shadow-sm"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Atendimento & Zap</h5>
            <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li className="font-semibold text-zinc-800 dark:text-zinc-200">{STORE_DATA.whatsappFormatted}</li>
              <li>{STORE_DATA.openingHours.weekdays}</li>
              <li>{STORE_DATA.openingHours.saturday}</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-sm text-zinc-900 dark:text-white mb-3">Loja Física</h5>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
              {STORE_DATA.address.street} - {STORE_DATA.address.city}/{STORE_DATA.address.state}
            </p>
            <button
              onClick={onOpenLocation}
              className="text-xs font-bold text-rose-600 hover:text-rose-500 underline"
            >
              Ver mapa e rotas &rarr;
            </button>
          </div>

        </div>

        {/* Rodapé Final */}
        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para o Brechó da Fátima • Praia Grande / SP
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
