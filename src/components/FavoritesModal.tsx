"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Heart, MessageCircle, Trash2, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { STORE_DATA } from "@/data/storeData";
import { formatBRL } from "@/lib/utils";

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (id: string) => void;
  onClearFavorites: () => void;
  onSelectProduct: (p: Product) => void;
}

export function FavoritesModal({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onSelectProduct
}: FavoritesModalProps) {
  if (!isOpen) return null;

  const totalValue = favorites.reduce((acc, curr) => acc + curr.price, 0);

  // Link para o WhatsApp com todos os itens favoritados
  const buildWhatsAppMessage = () => {
    let msg = `Olá, Dona Fátima! Tudo bem? Garimpei *${favorites.length} peça(s)* no Brechó da Fátima e quero reservar:\n\n`;
    favorites.forEach((p, idx) => {
      msg += `${idx + 1}. *${p.title}* - Tam: ${p.size} (${formatBRL(p.price)})\n`;
    });
    msg += `\n💰 *Total:* ${formatBRL(totalValue)}`;
    msg += `\n\nElas ainda estão disponíveis para eu fechar agora?`;
    return `https://wa.me/${STORE_DATA.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                Minha Sacola de Favoritos
              </h3>
              <p className="text-xs text-zinc-500">
                {favorites.length} peça(s) salva(s) para negociar
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

        {/* Lista de Favoritos */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto stroke-zinc-300 dark:stroke-zinc-700" />
              <p className="text-sm font-medium">Você ainda não favoritou nenhuma peça.</p>
              <p className="text-xs text-zinc-500">Clique no coraçãozinho nos cards para salvar seus garimpos preferidos!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.title}
                    className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-rose-500 uppercase">Tam: {prod.size}</span>
                    <h4 
                      onClick={() => {
                        onClose();
                        onSelectProduct(prod);
                      }}
                      className="font-bold text-sm text-zinc-900 dark:text-white truncate cursor-pointer hover:text-rose-600 transition-colors"
                    >
                      {prod.title}
                    </h4>
                    <p className="text-xs font-black text-zinc-800 dark:text-zinc-200">{formatBRL(prod.price)}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFavorite(prod.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                    title="Remover dos favoritos"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé com Total e Ação WhatsApp Agrupada */}
        {favorites.length > 0 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500">Valor Total Estimado:</span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">
                {formatBRL(totalValue)}
              </span>
            </div>

            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-98 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Todos para Dona Fátima no Zap</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="flex justify-between items-center pt-1">
              <button
                onClick={onClearFavorites}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Limpar lista
              </button>
              <span className="text-[11px] text-zinc-400">
                Peças únicas sob consulta de disponibilidade
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
