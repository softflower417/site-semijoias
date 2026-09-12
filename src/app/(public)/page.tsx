import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="h-[70vh] bg-brand-gold/10 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif text-brand-burgundy mb-6">SAONA</h1>
          <p className="text-lg md:text-xl text-brand-text/80 uppercase tracking-[0.2em] mb-10">Brilho em cada detalhe</p>
          <Link href="/semijoias" className="border border-brand-burgundy text-brand-burgundy px-10 py-4 uppercase tracking-widest hover:bg-brand-burgundy hover:text-brand-nude transition-colors duration-300">
            Descubra a Coleção
          </Link>
        </div>
      </section>

      {/* Categorias - DESCUBRA SAONA */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl font-serif text-brand-burgundy text-center mb-16 tracking-widest">DESCUBRA SAONA</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {['Brincos', 'Colares', 'Pulseiras', 'Anéis'].map((cat) => (
            <Link href={`/semijoias?category=${cat}`} key={cat} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-white overflow-hidden mb-4 relative">
                {/* Placeholder para imagem real */}
                <div className="absolute inset-0 bg-brand-gold/5 group-hover:bg-brand-gold/10 transition-colors" />
                <div className="w-full h-full flex items-center justify-center text-brand-gold/40">
                  <span className="font-serif text-xl">{cat}</span>
                </div>
              </div>
              <h3 className="text-center text-brand-text uppercase tracking-widest text-sm">{cat}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
