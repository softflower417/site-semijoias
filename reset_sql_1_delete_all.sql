-- PASSO 1: APAGAR TUDO DAS TABELAS DO BANCO
-- Atenção: isso remove todos os dados e estruturas do banco do projeto.
-- Use somente se o banco estiver vazio ou se você quiser zerar tudo.
--
-- IMPORTANTE:
-- As tabelas de storage do Supabase não podem ser apagadas via SQL direto.
-- O Supabase bloqueia isso para evitar perda acidental.
-- Para remover buckets de imagem, use o painel do Supabase:
-- Storage > Buckets > clique no bucket > Delete bucket.

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS customer_requests CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;

COMMIT;
