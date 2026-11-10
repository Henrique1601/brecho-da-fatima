"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { STORE_DATA } from "@/data/storeData";
import { createWhatsAppLink } from "@/lib/utils";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Balão de Ajuda Flutuante */}
      {showTooltip && (
        <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-[240px] text-xs animate-bounce">
          <p className="text-zinc-800 dark:text-zinc-200 font-medium">
            Dúvidas ou quer reservar uma peça? Fale direto com a <strong>Dona Fátima</strong>!
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botão Principal do WhatsApp */}
      <a
        href={createWhatsAppLink(STORE_DATA.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-95 transition-all"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-300 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline">Comprar no WhatsApp</span>
      </a>
    </div>
  );
}
