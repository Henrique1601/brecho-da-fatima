"use client";

import React from "react";
import { ShieldCheck, Package, CheckCircle2, Tag, LogOut } from "lucide-react";
import { Product } from "@/types";
import { formatBRL } from "@/lib/utils";

interface AdminStatsBarProps {
  products: Product[];
  onLockAdmin?: () => void;
  onExitAdmin?: () => void;
}

export function AdminStatsBar({
  products,
  onLockAdmin,
  onExitAdmin,
}: AdminStatsBarProps) {
  const totalCount = products.length;
  const availableProducts = products.filter((p) => p.status === "available");
  const availableCount = availableProducts.length;
  const soldCount = totalCount - availableCount;
  const availableInventoryValue = availableProducts.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const handleExit = () => {
    if (onLockAdmin) {
      onLockAdmin();
    } else if (onExitAdmin) {
      onExitAdmin();
    }
  };

  return (
    <section
      aria-label="Resumo administrativo do estoque"
      className="w-full rounded-2xl bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xl border border-rose-200/80 dark:border-rose-900/50 shadow-lg shadow-rose-500/5 px-4 py-3"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Modo Admin
          </span>

          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 font-medium">
              <Package className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
              <span>Total:</span>
              <strong className="font-bold text-zinc-950 dark:text-white">{totalCount}</strong>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Disponíveis:</span>
              <strong className="font-bold">{availableCount}</strong>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 font-medium">
              <Tag className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
              <span>Vendidas:</span>
              <strong className="font-bold text-zinc-900 dark:text-white">{soldCount}</strong>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60 font-medium">
              <span>Estoque disponível:</span>
              <strong className="font-bold">{formatBRL(availableInventoryValue)}</strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExit}
          aria-label="Sair do modo administrador"
          className="self-start lg:self-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Sair do Admin</span>
        </button>
      </div>
    </section>
  );
}
