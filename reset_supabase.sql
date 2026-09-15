-- ATENÇÃO:
-- Este script apaga todos os dados das tabelas abaixo e recria a estrutura do banco.
-- Use somente se o banco estiver vazio ou você souber que vai perder tudo.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Apaga tudo relacionado ao catálogo e pedidos
DROP TABLE IF EXISTS customer_requests CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;

-- Apaga buckets de storage se existirem
DELETE FROM storage.objects
WHERE bucket_id IN ('product-images', 'request-images');

DELETE FROM storage.buckets
WHERE id IN ('product-images', 'request-images');

COMMIT;

-- 1. Tabela de Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  is_on_sale BOOLEAN DEFAULT FALSE,
  category TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 1,
  material TEXT,
  plating TEXT,
  measurements TEXT,
  warranty TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Imagens de Produtos
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- 3. Tabela de Vendas
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT
);

-- 4. Tabela de Despesas
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 5. Tabela de Pedidos/Sugestões dos Clientes
CREATE TABLE customer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'seen', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_requests ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública dos produtos ativos
CREATE POLICY "Public can view active products"
ON products FOR SELECT
USING (status = 'active');

CREATE POLICY "Admin full access on products"
ON products FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Public can view product images"
ON product_images FOR SELECT
USING (true);

CREATE POLICY "Admin full access on product images"
ON product_images FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Admin full access on sales"
ON sales FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Admin full access on expenses"
ON expenses FOR ALL
TO authenticated
USING (true);

CREATE POLICY "Anyone can insert requests"
ON customer_requests FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Admin full access on customer_requests"
ON customer_requests FOR ALL
TO authenticated
USING (true);

-- Cria buckets públicos para as imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('request-images', 'request-images', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública do storage
CREATE POLICY "Public can view product images in storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Public can view request images in storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'request-images');

-- Upload/alteração somente por usuários autenticados
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload request images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'request-images');

CREATE POLICY "Authenticated users can update request images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'request-images')
WITH CHECK (bucket_id = 'request-images');

CREATE POLICY "Authenticated users can delete request images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'request-images');
