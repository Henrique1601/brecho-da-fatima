"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  MessageCircle, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  Tag, 
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Product } from "@/types";
import { STORE_DATA } from "@/data/storeData";
import { formatBRL, createWhatsAppLink } from "@/lib/utils";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleSold: (id: string) => void;
  onOpenBuffer: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onToggleSold,
  onOpenBuffer,
  isFavorite,
  onToggleFavorite
}: ProductDetailModalProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!isOpen || !product) return null;

  const isSold = product.status === "sold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-auto"
      >
        {/* Botões do Topo: Favoritar e Fechar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(product)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
              isFavorite
                ? "bg-rose-600 text-white scale-105"
                : "bg-black/50 hover:bg-black/80 text-white"
            }`}
            title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Lado Esquerdo: Galeria com Foto Principal e Thumbnails */}
          <div className="relative bg-zinc-950 flex flex-col justify-center min-h-[380px] sm:min-h-[480px]">
            <img
              src={product.images[activeImgIndex] || product.images[0]}
              alt={product.title}
              className={`w-full h-full max-h-[520px] object-contain transition-all duration-300 ${
                isSold ? "grayscale contrast-75" : ""
              }`}
            />

            {/* Badges sobre a foto */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {isSold ? (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-zinc-900/90 text-white border border-white/20">
                  Peça Vendida ✓
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-600 text-white shadow-md">
                  Disponível para Compra
                </span>
              )}
            </div>

            {/* Navegação se tiver mais imagens */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 backdrop-blur-md">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImgIndex ? "border-rose-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lado Direito: Informações e Ações Diretas */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span className="uppercase tracking-wider">Brechó da Fátima • Curadoria</span>
                <span className="bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-800">
                  {product.category}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white leading-snug">
                {product.title}
              </h2>

              {/* Preço e Oferta */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-zinc-950 dark:text-white">
                  {formatBRL(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatBRL(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  Economia Sustentável
                </span>
              </div>

              {/* Especificações em Grid */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-zinc-100 dark:border-zinc-800 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-zinc-400 block font-medium">Tamanho</span>
                  <span className="text-zinc-900 dark:text-white font-bold text-sm">{product.size}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                  <span className="text-zinc-400 block font-medium">Condição</span>
                  <span className="text-zinc-900 dark:text-white font-bold text-sm truncate">{product.condition}</span>
                </div>
                {product.brand && (
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-zinc-400 block font-medium">Marca</span>
                    <span className="text-zinc-900 dark:text-white font-bold text-sm">{product.brand}</span>
                  </div>
                )}
                {product.color && (
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-zinc-400 block font-medium">Cor</span>
                    <span className="text-zinc-900 dark:text-white font-bold text-sm">{product.color}</span>
                  </div>
                )}
              </div>

              {/* Descrição Detalhada */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  História & Detalhes da Peça
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Tabela de Medidas e Dúvidas com Dona Fátima */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">
                    📏 Dúvida com o caimento ou medidas exatas?
                  </span>
                  <span className="text-amber-800/80 dark:text-amber-400">
                    A Dona Fátima mede com fita métrica agora mesmo pra você!
                  </span>
                </div>
                <a
                  href={createWhatsAppLink(STORE_DATA.whatsapp, `Gostaria de ver as medidas em centímetros da peça: ${product.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold whitespace-nowrap shadow-sm"
                >
                  Pedir Medidas no Zap
                </a>
              </div>

              {/* Selo de Garantia do Brechó */}
              <div className="flex items-center gap-2.5 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/30 p-3 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Todas as peças passam por curadoria minuciosa e higienização completa antes de entrar no catálogo.</span>
              </div>
            </div>

            {/* Ações Principais */}
            <div className="space-y-3 pt-3">
              {!isSold ? (
                <a
                  href={createWhatsAppLink(STORE_DATA.whatsapp, product.title, product.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 active:scale-98 transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Negociar / Reservar no WhatsApp</span>
                </a>
              ) : (
                <div className="w-full py-3.5 px-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold text-center">
                  Esta peça já foi vendida
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => onToggleSold(product.id)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {isSold ? "Marcar como Disponível" : "Marcar como Vendida"}
                </button>
                <button
                  onClick={() => onOpenBuffer(product)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Buffer / Instagram</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </motion.div>
    </div>
  );
}
