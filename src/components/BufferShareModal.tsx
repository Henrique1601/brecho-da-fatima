"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Sparkles,
  Send
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { Product } from "@/types";
import { STORE_DATA } from "@/data/storeData";
import { formatBRL } from "@/lib/utils";

interface BufferShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BufferShareModal({ product, isOpen, onClose }: BufferShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  if (!isOpen || !product) return null;

  const caption = `🛍️ NOVIDADE NO BRECHÓ DA FÁTIMA! 🛍️

✨ ${product.title}
🏷️ Tamanho: ${product.size} | Condição: ${product.condition}
💰 Valor no Brechó: ${formatBRL(product.price)}

${product.description}

📲 Peça única exclusiva! Para reservar antes que acabe, mande um WhatsApp para a Dona Fátima no (13) 97404-7020 ou clique no link da bio!

📍 Brechó da Fátima - Rua Antonio Bento, 76 (Fundos) - Vila Mathias, Santos / SP
${STORE_DATA.instagram}

#brechodafatima #modasustentavel #brechosp #santos #garimpando #vintagebrasil #slowfashion #lookdodia #achados`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openBufferWeb = () => {
    const bufferUrl = `https://buffer.com/add?url=${encodeURIComponent(product.images[0] || '')}&text=${encodeURIComponent(caption)}`;
    window.open(bufferUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                Publicar no Instagram via Buffer
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Conta vinculada: <span className="font-semibold text-rose-500">{STORE_DATA.instagramHandle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com visualização da peça & legenda */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          
          <div className="flex gap-4 items-center p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold uppercase text-rose-500">Tam: {product.size}</span>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{product.title}</h4>
              <p className="text-xs font-black text-zinc-700 dark:text-zinc-300">{formatBRL(product.price)}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Legenda Formatada com Hashtags
              </label>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-500"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Legenda</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={caption}
              className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-mono resize-none focus:outline-none"
            />
          </div>

          {/* Dica do Buffer */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Ao clicar no botão abaixo, a peça e o texto serão carregados diretamente na sua fila do <strong>Buffer</strong> para agendamento inteligente no <strong>Instagram @brechodafatimaa</strong>.
            </p>
          </div>

        </div>

        {/* Rodapé de Ações */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
          <a
            href={STORE_DATA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-rose-600"
          >
            <Instagram className="w-4 h-4" />
            <span>Abrir Instagram</span>
          </a>

          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
            <button
              onClick={openBufferWeb}
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-md shadow-pink-500/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Agendar no Buffer</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
