"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  RotateCw, 
  Heart, 
  Eye, 
  Share2 
} from "lucide-react";
import { Product } from "@/types";
import { STORE_DATA } from "@/data/storeData";
import { formatBRL, createWhatsAppLink } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onToggleSold: (id: string) => void;
  onOpenBufferShare: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export function ProductCard({
  product,
  onToggleSold,
  onOpenBufferShare,
  onSelectProduct,
  isFavorite,
  onToggleFavorite
}: ProductCardProps) {
  const isSold = product.status === "sold";
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`group relative flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border transition-all duration-300 ${
        isSold 
          ? "border-zinc-200 dark:border-zinc-800 opacity-75" 
          : "border-zinc-200/90 dark:border-zinc-800/90 hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-300 dark:hover:border-rose-900/60"
      }`}
    >
      {/* Imagem com Efeito 3D Tilt / Hover Zoom */}
      <div 
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes de ${product.title}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-inset"
        onClick={() => onSelectProduct(product)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectProduct(product);
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.images[currentImgIndex] || product.images[0] || "https://images.unsplash.com/photo-1544441893-675973e31985?w=600"}
          alt={product.title ? `${product.title} — Tamanho ${product.size}` : "Peça do Brechó da Fátima"}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered && !isSold ? "scale-108" : "scale-100"
          } ${isSold ? "grayscale contrast-75" : ""}`}
        />

        {/* Gradiente sutil para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" aria-hidden="true" />

        {/* Badge VENDIDA ou DISPONÍVEL */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 items-center">
          {isSold ? (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-900/90 text-zinc-100 border border-white/20 shadow-md">
              Vendido ✓
            </span>
          ) : (
            <>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600/95 text-white shadow-md">
                Disponível
              </span>
              {product.highlight && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/95 text-white flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" aria-hidden="true" /> Garimpo
                </span>
              )}
            </>
          )}
        </div>

        {/* Badge de Tamanho & Botão de Favoritar */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            aria-label={isFavorite ? `Remover ${product.title} dos favoritos` : `Salvar ${product.title} nos favoritos`}
            aria-pressed={isFavorite}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
              isFavorite
                ? "bg-rose-600 text-white scale-110"
                : "bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200 hover:text-rose-500 hover:scale-105"
            }`}
            title={isFavorite ? "Remover dos favoritos" : "Salvar nos favoritos"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} aria-hidden="true" />
          </button>
          <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md text-zinc-900 dark:text-zinc-100 border border-black/10 shadow-sm">
            Tam: {product.size}
          </span>
        </div>

        {/* Mini mini-galeria de fotos (dots) se tiver mais de 1 imagem */}
        {product.images.length > 1 && (
          <div 
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {product.images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentImgIndex(i)}
                className={`w-2 h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  i === currentImgIndex ? "bg-white w-4" : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ver foto ${i + 1} de ${product.images.length}`}
                aria-current={i === currentImgIndex ? "true" : undefined}
              />
            ))}
          </div>
        )}

        {/* Botão de visualização rápida em hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-xs font-bold text-zinc-900 dark:text-white shadow-xl">
            <Eye className="w-3.5 h-3.5" /> Ver Detalhes
          </span>
        </div>
      </div>

      {/* Conteúdo & Informações */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="capitalize font-semibold tracking-wide text-rose-600 dark:text-rose-400">
              {product.category}
            </span>
            <span>{product.condition}</span>
          </div>

          <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="text-left line-clamp-1 w-full cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              {product.title}
            </button>
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Bloco de Preço & Desconto */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
                {formatBRL(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatBRL(product.originalPrice)}
                </span>
              )}
            </div>

            {product.brand && (
              <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                {product.brand}
              </span>
            )}
          </div>
        </div>

        {/* Ações: Pedir no WhatsApp + Marcar Vendida + Buffer/Insta */}
        <div className="pt-2 space-y-2">
          {!isSold ? (
            <a
              href={createWhatsAppLink(STORE_DATA.whatsapp, product.title, product.price)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Comprar ${product.title} pelo WhatsApp`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Quero Comprar no WhatsApp</span>
            </a>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-semibold text-sm text-center">
              Peça Vendida no Brechó
            </div>
          )}

          {/* Botões Administrativos do Brechó: Alternar Vendido e Buffer */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleSold(product.id)}
              aria-pressed={isSold}
              aria-label={isSold ? `Reativar peça ${product.title}` : `Marcar ${product.title} como vendida`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                isSold
                  ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                  : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100"
              }`}
              title={isSold ? "Marcar novamente como disponível" : "Marcar como vendida"}
            >
              {isSold ? (
                <>
                  <RotateCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reativar Peça</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                  <span>Marcar Vendida</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onOpenBufferShare(product)}
              aria-label={`Compartilhar ${product.title} no Instagram via Buffer`}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Postar ou Agendar no Instagram via Buffer"
            >
              <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Buffer / Insta</span>
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
