import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSaleProducts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  const cookieStore = cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) { return cookieStore.get(name)?.value; },
      set() {}, remove() {},
    },
  });

  const { data } = await supabase
    .from('products')
    .select('*, product_images(image_url, sort_order)')
    .eq('is_on_sale', true)
    .order('created_at', { ascending: false });

  return data || [];
}

export default async function SalePage() {
  const products = await getSaleProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-red-800 mb-3 uppercase tracking-widest">SALE</h1>
        <p className="text-brand-text/70 text-sm uppercase tracking-widest">Peças selecionadas com condições especiais</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="font-serif text-2xl mb-2">Nenhuma peça em promoção</p>
          <p className="text-sm mb-8">Fique de olho! Em breve teremos novidades.</p>
          <Link href="/semijoias" className="border border-brand-burgundy text-brand-burgundy px-8 py-3 uppercase tracking-widest text-sm hover:bg-brand-burgundy hover:text-white transition-colors">
            Ver coleção completa
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {products.map((product: any) => {
            const images = (product.product_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
            const coverImage = images[0]?.image_url;

            return (
              <Link href={`/produto/${product.id}`} key={product.id} className="group">
                <div className="aspect-[3/4] bg-white relative mb-3 overflow-hidden border border-gray-100">
                  <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-[10px] px-2 py-0.5 z-10 uppercase tracking-wider">Sale</span>
                  {product.status !== 'active' && (
                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] px-2 py-0.5 z-10 uppercase tracking-wider">ESGOTADO</span>
                  )}
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.status !== 'active' ? 'opacity-60' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-200 text-xs">Sem foto</div>
                  )}
                </div>
                <h2 className="text-sm font-medium text-brand-burgundy mb-1 group-hover:text-brand-gold transition-colors line-clamp-2">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 text-sm font-light flex-wrap">
                  <span className="text-gray-400 line-through">R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                  <span className="text-red-700 font-medium">R$ {Number(product.sale_price).toFixed(2).replace('.', ',')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
