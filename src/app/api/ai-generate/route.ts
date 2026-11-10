import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, price, category, condition, brand, color, tags } = await req.json();

    // Template de IA avançada para brechós e moda circular
    const sampleHooks = [
      `✨ Garimpo Exclusivo no Brechó da Fátima!`,
      `🌿 Moda Sustentável & Estilo Único com Dona Fátima!`,
      `🔥 Peça Única Garimpada com Amor!`,
      `💫 Acervo Especial Brechó da Fátima:`
    ];

    const randomHook = sampleHooks[Math.floor(Math.random() * sampleHooks.length)];

    const aiDescription = `${randomHook}

Apresentamos esta peça imperdível: ${title || "Peça selecionada"}!
👗 Categoria: ${category || "Moda"}
🏷️ Condição: ${condition || "Ótimo estado de conservação"}
${brand ? `🏷️ Marca: ${brand}\n` : ''}${color ? `🎨 Tom/Cor: ${color}\n` : ''}

💡 Destaque da Peça: Tecido de toque agradável, caimento impecável e acabamentos preservados. Uma escolha sustentável que une elegância, personalidade e consumo consciente para quem ama garimpar achados de bom gosto.

📍 Disponível em nossa loja física e para reserva direta pelo WhatsApp!
📲 Como garantir? Toque no botão do WhatsApp e envie o link desta peça para Dona Fátima antes que outra pessoa leve! Peça única!`;

    const hashtags = [
      "#brechodafatima",
      "#brechosp",
      "#modasustentavel",
      "#garimpos",
      "#praiagrande",
      "#brechopg",
      "#estiloconsciente",
      "#slowfashion",
      ...(tags || []).map((t: string) => `#${t.replace(/\s+/g, '')}`)
    ].slice(0, 10).join(" ");

    return NextResponse.json({
      success: true,
      description: aiDescription,
      suggestedTags: ["garimpododia", "achados", "pecaunica", "vintagebrasil"],
      captionForInstagram: `${aiDescription}\n\n${hashtags}`
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Falha ao processar descrição por IA" },
      { status: 500 }
    );
  }
}
