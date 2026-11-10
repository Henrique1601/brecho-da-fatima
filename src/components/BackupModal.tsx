"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Check
} from "lucide-react";
import { Product } from "@/types";

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRestoreProducts: (restored: Product[]) => void;
}

export function BackupModal({ isOpen, onClose, products, onRestoreProducts }: BackupModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Exportar como JSON estruturado
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `catalogo_brecho_fatima_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 2. Exportar como CSV/Excel compatível
  const handleExportCsv = () => {
    const headers = ["ID", "Titulo", "Preco", "PrecoOriginal", "Categoria", "Tamanho", "Condicao", "Marca", "Cor", "Status", "Descricao"];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.price.toFixed(2),
      p.originalPrice ? p.originalPrice.toFixed(2) : "",
      p.category,
      p.size,
      `"${p.condition}"`,
      `"${p.brand || ""}"`,
      `"${p.color || ""}"`,
      p.status,
      `"${p.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(";"), ...rows.map(e => e.join(";"))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `catalogo_brecho_fatima_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // 3. Restaurar Backup a partir de arquivo JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].id && parsed[0].title) {
          onRestoreProducts(parsed);
          alert(`✅ Catálogo restaurado com sucesso! ${parsed.length} peças carregadas.`);
          onClose();
        } else {
          alert("Arquivo JSON inválido. Certifique-se de que é um backup do Brechó da Fátima.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
                Backup do Catálogo (Dona Fátima)
              </h3>
              <p className="text-xs text-zinc-500">
                Exporte suas {products.length} peças para segurança ou restaure em outro celular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Opções de Exportação */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Exportar Catálogo Atual
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white block">Excel (CSV)</span>
                <span className="text-[11px] text-zinc-500">Tabela com preços e peças</span>
              </div>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 text-left transition-all group"
            >
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 group-hover:scale-105 transition-transform">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white block">Backup (JSON)</span>
                <span className="text-[11px] text-zinc-500">Arquivo completo com fotos</span>
              </div>
            </button>
          </div>
        </div>

        {/* Opção de Importação / Restauração */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Restaurar Catálogo Salvo
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportFile}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-rose-500 bg-zinc-50/50 dark:bg-zinc-800/30 text-xs font-bold text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            <Upload className="w-4 h-4 text-rose-500" />
            <span>Selecionar arquivo de backup .json para restaurar</span>
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Ao restaurar um arquivo de backup, o catálogo atual será sincronizado com as peças contidas no arquivo.
          </span>
        </div>

      </motion.div>
    </div>
  );
}
