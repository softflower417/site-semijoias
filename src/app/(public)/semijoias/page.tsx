import Link from 'next/link';
import { createClient } from '@/lib/supabase/client'; // This should be a server client ideally, but we'll use a fetch approach or direct for now
import Image from 'next/image';

// Para simplificar, vou criar componentes mockados ou uma estrutura de listagem genérica.
export default async function SemijoiasPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category || 'Todas as Peças';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-brand-burgundy text-center mb-8 uppercase tracking-widest">
        {category}
      </h1>
      
      {/* Filtros Simples */}
      <div className="flex justify-between items-center mb-12 border-b border-brand-gold/20 pb-4">
        <span className="text-sm text-gray-500">Exibindo todas as peças</span>
        <select className="bg-transparent border border-brand-gold/40 text-brand-text text-sm py-2 px-4 focus:outline-none">
          <option>Mais recentes</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
        </select>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {/* Este é um placeholder, será substituído por dados do Supabase */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Link href={`/produto/${i}`} key={i} className="group">
            <div className="aspect-[3/4] bg-white relative mb-4 overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-brand-nude/50 flex items-center justify-center text-gray-400">
                <span className="text-xs">Foto da Peça</span>
              </div>
            </div>
            <h2 className="text-sm font-medium text-brand-burgundy mb-1 group-hover:text-brand-gold transition-colors">
              Brinco Exemplo {i}
            </h2>
            <p className="text-brand-text text-sm font-light">R$ 129,90</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
