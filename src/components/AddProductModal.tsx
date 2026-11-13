"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  Trash2, 
  Check, 
  Loader2
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { Product } from "@/types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
  editingProduct?: Product | null;
  onUpdateProduct?: (product: Product) => void;
}

const VALID_CATEGORIES = new Set<Product["category"]>([
  "feminino",
  "masculino",
  "calcados",
  "acessorios",
  "vintage",
  "infantil",
]);

const VALID_CONDITIONS = new Set<Product["condition"]>([
  "Novo com Etiqueta",
  "Excelente estado (Como Novo)",
  "Ótimo estado",
  "Bom estado vintage",
]);

export function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
  editingProduct = null,
  onUpdateProduct,
}: AddProductModalProps) {
  if (!isOpen) return null;

  return (
    <AddProductModalContent
      key={editingProduct?.id ?? "new"}
      onClose={onClose}
      onAddProduct={onAddProduct}
      editingProduct={editingProduct}
      onUpdateProduct={onUpdateProduct}
    />
  );
}

function AddProductModalContent({
  onClose,
  onAddProduct,
  editingProduct = null,
  onUpdateProduct,
}: Omit<AddProductModalProps, "isOpen">) {
  const isEditing = Boolean(editingProduct);

  const [images, setImages] = useState<string[]>(() => editingProduct?.images ?? []);
  const [title, setTitle] = useState(() => editingProduct?.title ?? "");
  const [price, setPrice] = useState(() =>
    editingProduct?.price !== undefined ? String(editingProduct.price) : ""
  );
  const [originalPrice, setOriginalPrice] = useState(() =>
    editingProduct?.originalPrice !== undefined ? String(editingProduct.originalPrice) : ""
  );
  const [category, setCategory] = useState<Product["category"]>(
    () => editingProduct?.category ?? "feminino"
  );
  const [size, setSize] = useState(() => editingProduct?.size ?? "M");
  const [condition, setCondition] = useState<Product["condition"]>(
    () => editingProduct?.condition ?? "Excelente estado (Como Novo)"
  );
  const [brand, setBrand] = useState(() => editingProduct?.brand ?? "");
  const [color, setColor] = useState(() => editingProduct?.color ?? "");
  const [description, setDescription] = useState(() => editingProduct?.description ?? "");
  const [postToBuffer, setPostToBuffer] = useState(() => !editingProduct);
  const [touchedSelects, setTouchedSelects] = useState<{ category: boolean; condition: boolean }>(
    () => ({
      category: Boolean(editingProduct),
      condition: Boolean(editingProduct),
    })
  );

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lidar com arquivos selecionados ou arrastados (Drag and Drop)
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Gerador de Descrição, Condição e Copy por IA
  const handleGenerateWithAi = async () => {
    setIsGeneratingAi(true);
    setAiSuccess(false);

    try {
      const firstImage = images[0]?.startsWith("data:image/") ? images[0] : undefined;
      const res = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          price: Number(price) || 0,
          category,
          condition,
          brand: brand.trim() || undefined,
          color: color.trim() || undefined,
          image: firstImage,
        }),
      });

      const data = await res.json();
      if (data.success && data.description) {
        setDescription(data.description);
        if (typeof data.title === "string" && data.title.trim() && !title.trim()) {
          setTitle(data.title.trim());
        }
        if (typeof data.color === "string" && data.color.trim() && !color.trim()) {
          setColor(data.color.trim());
        }
        if (
          typeof data.category === "string" &&
          VALID_CATEGORIES.has(data.category as Product["category"]) &&
          !touchedSelects.category
        ) {
          setCategory(data.category as Product["category"]);
        }
        if (
          typeof data.condition === "string" &&
          VALID_CONDITIONS.has(data.condition as Product["condition"]) &&
          !touchedSelects.condition
        ) {
          setCondition(data.condition as Product["condition"]);
        }
        setAiSuccess(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback inteligente
      setDescription(`✨ Peça única garimpada no Brechó da Fátima!
${title || "Linda peça selecionada"} em ${condition.toLowerCase()}.
Tamanho: ${size}. Higienizada e pronta para usar! Entre em contato no WhatsApp para garantir.`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert("Por favor, preencha o título e o preço da peça.");
      return;
    }

    const parsedPrice = parseFloat(price.replace(",", "."));
    const parsedOriginalPrice = originalPrice
      ? parseFloat(originalPrice.replace(",", "."))
      : undefined;

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      category,
      size,
      condition,
      brand: brand || undefined,
      color: color || undefined,
      description:
        description ||
        `Linda peça selecionada no Brechó da Fátima em ${condition.toLowerCase()}.`,
      status: editingProduct ? editingProduct.status : "available",
      images:
        images.length > 0
          ? images
          : [
              "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
            ],
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      tags: editingProduct?.tags,
      highlight: editingProduct ? editingProduct.highlight : true,
    };

    // Se a opção de Buffer estiver marcada, envia ao endpoint
    if (postToBuffer) {
      try {
        await fetch("/api/buffer-publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: productPayload }),
        });
      } catch (err) {
        console.error("Buffer sync:", err);
      }
    }

    if (editingProduct && onUpdateProduct) {
      onUpdateProduct(productPayload);
    } else {
      onAddProduct(productPayload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-3xl my-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                {isEditing ? "Editar Peça do Brechó" : "Cadastrar Peça no Brechó"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isEditing
                  ? "Atualize os detalhes, fotos ou gere uma nova descrição com IA"
                  : "Arraste fotos, gere textos persuasivos com IA e conecte com o Buffer"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Zona de Drag & Drop de Fotos */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Fotos da Peça (Arraste aqui ou clique para selecionar)
            </label>
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 scale-[0.99]"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-rose-400 bg-zinc-50/50 dark:bg-zinc-800/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <UploadCloud className="w-10 h-10 text-rose-500 mb-3" />
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 text-center">
                Arraste as fotos da peça aqui ou <span className="text-rose-600 underline">clique para buscar</span>
              </p>
              <p className="text-xs text-zinc-400 mt-1">PNG, JPG ou WEBP (Pode adicionar várias fotos)</p>
            </div>

            {/* Preview das Fotos Selecionadas */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages(images.filter((_, i) => i !== idx));
                      }}
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dados Principais: Título, Preço e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Nome / Título da Peça *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Vestido Floral Midi Vintage, Calça Jeans 90s"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Preço no Brechó (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 59.90"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value as Product["category"]);
                  setTouchedSelects((prev) => ({ ...prev, category: true }));
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="vintage">Vintage & Raros</option>
                <option value="calcados">Calçados</option>
                <option value="acessorios">Acessórios / Bolsas</option>
                <option value="infantil">Infantil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Tamanho da Peça
              </label>
              <input
                type="text"
                placeholder="Ex: M, 42, GG, Único"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Condição da Peça
              </label>
              <select
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value as Product["condition"]);
                  setTouchedSelects((prev) => ({ ...prev, condition: true }));
                }}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="Excelente estado (Como Novo)">Excelente estado (Como Novo)</option>
                <option value="Novo com Etiqueta">Novo com Etiqueta</option>
                <option value="Ótimo estado">Ótimo estado</option>
                <option value="Bom estado vintage">Bom estado vintage</option>
              </select>
            </div>
          </div>

          {/* Marca e Cor (opcionais) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Marca (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Zara, Farm, Levis, Vintage Anônimo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                Cor Predominante
              </label>
              <input
                type="text"
                placeholder="Ex: Terracota, Azul Céu, Xadrez"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gerador de Descrição com IA */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-rose-50/80 via-amber-50/50 to-orange-50/30 dark:from-rose-950/20 dark:via-zinc-800/40 dark:to-zinc-800/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm text-zinc-900 dark:text-white">
                  Assistente IA do Brechó da Fátima
                </span>
                {aiSuccess && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    <Check className="w-3 h-3" />
                    Gerado
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleGenerateWithAi}
                disabled={isGeneratingAi}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 transition-all shadow-sm"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Criando Texto com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gerar Copy e Descrição com IA</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="A IA vai preencher aqui a história e detalhes da peça, ou você pode escrever livremente..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-rose-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Conexão com Buffer / Instagram */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                  Conexão com Buffer (@brechodafatimaa)
                </span>
                <span className="text-xs text-zinc-500">
                  Prepara agendamento no Buffer para publicação automática no Instagram
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={postToBuffer}
                onChange={(e) => setPostToBuffer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? "Salvar Alterações" : "Publicar Peça no Marketplace"}</span>
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
