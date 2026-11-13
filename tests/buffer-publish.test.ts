import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { POST } from "../src/app/api/buffer-publish/route";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/buffer-publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const sampleProduct = {
  id: "prod-1",
  title: "Jaqueta Jeans Oversized",
  size: "M",
  condition: "Ótimo estado",
  price: 110,
  images: ["https://example.com/jaqueta.jpg"],
};

describe("POST /api/buffer-publish", () => {
  it("returns 400 when product is missing", async () => {
    const req = makeRequest({});
    const res = await POST(req);
    assert.equal(res.status, 400);

    const data = await res.json();
    assert.equal(data.success, false);
    assert.equal(data.error, "Dados do produto ausentes");
  });

  it("returns buffer-ready payload when no Buffer token is configured", async () => {
    const originalToken = process.env.BUFFER_ACCESS_TOKEN;
    delete process.env.BUFFER_ACCESS_TOKEN;

    try {
      const req = makeRequest({ product: sampleProduct });
      const res = await POST(req);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.mode, "buffer-ready");
      assert.equal(data.preparedPayload.instagramAccount, "@brechodafatimaa");
      assert.match(data.preparedPayload.text, /Jaqueta Jeans Oversized/);
      assert.match(data.preparedPayload.text, /Tamanho: M/);
      assert.match(data.preparedPayload.text, /R\$\s*110,00/);
      assert.deepEqual(data.preparedPayload.media, sampleProduct.images);
      assert.ok(data.preparedPayload.bufferShareUrl.startsWith("https://buffer.com/add?"));
    } finally {
      if (originalToken !== undefined) {
        process.env.BUFFER_ACCESS_TOKEN = originalToken;
      }
    }
  });

  it("uses customCaption when provided", async () => {
    const req = makeRequest({
      product: sampleProduct,
      customCaption: "Legenda personalizada para o Instagram!",
    });
    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.preparedPayload.text, "Legenda personalizada para o Instagram!");
  });

  it("posts to Buffer API when bufferToken and profileIds are provided", async (t) => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = "";
    let capturedAuth = "";

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      capturedUrl = String(input);
      capturedAuth = (init?.headers as Record<string, string>)?.Authorization ?? "";
      return new Response(JSON.stringify({ success: true, updates: [{ id: "upd-123" }] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    t.after(() => {
      globalThis.fetch = originalFetch;
    });

    const req = makeRequest({
      product: sampleProduct,
      bufferToken: "test-token",
      profileIds: ["profile-1"],
    });

    const res = await POST(req);
    assert.equal(res.status, 200);

    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.mode, "live-buffer");
    assert.equal(capturedUrl, "https://api.bufferapp.com/1/updates/create.json");
    assert.equal(capturedAuth, "Bearer test-token");
    assert.deepEqual(data.data, { success: true, updates: [{ id: "upd-123" }] });
  });

  it("returns 500 when request body is invalid JSON", async () => {
    const req = makeRequest("{invalid-json");
    const res = await POST(req);
    assert.equal(res.status, 500);

    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(typeof data.error === "string" && data.error.length > 0);
  });
});
