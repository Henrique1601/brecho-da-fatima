"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, MapPin, Tag } from "lucide-react";
import { Product } from "@/types";
import { formatBRL } from "@/lib/utils";

interface QrTagModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QrTagModal({ product, isOpen, onClose }: QrTagModalProps) {
  if (!isOpen || !product) return null;

  const productUrl = `https://brechodafatima.netlify.app/?peca=${encodeURIComponent(product.id)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto print:bg-transparent print:p-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-tag-modal-title"
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-qr-tag,
          #printable-qr-tag * {
            visibility: visible !important;
          }
          #printable-qr-tag {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-shadow: none !important;
            border: 1.5px solid #18181b !important;
            background: #ffffff !important;
            color: #18181b !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 print:border-0 print:shadow-none print:bg-transparent print:p-0">
        {/* Top bar (hidden on print) */}
        <div className="flex items-center justify-between mb-4 print:hidden">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white">
            <Tag className="w-4 h-4 text-rose-600" />
            <h3 id="qr-tag-modal-title">Etiqueta da Peça (QR)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar etiqueta QR"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Boutique Clothing Tag */}
        <div
          id="printable-qr-tag"
          className="mx-auto w-full max-w-[290px] rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-[#fffdf9] text-zinc-900 p-5 shadow-inner flex flex-col items-center text-center space-y-3"
        >
          {/* Hang-tag hole punch */}
          <div
            className="w-4 h-4 rounded-full border-2 border-zinc-300 bg-white shadow-inner"
            aria-hidden="true"
          />

          {/* Store Header */}
          <div className="space-y-0.5">
            <p className="font-serif text-lg font-bold tracking-tight text-zinc-900">
              Brechó da Fátima
            </p>
            <p className="inline-flex items-center justify-center gap-1 text-[11px] font-medium text-zinc-600">
              <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
              <span>Rua Antonio Bento 76 - Santos</span>
            </p>
          </div>

          <div className="w-full border-t border-dashed border-zinc-300" />

          {/* Product Details */}
          <div className="w-full space-y-1.5">
            <h4 className="font-serif text-base font-bold text-zinc-900 leading-snug line-clamp-2">
              {product.title}
            </h4>

            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-semibold">
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800">
                Tam: {product.size}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                {product.condition}
              </span>
            </div>
          </div>

          {/* Price in BRL */}
          <div className="py-1">
            <span className="text-2xl font-black tracking-tight text-zinc-950">
              {formatBRL(product.price)}
            </span>
          </div>

          {/* Scannable QR Code */}
          <div className="p-2.5 bg-white rounded-xl border border-zinc-200 shadow-xs">
            <QRCodeSVG
              value={productUrl}
              size={132}
              level="M"
              bgColor="#ffffff"
              fgColor="#18181b"
            />
          </div>

          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Escaneie para ver no catálogo
            </p>
            <p className="text-[10px] text-zinc-400">
              Cód: {product.id} • Peça única
            </p>
          </div>
        </div>

        {/* Actions (hidden on print) */}
        <div className="mt-5 flex gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-600 dark:hover:bg-rose-500 text-white shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Etiqueta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
