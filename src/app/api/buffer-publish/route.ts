import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { product, customCaption, bufferToken, profileIds } = await req.json();

    if (!product) {
      return NextResponse.json({ success: false, error: "Dados do produto ausentes" }, { status: 400 });
    }

    const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price);
    
    const postText = customCaption || `🛍️ NOVIDADE NO BRECHÓ DA FÁTIMA! 🛍️

✨ ${product.title}
🏷️ Tamanho: ${product.size} | Condição: ${product.condition}
💰 Valor especial: ${priceFormatted}

📲 Peça única disponível! Para reservar ou retirar na loja física, envie mensagem no nosso WhatsApp (13) 97404-7020 ou clique no link da bio!

📍 Brechó da Fátima - Praia Grande / SP
#brechodafatima #brecho #modasustentavel #praiagrande #garimpo #lookdodia #achadinhos`;

    // Se o usuário configurar o token de API do Buffer nas variáveis ou no modal
    const token = bufferToken || process.env.BUFFER_ACCESS_TOKEN;

    if (token && profileIds && profileIds.length > 0) {
      // Disparo real via API do Buffer
      const bufferRes = await fetch("https://api.bufferapp.com/1/updates/create.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`
        },
        body: new URLSearchParams({
          text: postText,
          "profile_ids[]": profileIds[0],
          now: "false", // agenda no Buffer
          "media[photo]": product.images[0] || ""
        })
      });

      const bufferData = await bufferRes.json();
      return NextResponse.json({
        success: true,
        mode: "live-buffer",
        data: bufferData,
        message: "Publicação agendada com sucesso no Buffer para o Instagram!"
      });
    }

    // Modo assistente / webhook / cópia preparada para o Buffer
    return NextResponse.json({
      success: true,
      mode: "buffer-ready",
      message: "Texto formatado e pronto para envio via Buffer ou agendamento direto!",
      preparedPayload: {
        instagramAccount: "@brechodafatimaa",
        text: postText,
        media: product.images,
        bufferShareUrl: `https://buffer.com/add?url=${encodeURIComponent(product.images[0] || '')}&text=${encodeURIComponent(postText)}`
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Erro ao conectar com Buffer"
    }, { status: 500 });
  }
}
