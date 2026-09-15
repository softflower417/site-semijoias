"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavoritosPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    async function fetchFavorites() {
      const ids: string[] = JSON.parse(
        localStorage.getItem("maona_favorites") || "[]",
      );

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("*, product_images(image_url, sort_order)")
        .in("id", ids)
        .eq("status", "active");

      setProducts(data || []);
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  const removeFavorite = (id: string) => {
    const favs = JSON.parse(localStorage.getItem("maona_favorites") || "[]");
    const newFavs = favs.filter((fid: string) => fid !== id);
    localStorage.setItem("maona_favorites", JSON.stringify(newFavs));
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-serif text-brand-burgundy text-center mb-12 uppercase tracking-widest">
        Favoritos
      </h1>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <Heart size={48} className="text-gray-200 mx-auto" />
          <p className="text-gray-400 font-light">
            Você ainda não salvou nenhuma peça como favorita.
          </p>
          <Link
            href="/semijoias"
            className="inline-block border border-brand-burgundy text-brand-burgundy px-8 py-3 uppercase tracking-widest text-sm hover:bg-brand-burgundy hover:text-white transition-colors"
          >
            Descobrir peças
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((product: any) => {
            const images = (product.product_images || []).sort(
              (a: any, b: any) => a.sort_order - b.sort_order,
            );
            const coverImage = images[0]?.image_url;

            return (
              <div key={product.id} className="group relative">
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full text-red-500 hover:text-red-700 transition-colors shadow-sm"
                  title="Remover dos favoritos"
                >
                  <Heart size={16} fill="currentColor" />
                </button>

                <Link href={`/produto/${product.id}`}>
                  <div className="aspect-[3/4] bg-white relative mb-3 overflow-hidden border border-gray-100">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200 text-xs">
                        Sem foto
                      </div>
                    )}
                  </div>
                  <h2 className="text-sm font-medium text-brand-burgundy mb-1 group-hover:text-brand-gold transition-colors line-clamp-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-light">
                    {product.is_on_sale && product.sale_price ? (
                      <>
                        <span className="text-gray-400 line-through">
                          R${" "}
                          {Number(product.price).toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-red-700 font-medium">
                          R${" "}
                          {Number(product.sale_price)
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                      </>
                    ) : (
                      <span className="text-brand-text">
                        R$ {Number(product.price).toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
