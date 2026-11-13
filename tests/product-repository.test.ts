import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import type { Product } from "../src/types";
import { getSupabaseClient } from "../src/lib/supabase";
import {
  PRODUCTS_STORAGE_KEY,
  fetchProducts,
  isSupabaseConfigured,
  removeProduct,
  saveProduct,
  updateProductStatus,
  uploadProductImage,
} from "../src/lib/productRepository";

function createMockStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

const sampleProduct: Product = {
  id: "prod-1",
  title: "Jaqueta Jeans Vintage",
  price: 120,
  originalPrice: 180,
  category: "vintage",
  size: "M",
  condition: "Excelente estado (Como Novo)",
  description: "Jaqueta jeans clássica anos 90.",
  brand: "Levi's",
  color: "Azul",
  status: "available",
  images: ["https://example.com/jaqueta.jpg"],
  createdAt: "2026-11-13T10:00:00.000Z",
  tags: ["jeans", "vintage"],
  highlight: true,
};

describe("supabase client & configuration", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  afterEach(() => {
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;

    if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
  });

  it("isSupabaseConfigured returns false when env vars are missing", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    assert.equal(isSupabaseConfigured(), false);
    assert.equal(getSupabaseClient(), null);
  });

  it("isSupabaseConfigured returns false and never throws when URL is invalid", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "not-a-valid-url";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    assert.equal(getSupabaseClient(), null);
    assert.equal(isSupabaseConfigured(), false);
  });

  it("isSupabaseConfigured returns true when valid env vars are set", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "public-anon-key";

    assert.equal(isSupabaseConfigured(), true);
    assert.notEqual(getSupabaseClient(), null);
  });
});

describe("productRepository localStorage fallback", () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hadLocalStorage = "localStorage" in globalThis;
  const originalLocalStorage = (globalThis as { localStorage?: Storage }).localStorage;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    Object.defineProperty(globalThis, "localStorage", {
      value: createMockStorage(),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;

    if (originalKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;

    if (hadLocalStorage) {
      Object.defineProperty(globalThis, "localStorage", {
        value: originalLocalStorage,
        configurable: true,
        writable: true,
      });
    } else {
      delete (globalThis as { localStorage?: Storage }).localStorage;
    }
  });

  it("fetchProducts returns fallback when localStorage is empty", async () => {
    const result = await fetchProducts([sampleProduct]);
    assert.deepEqual(result, [sampleProduct]);
  });

  it("fetchProducts returns fallback safely in SSR without localStorage", async () => {
    delete (globalThis as { localStorage?: Storage }).localStorage;
    const result = await fetchProducts([sampleProduct]);
    assert.deepEqual(result, [sampleProduct]);

    await assert.doesNotReject(() => saveProduct(sampleProduct));
    await assert.doesNotReject(() => updateProductStatus(sampleProduct.id, "sold"));
    await assert.doesNotReject(() => removeProduct(sampleProduct.id));
  });

  it("saveProduct, updateProductStatus, and removeProduct persist in localStorage", async () => {
    await saveProduct(sampleProduct);

    const raw = globalThis.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    assert.ok(raw);
    const saved = await fetchProducts([]);
    assert.equal(saved.length, 1);
    assert.equal(saved[0].id, sampleProduct.id);
    assert.equal(saved[0].status, "available");

    await updateProductStatus(sampleProduct.id, "sold");
    const updated = await fetchProducts([]);
    assert.equal(updated[0].status, "sold");

    await removeProduct(sampleProduct.id);
    const afterRemove = await fetchProducts([]);
    assert.deepEqual(afterRemove, []);
  });

  it("uploadProductImage returns data URL directly when Supabase is unconfigured", async () => {
    const dataUrl = "data:image/png;base64,iVBORw0KGgo=";
    const url = await uploadProductImage(dataUrl);
    assert.equal(url, dataUrl);
  });
});
