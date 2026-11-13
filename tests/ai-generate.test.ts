import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/ai-generate/route";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/ai-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/ai-generate", () => {
  it("generates description, suggestedTags, and Instagram caption for valid input", async () => {
    const req = makeRequest({
      title: "Vestido Floral Midi",
      price: 75,
      category: "feminino",
      condition: "Seminovo",
      brand: "Farm",
      color: "Rosa",
      tags: ["vestido floral", "verao"],
    });

    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.match(data.description, /Vestido Floral Midi/);
    assert.match(data.description, /Categoria: feminino/);
    assert.match(data.description, /Condição: Seminovo/);
    assert.match(data.description, /Marca: Farm/);
    assert.match(data.description, /Tom\/Cor: Rosa/);
    assert.ok(Array.isArray(data.suggestedTags));
    assert.ok(data.suggestedTags.length > 0);
    assert.match(data.captionForInstagram, /#brechodafatima/);
    assert.match(data.captionForInstagram, /#vestidofloral/);
    assert.match(data.captionForInstagram, /#verao/);
  });

  it("uses sensible defaults when optional fields are omitted", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.match(data.description, /Peça selecionada/);
    assert.match(data.description, /Categoria: Moda/);
    assert.match(data.description, /Condição: Ótimo estado de conservação/);
  });

  it("returns 500 when request body is invalid JSON", async () => {
    const req = makeRequest("{invalid-json");
    const res = await POST(req);
    assert.equal(res.status, 500);

    const data = await res.json();
    assert.equal(data.success, false);
    assert.equal(data.error, "Falha ao processar descrição por IA");
  });

  it("uses Gemini 2.5 Flash when GEMINI_API_KEY is present and parses strict JSON", async () => {
    const prevKey = process.env.GEMINI_API_KEY;
    const prevFetch = globalThis.fetch;
    let capturedUrl = "";
    let capturedBody: Record<string, unknown> | null = null;

    process.env.GEMINI_API_KEY = "test-gemini-key";
    globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
      capturedUrl = String(input);
      capturedBody = init?.body ? JSON.parse(String(init.body)) : null;
      return new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      title: "Jaqueta Jeans Vintage 90s",
                      category: "vintage",
                      condition: "Ótimo estado",
                      color: "Azul Índigo",
                      description: "Jaqueta jeans clássica dos anos 90, perfeita para compor looks urbanos.",
                      lookSuggestions: [
                        "Combine com vestido floral midi.",
                        "Use com camiseta branca e calça de sarja.",
                        "Aposte em bota de couro para a noite.",
                      ],
                    }),
                  },
                ],
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    try {
      const req = makeRequest({
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
        price: 120,
      });
      const res = await POST(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.match(capturedUrl, /gemini-2\.5-flash:generateContent/);
      assert.ok(capturedBody);
      const parts = (capturedBody as { contents: Array<{ parts: Array<Record<string, unknown>> }> }).contents[0].parts;
      assert.equal(parts.length, 2);
      assert.deepEqual(parts[1], {
        inlineData: { mimeType: "image/jpeg", data: "/9j/4AAQSkZJRg==" },
      });
      assert.equal(data.title, "Jaqueta Jeans Vintage 90s");
      assert.equal(data.category, "vintage");
      assert.equal(data.condition, "Ótimo estado");
      assert.equal(data.color, "Azul Índigo");
      assert.match(data.description, /Jaqueta jeans clássica/);
      assert.equal(data.lookSuggestions.length, 3);
      assert.match(data.captionForInstagram, /#brechodafatima/);
    } finally {
      globalThis.fetch = prevFetch;
      if (prevKey === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = prevKey;
      }
    }
  });

  it("falls back to local generator when Gemini API fails", async () => {
    const prevKey = process.env.GEMINI_API_KEY;
    const prevFetch = globalThis.fetch;

    process.env.GEMINI_API_KEY = "test-gemini-key";
    globalThis.fetch = (async () => new Response("Service Unavailable", { status: 503 })) as typeof fetch;

    try {
      const req = makeRequest({
        title: "Bolsa Caramelo",
        category: "acessorios",
        color: "Caramelo",
      });
      const res = await POST(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.match(data.description, /Bolsa Caramelo/);
      assert.ok(Array.isArray(data.lookSuggestions));
      assert.equal(data.lookSuggestions.length, 3);
    } finally {
      globalThis.fetch = prevFetch;
      if (prevKey === undefined) {
        delete process.env.GEMINI_API_KEY;
      } else {
        process.env.GEMINI_API_KEY = prevKey;
      }
    }
  });
});
