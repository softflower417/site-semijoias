import Link from "next/link";
import RequestSection from "@/components/RequestSection";

export default function Home() {
  return (
    <div>
      {/* Categorias - DESCUBRA MAONA */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-base md:text-2xl font-serif text-brand-burgundy text-center mb-8 md:mb-14 tracking-widest uppercase">
          Descubra Maona
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { name: "Brincos", src: "/categorias/saona_capa_brincos.png" },
            { name: "Colares", src: "/categorias/saona_capa_colares.png" },
            { name: "Pulseiras", src: "/categorias/saona_capa_pulseiras.png" },
            { name: "Anéis", src: "/categorias/saona_capa_aneis.png" },
          ].map((cat) => (
            <Link
              href={`/semijoias?category=${cat.name}`}
              key={cat.name}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] bg-brand-nude/50 overflow-hidden mb-4 relative">
                <img
                  src={cat.src}
                  alt={`Categoria ${cat.name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="hidden absolute inset-0 flex items-center justify-center text-brand-gold/40">
                  <span className="font-serif text-xl">{cat.name}</span>
                </div>
              </div>
              <h3 className="text-center text-brand-text uppercase tracking-widest text-sm">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção de Pedidos/Sugestões */}
      <RequestSection />
    </div>
  );
}
