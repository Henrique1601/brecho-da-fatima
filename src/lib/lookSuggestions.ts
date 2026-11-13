export interface LookSuggestionInput {
  title?: string;
  category?: string;
  color?: string;
  brand?: string;
}

/**
 * Generates 3 stylish outfit pairing suggestions tailored to a piece's
 * category, color, and title. Used both by `/api/ai-generate` and as an
 * instant client-side fallback in `ProductDetailModal`.
 */
export function generateLookSuggestions({
  title = "",
  category = "",
  color = "",
}: LookSuggestionInput): string[] {
  const lowerTitle = title.toLowerCase();
  const lowerCategory = category.toLowerCase();
  const colorHint = color.trim() ? ` (valorizando o tom ${color.trim()})` : "";

  if (lowerTitle.includes("vestido")) {
    return [
      `Casual Chic de Dia: combine com tênis branco minimalista, bolsa tiracolo caramelo e óculos retrô${colorHint}.`,
      `Jantar & Noite: aposte em sandália de tiras finas, brincos dourados delicados e clutch estruturada.`,
      `Meia-Estação: sobreponha com jaqueta jeans oversized ou cardigan leve para um visual descomplicado.`
    ];
  }

  if (lowerTitle.includes("jaqueta") || lowerTitle.includes("blazer") || lowerTitle.includes("casaco")) {
    return [
      `Urbano Despojado: use aberta sobre camiseta básica branca, calça jeans reta e tênis retrô${colorHint}.`,
      `Look Trabalho & Café: combine com calça de alfaiataria neutra, blusa de tecido fluido e mocassim ou scarpin.`,
      `Fim de Semana: jogue por cima de um vestido midi liso para criar contraste de texturas e proporções.`
    ];
  }

  if (lowerTitle.includes("bolsa") || lowerCategory === "acessorios") {
    return [
      `Destaque no Neutro: use como ponto focal com look monocromático off-white, bege ou preto${colorHint}.`,
      `Passeio na Praia/Cidade: combine com camisa de linho solta, shorts ou pantacourt e rasteirinha de couro.`,
      `Elegância Vintage: coordene os metais do acessório com cinto fino e brincos clássicos.`
    ];
  }

  if (lowerTitle.includes("tênis") || lowerTitle.includes("tenis") || lowerTitle.includes("sapato") || lowerCategory === "calcados") {
    return [
      `Streetwear Equilibrado: combine com calça cargo ou jeans wide leg e camiseta oversized${colorHint}.`,
      `Hi-Lo Moderno: quebre a formalidade usando com vestido midi fluido ou conjunto de alfaiataria leve.`,
      `Dia a Dia Prático: aposte em jeans reto, camisa social aberta por cima de regata e tote bag.`
    ];
  }

  if (lowerCategory === "masculino") {
    return [
      `Litoral & Fim de Semana: combine com bermuda de sarja bege ou off-white e mocassim ou tênis limpo${colorHint}.`,
      `Casual Inteligente: use com calça chino escura, cinto de couro e relógio clássico.`,
      `Sobreposição Leve: vista aberta sobre camiseta básica branca para um visual fresco e descontraído.`
    ];
  }

  if (lowerCategory === "infantil") {
    return [
      `Passeio Confortável: combine com tênis macio, boné ou tiarinha colorida para brincar com liberdade${colorHint}.`,
      `Festa em Família: adicione casaquinho leve de tricô e sapatinho clássico para um toque arrumadinho.`,
      `Dias de Sol: finalize com sandália confortável e mochilinha divertida.`
    ];
  }

  if (lowerCategory === "vintage") {
    return [
      `Clássico Atemporal: equilibre a peça garimpada com jeans reto de lavagem média e camiseta lisa${colorHint}.`,
      `Editorial Retrô: combine com acessórios dourados, lenço no pescoço ou cabelo e bolsa estruturada.`,
      `Moderno & Atual: misture com peças contemporâneas minimalistas para destacar a personalidade única do acervo.`
    ];
  }

  // Default / feminino & general
  return [
    `Casual Elegante: combine com calça jeans de cintura alta, cinto fino e sandália ou tênis neutro${colorHint}.`,
    `Produção Noturna: eleve o visual com acessórios dourados, bolsa pequena de alça e salto bloco.`,
    `Camadas Versáteis: finalize com terceira peça leve (blazer ou jaqueta jeans) para transitar do dia à noite.`
  ];
}
