export default function Footer() {
  return (
    <footer className="bg-brand-burgundy text-brand-nude py-12 mt-24">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        <h2 className="font-serif text-3xl tracking-widest">MAONA</h2>
        <p className="font-light text-sm tracking-wider uppercase">Semijoias</p>

        <div className="flex gap-6 mt-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-gold transition-colors"
          >
            Instagram
          </a>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5519971713924"}?text=${encodeURIComponent("Olá! Gostaria de tirar uma dúvida.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-gold transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <div className="mt-8 text-xs text-brand-nude/60">
          © {new Date().getFullYear()} MAONA Semijoias. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
