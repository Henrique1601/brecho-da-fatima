import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function createWhatsAppLink(phone: string, productTitle?: string, price?: number): string {
  const cleanPhone = phone.replace(/\D/g, "");
  let message = "Olá, Dona Fátima! Tudo bem? Vi as novidades no marketplace do Brechó da Fátima.";
  if (productTitle) {
    message += ` Tenho muito interesse na peça: *${productTitle}*`;
    if (price !== undefined) {
      message += ` (${formatBRL(price)})`;
    }
    message += `. Ela ainda está disponível para eu fechar?`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
