-- SQL Schema para SAONA Semijoias

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

-- RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para `products`
-- Públicos (anon) podem ler produtos ativos
CREATE POLICY "Public can view active products" 
ON products FOR SELECT 
USING (status = 'active');

-- Admin (authenticated) pode fazer tudo
CREATE POLICY "Admin full access on products" 
ON products FOR ALL 
TO authenticated 
USING (true);

-- Políticas para `product_images`
-- Públicos podem ver imagens
CREATE POLICY "Public can view product images" 
ON product_images FOR SELECT 
USING (true);

-- Admin (authenticated) pode fazer tudo
CREATE POLICY "Admin full access on product images" 
ON product_images FOR ALL 
TO authenticated 
USING (true);

-- Políticas para `sales` e `expenses`
-- Somente admin pode ver e modificar
CREATE POLICY "Admin full access on sales" 
ON sales FOR ALL 
TO authenticated 
USING (true);

CREATE POLICY "Admin full access on expenses" 
ON expenses FOR ALL 
TO authenticated 
USING (true);

-- Políticas para `customer_requests`
-- Qualquer visitante pode INSERIR um pedido (enviar solicitação)
CREATE POLICY "Anyone can insert requests" 
ON customer_requests FOR INSERT 
TO anon 
WITH CHECK (true);

-- Somente admin pode ler e gerenciar pedidos
CREATE POLICY "Admin full access on customer_requests" 
ON customer_requests FOR ALL 
TO authenticated 
USING (true);

-- Storage: criar buckets públicos para imagens do catálogo e dos pedidos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('request-images', 'request-images', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir leitura pública das imagens do catálogo
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Public can view request images"
ON storage.objects FOR SELECT
USING (bucket_id = 'request-images');

-- Permitir upload/alteração apenas para usuários autenticados
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
