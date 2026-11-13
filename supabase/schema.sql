-- Brechó da Fátima — Supabase Schema & Storage Setup
-- Execute este script no SQL Editor do seu projeto Supabase.

-- 1. Tabela de produtos (espelha `Product` em src/types/index.ts)
create table if not exists public.products (
  id text primary key,
  title text not null,
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2) check (original_price is null or original_price >= 0),
  category text not null check (
    category in ('feminino', 'masculino', 'calcados', 'acessorios', 'vintage', 'infantil')
  ),
  size text not null,
  condition text not null check (
    condition in (
      'Novo com Etiqueta',
      'Excelente estado (Como Novo)',
      'Ótimo estado',
      'Bom estado vintage'
    )
  ),
  description text not null default '',
  brand text,
  color text,
  status text not null default 'available' check (status in ('available', 'sold')),
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  tags text[] not null default '{}',
  highlight boolean not null default false
);

create index if not exists idx_products_status on public.products (status);
create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_created_at on public.products (created_at desc);

-- 2. Row Level Security (RLS)
alter table public.products enable row level security;

-- Leitura pública do catálogo
drop policy if exists "Public can view products" on public.products;
create policy "Public can view products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Escrita restrita a usuários autenticados (recomendado para produção)
drop policy if exists "Authenticated users can insert products" on public.products;
create policy "Authenticated users can insert products"
  on public.products
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update products" on public.products;
create policy "Authenticated users can update products"
  on public.products
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete products" on public.products;
create policy "Authenticated users can delete products"
  on public.products
  for delete
  to authenticated
  using (true);

-- DEMO / PROTOTIPAGEM (descomente apenas se quiser permitir escrita anônima sem login):
-- create policy "Anon demo can insert products"
--   on public.products for insert to anon with check (true);
-- create policy "Anon demo can update products"
--   on public.products for update to anon using (true) with check (true);
-- create policy "Anon demo can delete products"
--   on public.products for delete to anon using (true);

-- 3. Storage Bucket para fotos das peças
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Leitura pública das imagens
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'product-images');

-- Upload restrito a usuários autenticados
drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- DEMO / PROTOTIPAGEM (descomente apenas se quiser permitir upload anônimo):
-- create policy "Anon demo can upload product images"
--   on storage.objects for insert to anon with check (bucket_id = 'product-images');
