"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { ProductCard } from "@/components/ProductCard";
import { SidebarFilter } from "@/components/SidebarFilter";
import { AddProductModal } from "@/components/AddProductModal";
import { BufferShareModal } from "@/components/BufferShareModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { LocationModal } from "@/components/LocationModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { INITIAL_PRODUCTS, STORE_DATA } from "@/data/storeData";
import { Product } from "@/types";
import { Sparkles, Search, SlidersHorizontal, RefreshCw } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>("all");
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>("none");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [bufferProduct, setBufferProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Carregar do localStorage se existir salvamento prévio
  useEffect(() => {
    try {
      const saved = localStorage.getItem("brecho_fatima_products");
      if (saved) {
        setProducts(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Erro ao ler localStorage", e);
    }
  }, []);

  // Salvar no localStorage a cada alteração
  const saveProducts = (newProds: Product[]) => {
    setProducts(newProds);
    try {
      localStorage.setItem("brecho_fatima_products", JSON.stringify(newProds));
    } catch (e) {
      console.error("Erro ao salvar localStorage", e);
    }
  };

  // Alternar produto vendido/disponível
  const handleToggleSold = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: (p.status === "available" ? "sold" : "available") as 'available' | 'sold'
        };
      }
      return p;
    });
    saveProducts(updated);

    // Se estiver no modal detalhado, atualiza também
    if (detailProduct && detailProduct.id === id) {
      setDetailProduct((prev) => prev ? {
        ...prev,
        status: (prev.status === "available" ? "sold" : "available") as 'available' | 'sold'
      } : null);
    }
  };

  // Adicionar novo produto
  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  // Filtros combinados e ordenação
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Categoria
        if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
        // Tamanho
        if (selectedSize && p.size.toLowerCase() !== selectedSize.toLowerCase()) return false;
        // Status
        if (statusFilter === "available" && p.status !== "available") return false;
        if (statusFilter === "sold" && p.status !== "sold") return false;
        // Busca textual
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBrand) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (priceSort === "asc") return a.price - b.price;
        if (priceSort === "desc") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategory, selectedSize, statusFilter, priceSort, searchQuery]);

  const counts = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.status === "available").length;
    const sold = total - available;
    return { total, available, sold };
  }, [products]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSize("");
    setStatusFilter("all");
    setPriceSort("none");
    setSearchQuery("");
  };

  const scrollToProducts = () => {
    const el = document.getElementById("vitrine-produtos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      
      {/* Barra de Navegação Superior */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        favoritesCount={0}
      />

      {/* Hero Carrossel Cinemático */}
      <HeroBanner
        onScrollToProducts={scrollToProducts}
        onOpenLocation={() => setIsLocationModalOpen(true)}
      />

      {/* Seção Principal de Marketplace & Catálogo */}
      <main id="vitrine-produtos" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        {/* Barra de Busca & Controles Rápidos */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <span>Garimpos em Destaque</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                {filteredProducts.length} peças
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Catálogo em tempo real • Sem intermediários de pagamento • Negocie e reserve direto pelo WhatsApp
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por peça, marca ou cor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
              />
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
              title="Abrir Filtros"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Layout com Sidebar Recolhível + Grid de Produtos Tipo Nike/Adidas */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Sidebar Lateral com Filtros & Tamanhos */}
          <SidebarFilter
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            statusFilter={statusFilter}
            onSelectStatus={setStatusFilter}
            priceSort={priceSort}
            onSelectPriceSort={setPriceSort}
            onResetFilters={handleResetFilters}
            counts={counts}
          />

          {/* Grid de Cards de Produtos */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 p-8">
                <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                  Nenhuma peça encontrada com estes filtros.
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Tente limpar a pesquisa ou selecionar outra categoria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-5 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs"
                >
                  Restaurar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onToggleSold={handleToggleSold}
                    onOpenBufferShare={(p) => setBufferProduct(p)}
                    onSelectProduct={(p) => setDetailProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Botão Flutuante do WhatsApp */}
      <FloatingWhatsApp />

      {/* Rodapé Moderno */}
      <Footer onOpenLocation={() => setIsLocationModalOpen(true)} />

      {/* Modal: Cadastro com Drag & Drop e IA */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Modal: Publicar no Instagram via Buffer */}
      <BufferShareModal
        product={bufferProduct}
        isOpen={!!bufferProduct}
        onClose={() => setBufferProduct(null)}
      />

      {/* Modal: Detalhes Rápidos da Peça */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        onToggleSold={handleToggleSold}
        onOpenBuffer={(p) => {
          setDetailProduct(null);
          setBufferProduct(p);
        }}
      />

      {/* Modal: Localização e Rotas da Loja */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

    </div>
  );
}
