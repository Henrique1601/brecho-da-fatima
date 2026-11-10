"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Sparkles, 
  PlusCircle, 
  Menu, 
  X, 
  ShoppingBag,
  Heart
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { STORE_DATA } from "@/data/storeData";
import { createWhatsAppLink } from "@/lib/utils";

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenLocation: () => void;
  favoritesCount: number;
}

export function Navbar({ onOpenAddModal, onOpenLocation, favoritesCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Marca */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-amber-500 to-emerald-500 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                  <span className="font-serif font-black text-rose-600 dark:text-rose-400 text-lg">BF</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-rose-600 transition-colors">
                  Brechó da Fátima
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  Curadoria & Moda Circular
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLocation}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Onde Estamos</span>
            </button>

            <a
              href={STORE_DATA.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-pink-600 dark:hover:text-pink-400 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Instagram className="w-4 h-4 text-pink-500" />
              <span>{STORE_DATA.instagramHandle}</span>
            </a>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-full shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nova Peça (IA)</span>
            </button>

            <a
              href={createWhatsAppLink(STORE_DATA.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full shadow-sm hover:shadow-emerald-500/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{STORE_DATA.whatsappFormatted}</span>
            </a>
          </nav>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAddModal}
              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full"
              title="Cadastrar Peça com IA"
            >
              <PlusCircle className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 px-4 pt-3 pb-5 space-y-3 shadow-xl">
          <button
            onClick={() => {
              onOpenLocation();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <MapPin className="w-5 h-5 text-rose-500" />
            <span>Localização da Loja Física</span>
          </button>

          <a
            href={STORE_DATA.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <Instagram className="w-5 h-5 text-pink-500" />
            <span>Instagram: {STORE_DATA.instagramHandle}</span>
          </a>

          <button
            onClick={() => {
              onOpenAddModal();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-rose-600 to-amber-600"
          >
            <Sparkles className="w-4 h-4" />
            <span>Cadastrar Peça com IA & Buffer</span>
          </button>

          <a
            href={createWhatsAppLink(STORE_DATA.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
          >
            <Phone className="w-4 h-4" />
            <span>Falar no WhatsApp: {STORE_DATA.whatsappFormatted}</span>
          </a>
        </div>
      )}
    </header>
  );
}
