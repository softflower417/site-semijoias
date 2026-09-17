"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Heart,
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";

interface ProductImage {
  image_url: string;
  sort_order: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  is_on_sale: boolean;
  stock_quantity: number;
  description: string | null;
  material: string | null;
  plating: string | null;
  measurements: string | null;
  warranty: string | null;
  category: string;
  product_images: ProductImage[];
}

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*, product_images(image_url, sort_order)")
        .eq("id", params.id)
        .eq("status", "active")
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        // Ordenar imagens por sort_order
        if (data.product_images) {
          data.product_images.sort(
            (a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order,
          );
        }
        setProduct(data);
      }
      setLoading(false);
    }

    // Verificar favoritos no localStorage
    const favs = JSON.parse(localStorage.getItem("maona_favorites") || "[]");
    setIsFavorite(favs.includes(params.id));

    fetchProduct();
  }, [params.id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem("maona_favorites") || "[]");
    let newFavs;
    if (isFavorite) {
      newFavs = favs.filter((id: string) => id !== params.id);
    } else {
      newFavs = [...favs, params.id];
    }
    localStorage.setItem("maona_favorites", JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    const images = product.product_images || [];
    const coverImage = images[0]?.image_url || "";
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      is_on_sale: product.is_on_sale,
      image_url: coverImage,
      material: product.material,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyWhatsApp = () => {
    if (!product || isOutOfStock) return;
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "55199717173924";
    const price =
      product.is_on_sale && product.sale_price
        ? product.sale_price
        : product.price;
    const productCode = product.material || product.id.slice(0, 8);
    const text = encodeURIComponent(
      `Olá! Tenho interesse nesta peça: *${product.name}* (Cód: ${productCode}) — R$ ${Number(price).toFixed(2).replace(".", ",")}`,
    );
    window.open(`https://wa.me/${number}?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh]">
        <h1 className="font-serif text-3xl text-brand-burgundy mb-4">
          Peça não encontrada
        </h1>
        <p className="text-gray-500 mb-8">
          Esta peça pode ter sido removida ou não está disponível.
        </p>
        <Link
          href="/semijoias"
          className="border border-brand-burgundy text-brand-burgundy px-8 py-3 uppercase tracking-widest text-sm hover:bg-brand-burgundy hover:text-white transition-colors"
        >
          Ver todas as peças
        </Link>
      </div>
    );
  }

  const images = product.product_images || [];
  const isOutOfStock = product.stock_quantity <= 0;
  const displayPrice =
    product.is_on_sale && product.sale_price
      ? product.sale_price
      : product.price;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 uppercase tracking-widest">
        <Link href="/" className="hover:text-brand-burgundy transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/semijoias"
          className="hover:text-brand-burgundy transition-colors"
        >
          Semijoias
        </Link>
        <span>/</span>
        <Link
          href={`/semijoias?category=${product.category}`}
          className="hover:text-brand-burgundy transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-brand-burgundy truncate max-w-[120px]">
          {product.name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-16">
        {/* Galeria de Fotos */}
        <div className="space-y-3">
          {/* Imagem Principal */}
          <div className="aspect-[3/4] bg-white border border-gray-100 relative overflow-hidden">
            {isOutOfStock && (
              <div className="absolute top-4 left-4 bg-gray-900 text-white text-xs px-3 py-1 uppercase tracking-widest z-10">
                Esgotado
              </div>
            )}
            {product.is_on_sale && !isOutOfStock && (
              <div className="absolute top-4 left-4 bg-red-100 text-red-800 text-xs px-3 py-1 uppercase tracking-widest z-10">
                Sale
              </div>
            )}
            {images.length > 0 ? (
              <>
                <img
                  src={images[activeImg]?.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImg(
                          (i) => (i - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImg((i) => (i + 1) % images.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                <span className="text-xs text-gray-300">Sem foto</span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square border-2 overflow-hidden transition-colors ${activeImg === i ? "border-brand-gold" : "border-gray-100 hover:border-gray-300"}`}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-2xl md:text-3xl font-serif text-brand-burgundy leading-tight">
              {product.name}
            </h1>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2 ${isFavorite ? "text-red-500" : "text-gray-400"}`}
              title={
                isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
            >
              <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Preço */}
          <div className="mb-6">
            {product.is_on_sale && product.sale_price ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 line-through text-lg">
                  R$ {Number(product.price).toFixed(2).replace(".", ",")}
                </span>
                <span className="text-2xl font-medium text-red-700">
                  R$ {Number(product.sale_price).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-light text-brand-text">
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 font-light leading-relaxed mb-8 text-sm md:text-base">
              {product.description}
            </p>
          )}

          {/* Botões de ação */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-200
                ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : addedToCart
                      ? "bg-green-600 text-white"
                      : "bg-brand-burgundy text-brand-nude hover:bg-brand-burgundy/90"
                }`}
            >
              <ShoppingBag size={18} />
              {isOutOfStock
                ? "Produto Esgotado"
                : addedToCart
                  ? "✓ Adicionado à sacola!"
                  : "Adicionar à Sacola"}
            </button>

            <button
              onClick={handleBuyWhatsApp}
              disabled={isOutOfStock}
              className={`w-full py-4 uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors border
                ${
                  isOutOfStock
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                }`}
            >
              <MessageCircle size={18} />
              {isOutOfStock ? "Indisponível" : "Comprar pelo WhatsApp"}
            </button>
          </div>

          {/* Especificações */}
          {(product.id || product.measurements || product.warranty) && (
            <div className="border-t border-brand-gold/20 pt-6 space-y-3">
              <h3 className="font-serif text-brand-burgundy text-base mb-3">
                Especificações
              </h3>
              <div className="flex gap-4 text-sm border-b border-gray-50 pb-3">
                <span className="text-gray-400 w-20 flex-shrink-0">Código</span>
                <span className="text-brand-text uppercase tracking-wide">
                  {product.material || product.id.slice(0, 8)}
                </span>
              </div>
              {product.measurements && (
                <div className="flex gap-4 text-sm border-b border-gray-50 pb-3">
                  <span className="text-gray-400 w-20 flex-shrink-0">
                    Medidas
                  </span>
                  <span className="text-brand-text">
                    {product.measurements}
                  </span>
                </div>
              )}
              {product.warranty && (
                <div className="flex gap-4 text-sm pb-3">
                  <span className="text-gray-400 w-20 flex-shrink-0">
                    Garantia
                  </span>
                  <span className="text-brand-text">{product.warranty}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
