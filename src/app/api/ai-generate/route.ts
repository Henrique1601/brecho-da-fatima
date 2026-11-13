import { NextRequest, NextResponse } from "next/server";
import { generateLookSuggestions } from "@/lib/lookSuggestions";
import type { Product } from "@/types";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const VALID_CATEGORIES: ReadonlySet<Product["category"]> = new Set([
  "feminino",
  "masculino",
  "calcados",
  "acessorios",
  "vintage",
  "infantil",
]);

const VALID_CONDITIONS: ReadonlySet<Product["condition"]> = new Set([
  "Novo com Etiqueta",
  "Excelente estado (Como Novo)",
  "Ótimo estado",
  "Bom estado vintage",
]);

const DEFAULT_TAGS = ["garimpododia", "achados", "pecaunica", "vintagebrasil"];

interface AiGeneratePayload {
  title?: string;
  price?: number;
  category?: string;
  condition?: string;
  brand?: string;
  color?: string;
  tags?: unknown;
  image?: unknown;
}

function buildHashtags(tags?: unknown): string {
  const safeTags = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    : [];

  return [
    "#brechodafatima",
    "#brechosp",
    "#modasustentavel",
    "#garimpos",
    "#praiagrande",
    "#brechopg",
    "#estiloconsciente",
    "#slowfashion",
    ...safeTags.map((t) => `#${t.replace(/\s+/g, "")}`),
  ]
    .slice(0, 10)
    .join(" ");
}

function parseImageDataUrl(image: unknown): { mimeType: string; data: string } | null {
  if (typeof image !== "string") return null;
  const match = image.trim().match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/);
  if (!match) return null;
  const [, mimeType, data] = match;
  if (!data) return null;
  return { mimeType, data };
}

function parseGeminiJson(rawText: string): Record<string, unknown> {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned) as Record<string, unknown>;
}

async function generateWithGemini(
  apiKey: string,
  payload: AiGeneratePayload,
  parsedImage: { mimeType: string; data: string } | null
) {
  const { title, price, category, condition, brand, color, tags } = payload;

  const contextLines = [
    title ? `Título informado: ${title}` : null,
    price ? `Preço: R$ ${price}` : null,
    category ? `Categoria informada: ${category}` : null,
    condition ? `Condição informada: ${condition}` : null,
    brand ? `Marca: ${brand}` : null,
    color ? `Cor informada: ${color}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `Você é a assistente de curadoria e vendas do Brechó da Fátima (Praia Grande/SP), especialista em moda circular, garimpos e peças únicas.
Analise ${parsedImage ? "a imagem enviada e " : ""}as informações abaixo e retorne APENAS um JSON válido em português do Brasil com exatamente estas chaves:
{
  "title": "título curto e atrativo para a peça",
  "category": "uma das opções exatas: feminino | masculino | calcados | acessorios | vintage | infantil",
  "condition": "uma das opções exatas: Novo com Etiqueta | Excelente estado (Como Novo) | Ótimo estado | Bom estado vintage",
  "color": "cor predominante da peça",
  "description": "descrição persuasiva e acolhedora para catálogo e WhatsApp do Brechó da Fátima, destacando caimento, estilo, consumo consciente e chamada para reserva pelo WhatsApp",
  "lookSuggestions": ["3 sugestões curtas e práticas de como combinar a peça"]
}

${contextLines ? `Informações fornecidas:\n${contextLines}` : "Nenhuma informação textual prévia foi fornecida; baseie-se na imagem."}`;

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: prompt },
  ];
  if (parsedImage) {
    parts.push({ inlineData: parsedImage });
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Gemini API returned empty content");
  }

  const parsed = parseGeminiJson(rawText);
  const resolvedDescription =
    typeof parsed.description === "string" && parsed.description.trim()
      ? parsed.description.trim()
      : "";

  if (!resolvedDescription) {
    throw new Error("Gemini JSON missing description");
  }

  const resolvedTitle =
    typeof parsed.title === "string" && parsed.title.trim() ? parsed.title.trim() : title;
  const resolvedCategory =
    typeof parsed.category === "string" &&
    VALID_CATEGORIES.has(parsed.category as Product["category"])
      ? (parsed.category as Product["category"])
      : category;
  const resolvedCondition =
    typeof parsed.condition === "string" &&
    VALID_CONDITIONS.has(parsed.condition as Product["condition"])
      ? (parsed.condition as Product["condition"])
      : condition;
  const resolvedColor =
    typeof parsed.color === "string" && parsed.color.trim() ? parsed.color.trim() : color;

  const rawLooks = Array.isArray(parsed.lookSuggestions)
    ? parsed.lookSuggestions.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  const lookSuggestions =
    rawLooks.length > 0
      ? rawLooks.slice(0, 3)
      : generateLookSuggestions({
          title: resolvedTitle,
          category: resolvedCategory,
          color: resolvedColor,
          brand,
        });

  const hashtags = buildHashtags(tags);

  return {
    success: true,
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    ...(resolvedCategory ? { category: resolvedCategory } : {}),
    ...(resolvedCondition ? { condition: resolvedCondition } : {}),
    ...(resolvedColor ? { color: resolvedColor } : {}),
    description: resolvedDescription,
    suggestedTags: DEFAULT_TAGS,
    captionForInstagram: `${resolvedDescription}\n\n${hashtags}`,
    lookSuggestions,
  };
}

function generateLocalCopy(payload: AiGeneratePayload) {
  const { title, category, condition, brand, color, tags } = payload;

  // Template de IA avançada para brechós e moda circular
  const sampleHooks = [
    `✨ Garimpo Exclusivo no Brechó da Fátima!`,
    `🌿 Moda Sustentável & Estilo Único com Dona Fátima!`,
    `🔥 Peça Única Garimpada com Amor!`,
    `💫 Acervo Especial Brechó da Fátima:`,
  ];

  const randomHook = sampleHooks[Math.floor(Math.random() * sampleHooks.length)];

  const aiDescription = `${randomHook}

Apresentamos esta peça imperdível: ${title || "Peça selecionada"}!
👗 Categoria: ${category || "Moda"}
🏷️ Condição: ${condition || "Ótimo estado de conservação"}
${brand ? `🏷️ Marca: ${brand}\n` : ""}${color ? `🎨 Tom/Cor: ${color}\n` : ""}

💡 Destaque da Peça: Tecido de toque agradável, caimento impecável e acabamentos preservados. Uma escolha sustentável que une elegância, personalidade e consumo consciente para quem ama garimpar achados de bom gosto.

📍 Disponível em nossa loja física e para reserva direta pelo WhatsApp!
📲 Como garantir? Toque no botão do WhatsApp e envie o link desta peça para Dona Fátima antes que outra pessoa leve! Peça única!`;

  const hashtags = buildHashtags(tags);
  const lookSuggestions = generateLookSuggestions({ title, category, color, brand });

  return {
    success: true,
    description: aiDescription,
    suggestedTags: DEFAULT_TAGS,
    captionForInstagram: `${aiDescription}\n\n${hashtags}`,
    lookSuggestions,
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as AiGeneratePayload;
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey) {
      try {
        const parsedImage = parseImageDataUrl(payload.image);
        const geminiResult = await generateWithGemini(apiKey, payload, parsedImage);
        return NextResponse.json(geminiResult);
      } catch (geminiError) {
        console.warn("Gemini fallback to local generator:", geminiError);
      }
    }

    return NextResponse.json(generateLocalCopy(payload));
  } catch {
    return NextResponse.json(
      { success: false, error: "Falha ao processar descrição por IA" },
      { status: 500 }
    );
  }
}
