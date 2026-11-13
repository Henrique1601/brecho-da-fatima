"use client";

import React from "react";
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  SlidersHorizontal
} from "lucide-react";

interface SidebarFilterProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  statusFilter: 'all' | 'available' | 'sold';
  onSelectStatus: (status: 'all' | 'available' | 'sold') => void;
  priceSort: 'none' | 'asc' | 'desc';
  onSelectPriceSort: (sort: 'none' | 'asc' | 'desc') => void;
  maxPriceSlider: number;
  onChangeMaxPriceSlider: (price: number) => void;
  onResetFilters: () => void;
  counts: {
    total: number;
    available: number;
    sold: number;
  };
}

const CATEGORIES = [
  { id: "all", label: "Todas as Peças", emoji: "✨" },
  { id: "feminino", label: "Feminino", emoji: "👗" },
  { id: "masculino", label: "Masculino", emoji: "👕" },
  { id: "vintage", label: "Vintage & Raros", emoji: "🕰️" },
  { id: "calcados", label: "Calçados & Tênis", emoji: "👟" },
  { id: "acessorios", label: "Bolsas & Acessórios", emoji: "👜" },
  { id: "infantil", label: "Infantil", emoji: "🧸" }
];

const SIZES = ["Todos", "PP", "P", "M", "G", "GG", "Plus Size", "37", "38", "39", "40", "41", "42", "Único"];

export function SidebarFilter({
  isOpen,
  onToggle,
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  statusFilter,
  onSelectStatus,
  priceSort,
  onSelectPriceSort,
  maxPriceSlider,
  onChangeMaxPriceSlider,
  onResetFilters,
  counts
}: SidebarFilterProps) {
  return (
    <aside 
      aria-label="Filtros de produtos"
      className={`transition-all duration-300 ease-in-out shrink-0 ${
        isOpen ? "w-full lg:w-72" : "w-full lg:w-16"
      }`}
    >
      <div className="sticky top-24 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-sm space-y-6">
        
        {/* Topo da Sidebar com botão de Recolher/Expandir */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            {isOpen && (
              <span className="font-serif font-bold text-zinc-900 dark:text-white text-base">
                Filtros & Navegação
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isOpen ? "Recolher barra lateral de filtros" : "Expandir barra lateral de filtros"}
            aria-expanded={isOpen}
            className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title={isOpen ? "Recolher barra lateral" : "Expandir barra lateral"}
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" aria-hidden="true" /> : <ChevronRight className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>

        {/* Se a sidebar estiver recolhida em desktop, mostra ícones rápidos */}
        {!isOpen ? (
          <div className="hidden lg:flex flex-col items-center gap-4 py-2">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expandir barra lateral de filtros"
              aria-expanded={false}
              className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Expandir filtros"
            >
              <Filter className="w-5 h-5" aria-hidden="true" />
            </button>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider [writing-mode:vertical-rl] rotate-180">
              Categorias & Tamanhos
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Status da Peça (Todas / Apenas Disponíveis / Já Vendidas) */}
            <div role="group" aria-labelledby="sidebar-status-heading">
              <span id="sidebar-status-heading" className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                Status da Peça
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onSelectStatus('all')}
                  aria-pressed={statusFilter === 'all'}
                  className={`py-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                    statusFilter === 'all' 
                      ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm font-bold" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Todas ({counts.total})
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStatus('available')}
                  aria-pressed={statusFilter === 'available'}
                  className={`py-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                    statusFilter === 'available' 
                      ? "bg-emerald-600 text-white shadow-sm font-bold" 
                      : "text-zinc-500 hover:text-emerald-600"
                  }`}
                >
                  Disponível ({counts.available})
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStatus('sold')}
                  aria-pressed={statusFilter === 'sold'}
                  className={`py-2 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                    statusFilter === 'sold' 
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm font-bold" 
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  Vendidas ({counts.sold})
                </button>
              </div>
            </div>

            {/* Categorias de Peças */}
            <div role="group" aria-labelledby="sidebar-categories-heading">
              <span id="sidebar-categories-heading" className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                Departamentos
              </span>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.id)}
                      aria-pressed={isSelected}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                        isSelected
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/60"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span aria-hidden="true">{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-rose-600" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro por Tamanhos */}
            <div role="group" aria-labelledby="sidebar-sizes-heading">
              <span id="sidebar-sizes-heading" className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                Tamanhos
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((size) => {
                  const isSelected = (size === "Todos" && selectedSize === "") || selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSelectSize(size === "Todos" ? "" : size)}
                      aria-pressed={isSelected}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                        isSelected
                          ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm"
                          : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filtro por Faixa de Preço Deslizante (Slider) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="sidebar-max-price" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Preço Máximo
                </label>
                <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">
                  {maxPriceSlider >= 300 ? "Todos os preços" : `Até R$ ${maxPriceSlider}`}
                </span>
              </div>
              <input
                id="sidebar-max-price"
                type="range"
                min="30"
                max="300"
                step="10"
                value={maxPriceSlider}
                onChange={(e) => onChangeMaxPriceSlider(Number(e.target.value))}
                aria-valuetext={maxPriceSlider >= 300 ? "Todos os preços" : `Até R$ ${maxPriceSlider}`}
                className="w-full accent-rose-600 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1" aria-hidden="true">
                <span>R$ 30</span>
                <span>R$ 150</span>
                <span>R$ 300+</span>
              </div>
            </div>

            {/* Ordenação por Preço */}
            <div>
              <label htmlFor="sidebar-price-sort" className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                Ordenar Preço
              </label>
              <select
                id="sidebar-price-sort"
                value={priceSort}
                onChange={(e) => onSelectPriceSort(e.target.value as 'none' | 'asc' | 'desc')}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="none">Destaques & Recentes</option>
                <option value="asc">Menor Preço primeiro</option>
                <option value="desc">Maior Preço primeiro</option>
              </select>
            </div>

            {/* Botão Limpar Filtros */}
            <button
              type="button"
              onClick={onResetFilters}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Limpar todos os filtros</span>
            </button>

          </div>
        )}

      </div>
    </aside>
  );
}
