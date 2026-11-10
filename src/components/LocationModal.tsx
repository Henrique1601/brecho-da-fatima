"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  ExternalLink,
  Store,
  CheckCircle2
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { STORE_DATA } from "@/data/storeData";
import { createWhatsAppLink } from "@/lib/utils";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                Onde Fica o Brechó da Fátima
              </h3>
              <p className="text-xs text-zinc-500">Venha nos fazer uma visita e garimpar ao vivo!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mapa Interativo Embed */}
        <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-800 relative">
          <iframe
            title="Localização Brechó da Fátima"
            src={STORE_DATA.address.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[20%] contrast-110"
          />
          <div className="absolute top-3 right-3">
            <a
              href={STORE_DATA.address.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-zinc-900/95 text-xs font-bold text-zinc-800 dark:text-zinc-100 shadow-md hover:text-rose-600 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-rose-500" />
              <span>Abrir no GPS / Maps</span>
            </a>
          </div>
        </div>

        {/* Informações de Endereço e Horários */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <Store className="w-4 h-4" />
                <span>Endereço da Loja</span>
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                {STORE_DATA.address.street}
              </p>
              <p className="text-xs text-zinc-500">
                {STORE_DATA.address.neighborhood} • {STORE_DATA.address.city} - {STORE_DATA.address.state}
              </p>
              <p className="text-xs text-zinc-400">
                Ref: {STORE_DATA.address.reference}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Horário de Funcionamento</span>
              </div>
              <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {STORE_DATA.openingHours.weekdays}
              </p>
              <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {STORE_DATA.openingHours.saturday}
              </p>
              <p className="text-xs text-zinc-500">
                {STORE_DATA.openingHours.sunday}
              </p>
            </div>

          </div>

          {/* Botões de Contato Rápido */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={createWhatsAppLink(STORE_DATA.whatsapp, "Como chegar ao brechó")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <Phone className="w-4 h-4" />
              <span>Chamar no Zap: {STORE_DATA.whatsappFormatted}</span>
            </a>

            <a
              href={STORE_DATA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold text-sm text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>Instagram</span>
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
