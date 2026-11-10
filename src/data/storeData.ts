import { StoreInfo, Product } from '@/types';

export const STORE_DATA: StoreInfo = {
  name: "Brechó da Fátima",
  owner: "Dona Fátima",
  whatsapp: "5513974047020",
  whatsappFormatted: "(13) 97404-7020",
  instagram: "https://www.instagram.com/brechodafatimaa?obrf=aHg0d2J1NHlucHhv",
  instagramHandle: "@brechodafatimaa",
  address: {
    street: "Rua Antonio Bento, 76",
    neighborhood: "Vila Mathias",
    city: "Santos",
    state: "SP",
    cep: "11075-260",
    reference: "Entrada pelos fundos",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3646.230777598822!2d-46.3312984!3d-23.9522961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce03126f9479b1%3A0xc3cf2a04870102b3!2sR.%20Ant%C3%B4nio%20Bento%2C%2076%20-%20Vila%20Matias%2C%20Santos%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000",
    googleMapsLink: "https://maps.google.com/?q=Rua+Antonio+Bento+76+Vila+Mathias+Santos+SP"
  },
  openingHours: {
    weekdays: "Segunda a Sexta: 09h às 18h",
    saturday: "Sábados: 09h às 16h",
    sunday: "Domingos e Feriados: Consultar pelo WhatsApp"
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Jaqueta Jeans Oversized Vintage 90s",
    price: 89.90,
    originalPrice: 220.00,
    category: "feminino",
    size: "M",
    condition: "Excelente estado (Como Novo)",
    description: "Jaqueta jeans vintage com lavagem média clara, botões originais em cobre e modelagem despojada oversized. Peça única garimpada com carinho!",
    brand: "Vintage Classic",
    color: "Azul Claro",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80"
    ],
    createdAt: new Date().toISOString(),
    tags: ["vintage", "jeans", "anos 90", "tendência"],
    highlight: true
  },
  {
    id: "prod-2",
    title: "Vestido Floral Midi Estilo Cottagecore",
    price: 65.00,
    originalPrice: 159.00,
    category: "feminino",
    size: "P",
    condition: "Novo com Etiqueta",
    description: "Vestido com caimento super leve, estampa floral delicada, manga bufante e lastex nas costas garantindo conforto e ajuste perfeito.",
    brand: "Zara Woman",
    color: "Floral / Off-white",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
    ],
    createdAt: new Date().toISOString(),
    tags: ["vestido", "floral", "verão", "delicado"],
    highlight: true
  },
  {
    id: "prod-3",
    title: "Camisa Masculina Linho Puro Manga Curta",
    price: 75.00,
    originalPrice: 189.90,
    category: "masculino",
    size: "G",
    condition: "Ótimo estado",
    description: "Camisa casual de linho puro respirável, perfeita para o clima litorâneo e encontros de fim de semana. Corte reto sofisticado.",
    brand: "Reserva",
    color: "Bege Areia",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
    ],
    createdAt: new Date().toISOString(),
    tags: ["masculino", "linho", "praia", "casual"],
    highlight: true
  },
  {
    id: "prod-4",
    title: "Blazer Alfaiataria Tweed Clássico",
    price: 110.00,
    originalPrice: 320.00,
    category: "vintage",
    size: "M",
    condition: "Excelente estado (Como Novo)",
    description: "Peça de acervo raro! Blazer em tweed com forro acetinado, botões dourados e corte elegante. Transforma qualquer look básico.",
    brand: "Ateliê Vintage",
    color: "P&B / Tweed",
    status: "sold", // Teste de item vendido!
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80"
    ],
    createdAt: new Date().toISOString(),
    tags: ["alfaiataria", "blazer", "tweed", "chic"],
    highlight: false
  },
  {
    id: "prod-5",
    title: "Tênis Streetwear Retrô 90s Couro Legítimo",
    price: 120.00,
    originalPrice: 399.00,
    category: "calcados",
    size: "39",
    condition: "Ótimo estado",
    description: "Tênis de couro com solado conservado, amortecimento macio e design clássico que combina com qualquer composição esportiva ou urbana.",
    brand: "Street Icons",
    color: "Branco / Verde",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80"
    ],
    createdAt: new Date().toISOString(),
    tags: ["calcados", "sneaker", "streetwear"],
    highlight: true
  },
  {
    id: "prod-6",
    title: "Bolsa Vintage Estruturada com Alça de Corrente",
    price: 55.00,
    originalPrice: 130.00,
    category: "acessorios",
    size: "Único",
    condition: "Excelente estado (Como Novo)",
    description: "Bolsa média transversal, fecho dourado giratório, acabamento croco e divisórias internas intactas. Um charme para todas as ocasiões.",
    brand: "Vintage Bag",
    color: "Caramelo",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"
    ],
    createdAt: new Date().toISOString(),
    tags: ["bolsa", "acessorios", "croco", "caramelo"],
    highlight: false
  }
];
