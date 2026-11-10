export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: 'feminino' | 'masculino' | 'calcados' | 'acessorios' | 'vintage' | 'infantil';
  size: string; // PP, P, M, G, GG, 38, 40, 42, etc.
  condition: 'Novo com Etiqueta' | 'Excelente estado (Como Novo)' | 'Ótimo estado' | 'Bom estado vintage';
  description: string;
  brand?: string;
  color?: string;
  status: 'available' | 'sold';
  images: string[];
  createdAt: string;
  tags?: string[];
  highlight?: boolean;
}

export interface StoreInfo {
  name: string;
  owner: string;
  whatsapp: string;
  whatsappFormatted: string;
  instagram: string;
  instagramHandle: string;
  bufferWebhookUrl?: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    cep?: string;
    reference?: string;
    googleMapsEmbedUrl: string;
    googleMapsLink: string;
  };
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}
