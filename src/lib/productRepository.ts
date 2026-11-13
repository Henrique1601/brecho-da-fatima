import type { Product } from "@/types";
import { getSupabaseClient, isSupabaseEnvConfigured } from "@/lib/supabase";

export const PRODUCTS_STORAGE_KEY = "brecho_fatima_products";
export const PRODUCT_IMAGES_BUCKET = "product-images";

interface ProductRow {
  id: string;
  title: string;
  price: number | string;
  original_price: number | string | null;
  category: Product["category"];
  size: string;
  condition: Product["condition"];
  description: string;
  brand: string | null;
  color: string | null;
  status: Product["status"];
  images: string[] | null;
  created_at: string;
  tags: string[] | null;
  highlight: boolean | null;
}

function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
    if (typeof globalThis !== "undefined" && "localStorage" in globalThis && globalThis.localStorage) {
      return globalThis.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function readLocalProducts(): Product[] | null {
  const storage = getSafeLocalStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Product[]) : null;
  } catch {
    return null;
  }
}

function writeLocalProducts(products: Product[]): void {
  const storage = getSafeLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Erro ao salvar produtos no localStorage:", error);
  }
}

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    ...(row.original_price != null ? { originalPrice: Number(row.original_price) } : {}),
    category: row.category,
    size: row.size,
    condition: row.condition,
    description: row.description,
    ...(row.brand ? { brand: row.brand } : {}),
    ...(row.color ? { color: row.color } : {}),
    status: row.status,
    images: Array.isArray(row.images) ? row.images : [],
    createdAt: row.created_at,
    ...(Array.isArray(row.tags) ? { tags: row.tags } : {}),
    ...(typeof row.highlight === "boolean" ? { highlight: row.highlight } : {}),
  };
}

function mapProductToRow(product: Product): ProductRow {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    original_price: product.originalPrice ?? null,
    category: product.category,
    size: product.size,
    condition: product.condition,
    description: product.description,
    brand: product.brand ?? null,
    color: product.color ?? null,
    status: product.status,
    images: product.images ?? [],
    created_at: product.createdAt || new Date().toISOString(),
    tags: product.tags ?? [],
    highlight: product.highlight ?? false,
  };
}

function dataUrlToBlob(dataUrl: string): { blob: Blob; extension: string; contentType: string } {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Data URL inválida para upload.");
  }

  const contentType = match[1];
  const base64 = match[2];
  const extension = contentType.split("/")[1]?.split("+")[0] || "png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return {
    blob: new Blob([bytes], { type: contentType }),
    extension,
    contentType,
  };
}

function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === "undefined") {
      reject(new Error("FileReader indisponível neste ambiente."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Falha ao ler arquivo."));
    reader.readAsDataURL(file);
  });
}

export function isSupabaseConfigured(): boolean {
  return isSupabaseEnvConfigured() && getSupabaseClient() !== null;
}

export async function fetchProducts(fallback: Product[] = []): Promise<Product[]> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos no Supabase:", error.message);
      } else if (Array.isArray(data)) {
        return (data as ProductRow[]).map(mapRowToProduct);
      }
    } catch (error) {
      console.error("Falha de conexão com Supabase em fetchProducts:", error);
    }
  }

  const local = readLocalProducts();
  return local ?? fallback;
}

export async function saveProduct(product: Product): Promise<Product> {
  const client = getSupabaseClient();

  if (client) {
    const row = mapProductToRow(product);
    const { data, error } = await client
      .from("products")
      .upsert(row, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      throw new Error(`Erro ao salvar produto no Supabase: ${error.message}`);
    }

    return mapRowToProduct(data as ProductRow);
  }

  const existing = readLocalProducts() ?? [];
  const next = [product, ...existing.filter((item) => item.id !== product.id)];
  writeLocalProducts(next);
  return product;
}

export async function updateProductStatus(
  id: string,
  status: Product["status"]
): Promise<void> {
  const client = getSupabaseClient();

  if (client) {
    const { error } = await client.from("products").update({ status }).eq("id", id);
    if (error) {
      throw new Error(`Erro ao atualizar status no Supabase: ${error.message}`);
    }
    return;
  }

  const existing = readLocalProducts();
  if (!existing) return;

  const next = existing.map((item) => (item.id === id ? { ...item, status } : item));
  writeLocalProducts(next);
}

export async function removeProduct(id: string): Promise<void> {
  const client = getSupabaseClient();

  if (client) {
    const { error } = await client.from("products").delete().eq("id", id);
    if (error) {
      throw new Error(`Erro ao remover produto no Supabase: ${error.message}`);
    }
    return;
  }

  const existing = readLocalProducts();
  if (!existing) return;

  const next = existing.filter((item) => item.id !== id);
  writeLocalProducts(next);
}

export async function uploadProductImage(dataUrlOrFile: string | File | Blob): Promise<string> {
  const client = getSupabaseClient();

  if (!client) {
    if (typeof dataUrlOrFile === "string") {
      return dataUrlOrFile;
    }
    return fileToDataUrl(dataUrlOrFile);
  }

  if (typeof dataUrlOrFile === "string" && !dataUrlOrFile.startsWith("data:")) {
    return dataUrlOrFile;
  }

  let uploadBody: Blob;
  let extension = "png";
  let contentType = "image/png";

  if (typeof dataUrlOrFile === "string") {
    const parsed = dataUrlToBlob(dataUrlOrFile);
    uploadBody = parsed.blob;
    extension = parsed.extension;
    contentType = parsed.contentType;
  } else {
    uploadBody = dataUrlOrFile;
    contentType = dataUrlOrFile.type || "image/png";
    const fileName = "name" in dataUrlOrFile ? dataUrlOrFile.name : "";
    extension = fileName.split(".").pop() || contentType.split("/")[1] || "png";
  }

  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
  const path = `products/${uniqueName}`;

  const { error } = await client.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, uploadBody, { contentType, upsert: false });

  if (error) {
    throw new Error(`Erro ao enviar imagem para o Supabase Storage: ${error.message}`);
  }

  const { data } = client.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
