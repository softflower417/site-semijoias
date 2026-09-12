import Link from 'next/link';

export default function SalePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-red-800 mb-4 uppercase tracking-widest">
          SALE
        </h1>
        <p className="text-brand-text/80 text-lg">Peças selecionadas com condições especiais.</p>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {[1, 2, 3, 4].map((i) => (
          <Link href={`/produto/${i}`} key={i} className="group">
            <div className="aspect-[3/4] bg-white relative mb-4 overflow-hidden border border-gray-100">
              <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs px-2 py-1 z-10">
                SALE
              </span>
              <div className="absolute inset-0 bg-brand-nude/50 flex items-center justify-center text-gray-400">
                <span className="text-xs">Foto da Peça</span>
              </div>
            </div>
            <h2 className="text-sm font-medium text-brand-burgundy mb-1 group-hover:text-brand-gold transition-colors">
              Brinco Exemplo {i}
            </h2>
            <div className="flex gap-2 text-sm font-light">
              <span className="text-gray-400 line-through">R$ 159,90</span>
              <span className="text-red-700">R$ 99,90</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
