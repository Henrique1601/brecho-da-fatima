"use client";

import React, { useState, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { StoriesBar } from "@/components/StoriesBar";
import { ProductCard } from "@/components/ProductCard";
import { SidebarFilter } from "@/components/SidebarFilter";
import { AddProductModal } from "@/components/AddProductModal";
import { BufferShareModal } from "@/components/BufferShareModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { LocationModal } from "@/components/LocationModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { AdminPinModal } from "@/components/AdminPinModal";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { INITIAL_PRODUCTS, STORE_DATA } from "@/data/storeData";
import { Product } from "@/types";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { BackupModal } from "@/components/BackupModal";
import { Sparkles, Search, SlidersHorizontal, Heart, ShieldAlert, Check, Mic, MicOff } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>("all");
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>("none");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Controle de Administrador (PIN da Dona Fátima)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [maxPriceSlider, setMaxPriceSlider] = useState<number>(300);
  const [pinActionCallback, setPinActionCallback] = useState<(() => void) | null>(null);

  // Modais
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [bufferProduct, setBufferProduct] = useState<Product | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const savedProds = localStorage.getItem("brecho_fatima_products");
      if (savedProds) setProducts(JSON.parse(savedProds));

      const savedFavs = localStorage.getItem("brecho_fatima_favorites");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      const savedAdmin = localStorage.getItem("brecho_fatima_admin");
      if (savedAdmin === "true") setIsAdminUnlocked(true);
    } catch (e) {
      console.error("Erro ao carregar dados locais", e);
    }
  }, []);

  const saveProducts = (newProds: Product[]) => {
    setProducts(newProds);
    try {
      localStorage.setItem("brecho_fatima_products", JSON.stringify(newProds));
    } catch (e) {
      console.error(e);
    }
  };

  const saveFavorites = (newFavs: Product[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem("brecho_fatima_favorites", JSON.stringify(newFavs));
    } catch (e) {
      console.error(e);
    }
  };

  // Favoritar / Desfavoritar
  const handleToggleFavorite = (product: Product) => {
    const exists = favorites.some((f) => f.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = favorites.filter((f) => f.id !== product.id);
    } else {
      updated = [...favorites, product];
      // Efeito de confete ao favoritar
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#f43f5e', '#fb7185', '#fda4af']
        });
      } catch (e) {}
    }
    saveFavorites(updated);
  };

  // Alternar produto vendido/disponível com verificação de PIN
  const handleToggleSold = (id: string) => {
    if (!isAdminUnlocked) {
      setPinActionCallback(() => () => executeToggleSold(id));
      setIsPinModalOpen(true);
      return;
    }
    executeToggleSold(id);
  };

  const executeToggleSold = (id: string) => {
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

    if (detailProduct && detailProduct.id === id) {
      setDetailProduct((prev) => prev ? {
        ...prev,
        status: (prev.status === "available" ? "sold" : "available") as 'available' | 'sold'
      } : null);
    }
  };

  // Abertura do Modal de Adicionar Peça com checagem de PIN
  const handleOpenAddModal = () => {
    if (!isAdminUnlocked) {
      setPinActionCallback(() => () => setIsAddModalOpen(true));
      setIsPinModalOpen(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  // Adicionar novo produto
  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveProducts(updated);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Filtros combinados
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
        if (selectedSize && p.size.toLowerCase() !== selectedSize.toLowerCase()) return false;
        if (statusFilter === "available" && p.status !== "available") return false;
        if (statusFilter === "sold" && p.status !== "sold") return false;
        if (maxPrice !== null && p.price > maxPrice) return false;
        if (maxPriceSlider < 300 && p.price > maxPriceSlider) return false;
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
  }, [products, selectedCategory, selectedSize, statusFilter, priceSort, maxPrice, searchQuery]);

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
    setMaxPrice(null);
    setMaxPriceSlider(300);
    setSearchQuery("");
  };

  const scrollToProducts = () => {
    const el = document.getElementById("vitrine-produtos");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Busca por Voz nativa Web Speech API
  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Seu navegador não suporta busca por voz. Experimente no Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListeningVoice(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListeningVoice(false);
      scrollToProducts();
    };

    recognition.onerror = () => {
      setIsListeningVoice(false);
    };

    recognition.onend = () => {
      setIsListeningVoice(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      
      {/* Barra de Navegação Superior */}
      <Navbar
        onOpenAddModal={handleOpenAddModal}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onToggleAdmin={() => {
          if (isAdminUnlocked) {
            setIsAdminUnlocked(false);
            localStorage.removeItem("brecho_fatima_admin");
          } else {
            setIsPinModalOpen(true);
          }
        }}
      />

      {/* Hero Carrossel Cinemático */}
      <HeroBanner
        onScrollToProducts={scrollToProducts}
        onOpenLocation={() => setIsLocationModalOpen(true)}
      />

      {/* Barra de Stories Circulares Modernos */}
      <StoriesBar
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setMaxPrice(null);
          scrollToProducts();
        }}
        onFilterUnder50={() => {
          setMaxPrice(50);
          scrollToProducts();
        }}
        onOpenLocation={() => setIsLocationModalOpen(true)}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Seção Principal de Marketplace */}
      <main id="vitrine-produtos" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Barra de Busca & Controles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <span>Garimpos em Destaque</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                {filteredProducts.length} peças
              </span>
              {maxPrice && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Filtro: Até R$ {maxPrice}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Catálogo em tempo real • Santos/SP • Negocie direto pelo WhatsApp da Dona Fátima
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isListeningVoice ? "Ouvindo... Fale o nome da peça..." : "Buscar por peça, marca ou cor..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-10 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm transition-all ${
                  isListeningVoice ? "border-rose-500 ring-2 ring-rose-300 dark:ring-rose-900 animate-pulse" : "border-zinc-200 dark:border-zinc-800"
                }`}
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors ${
                  isListeningVoice ? "text-rose-600 bg-rose-50 dark:bg-rose-950/60" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
                title="Buscar falando no microfone"
              >
                <Mic className={`w-4 h-4 ${isListeningVoice ? "animate-bounce" : ""}`} />
              </button>
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

        {/* Layout com Sidebar + Grid de Produtos */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          <SidebarFilter
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setMaxPrice(null);
            }}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            statusFilter={statusFilter}
            onSelectStatus={setStatusFilter}
            priceSort={priceSort}
            onSelectPriceSort={setPriceSort}
            maxPriceSlider={maxPriceSlider}
            onChangeMaxPriceSlider={setMaxPriceSlider}
            onResetFilters={handleResetFilters}
            counts={counts}
          />

          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 p-8">
                <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300">
                  Nenhuma peça encontrada com estes filtros.
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
                    isFavorite={favorites.some((f) => f.id === product.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Seção de Depoimentos de Clientes Reais de Santos */}
      <TestimonialsSection />

      <FloatingWhatsApp />
      <Footer onOpenLocation={() => setIsLocationModalOpen(true)} />

      {/* Modais */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <BufferShareModal
        product={bufferProduct}
        isOpen={!!bufferProduct}
        onClose={() => setBufferProduct(null)}
      />

      <ProductDetailModal
        product={detailProduct}
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        onToggleSold={handleToggleSold}
        onOpenBuffer={(p) => {
          setDetailProduct(null);
          setBufferProduct(p);
        }}
        isFavorite={detailProduct ? favorites.some((f) => f.id === detailProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onRemoveFavorite={(id) => saveFavorites(favorites.filter((f) => f.id !== id))}
        onClearFavorites={() => saveFavorites([])}
        onSelectProduct={(p) => setDetailProduct(p)}
      />

      {/* Modal de Backup e Exportação */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        products={products}
        onRestoreProducts={(restored) => saveProducts(restored)}
      />

      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          try {
            localStorage.setItem("brecho_fatima_admin", "true");
          } catch (e) {}
          if (pinActionCallback) {
            pinActionCallback();
            setPinActionCallback(null);
          }
        }}
      />

    </div>
  );
}
