"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, KeyRound, X, Check, AlertCircle } from "lucide-react";

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function AdminPinModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Acesso da Dona Fátima",
  description = "Digite o PIN de 4 dígitos para gerenciar o acervo do brechó:"
}: AdminPinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  // PIN padrão de segurança: 1234 ou 1313 (código DDD 13)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1313" || pin === "1234" || pin === "fatima") {
      setError(false);
      setPin("");
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 text-center space-y-4"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
          <KeyRound className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-serif font-bold text-lg text-zinc-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              maxLength={6}
              placeholder="Digite o PIN (ex: 1313)"
              value={pin}
              onChange={(e) => {
                setError(false);
                setPin(e.target.value);
              }}
              className="w-full text-center tracking-widest text-lg font-bold py-3 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            {error && (
              <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorreto. Dica: use 1313</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-600/30 transition-all active:scale-95"
          >
            Confirmar Acesso
          </button>
        </form>
      </motion.div>
    </div>
  );
}
