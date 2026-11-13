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
});
