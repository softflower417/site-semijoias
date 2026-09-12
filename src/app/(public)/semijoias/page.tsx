import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getProducts(category: string | undefined) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set() {}, remove() {},
      },
    }
  );

  let query = supabase
    .from('products')
    .select(`*, product_images(image_url, sort_order)`)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return data || [];
}

export default async function SemijoiasPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const category = searchParams.category;
  const sort = searchParams.sort || 'recent';

  let products = await getProducts(category);

  if (sort === 'price_asc') {
    products = products.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products = products.sort((a: any, b: any) => b.price - a.price);
  }

  const categories = ['Brincos', 'Pulseiras', 'Braceletes', 'Colares', 'Anéis'];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-brand-burgundy text-center mb-4 uppercase tracking-widest">
        {category || 'Semijoias'}
      </h1>

      {/* Subcategorias */}
      <div className="flex gap-4 justify-center flex-wrap mb-8">
        <Link
          href="/semijoias"
          className={`text-sm uppercase tracking-widest pb-1 border-b transition-colors ${!category ? 'border-brand-burgundy text-brand-burgundy' : 'border-transparent text-gray-400 hover:text-brand-burgundy'}`}
        >
          Todos
        </Link>
        {categories.map(cat => (
          <Link
            key={cat}
            href={`/semijoias?category=${cat}`}
            className={`text-sm uppercase tracking-widest pb-1 border-b transition-colors ${category === cat ? 'border-brand-burgundy text-brand-burgundy' : 'border-transparent text-gray-400 hover:text-brand-burgundy'}`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex justify-between items-center mb-10 border-b border-brand-gold/20 pb-4">
        <span className="text-sm text-gray-400">{products.length} {products.length === 1 ? 'peça' : 'peças'}</span>
        <div className="flex gap-2">
          <Link href={`/semijoias${category ? `?category=${category}&` : '?'}sort=recent`} className={`text-xs px-3 py-1 border ${sort === 'recent' ? 'border-brand-burgundy text-brand-burgundy' : 'border-gray-200 text-gray-400'}`}>Mais recentes</Link>
          <Link href={`/semijoias${category ? `?category=${category}&` : '?'}sort=price_asc`} className={`text-xs px-3 py-1 border ${sort === 'price_asc' ? 'border-brand-burgundy text-brand-burgundy' : 'border-gray-200 text-gray-400'}`}>Menor preço</Link>
          <Link href={`/semijoias${category ? `?category=${category}&` : '?'}sort=price_desc`} className={`text-xs px-3 py-1 border ${sort === 'price_desc' ? 'border-brand-burgundy text-brand-burgundy' : 'border-gray-200 text-gray-400'}`}>Maior preço</Link>
        </div>
      </div>

      {/* Grid de Produtos */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="font-serif text-2xl mb-2">Nenhuma peça encontrada</p>
          <p className="text-sm">Em breve novas peças serão adicionadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((product: any) => {
            const coverImage = product.product_images
              ?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url;

            return (
              <Link href={`/produto/${product.id}`} key={product.id} className="group">
                <div className="aspect-[3/4] bg-white relative mb-3 overflow-hidden border border-gray-100">
                  {product.is_on_sale && (
                    <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-[10px] px-2 py-0.5 z-10 uppercase tracking-wider">Sale</span>
                  )}
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                      <span className="text-xs">Sem foto</span>
                    </div>
                  )}
                </div>
                <h2 className="text-sm font-medium text-brand-burgundy mb-1 group-hover:text-brand-gold transition-colors line-clamp-2">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 text-sm font-light">
                  {product.is_on_sale && product.sale_price ? (
                    <>
                      <span className="text-gray-400 line-through">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                      <span className="text-red-700 font-medium">R$ {Number(product.sale_price).toFixed(2).replace('.', ',')}</span>
                    </>
                  ) : (
                    <span className="text-brand-text">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
