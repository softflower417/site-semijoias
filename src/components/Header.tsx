"use client";

import Link from "next/link";
import { ShoppingBag, Search, Heart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-brand-nude/90 backdrop-blur-md border-b border-brand-gold/20">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-brand-burgundy p-2 -ml-2"
          >
            <Menu size={24} />
          </button>

          {/* Navigation - Left */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-widest text-brand-burgundy">
            <Link href="/" className="hover:text-brand-gold transition-colors">
              HOME
            </Link>
            <div className="group relative">
              <Link
                href="/semijoias"
                className="hover:text-brand-gold transition-colors flex items-center gap-1"
              >
                SEMIJOIAS ▾
              </Link>
              <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-brand-nude border border-brand-gold/20 p-4 shadow-lg min-w-48 gap-3 z-50">
                <Link
                  href="/semijoias?category=Brincos"
                  className="hover:text-brand-gold transition-colors"
                >
                  Brincos
                </Link>
                <Link
                  href="/semijoias?category=Pulseiras"
                  className="hover:text-brand-gold transition-colors"
                >
                  Pulseiras
                </Link>
                <Link
                  href="/semijoias?category=Braceletes"
                  className="hover:text-brand-gold transition-colors"
                >
                  Braceletes
                </Link>
                <Link
                  href="/semijoias?category=Colares"
                  className="hover:text-brand-gold transition-colors"
                >
                  Colares
                </Link>
                <Link
                  href="/semijoias?category=Anéis"
                  className="hover:text-brand-gold transition-colors"
                >
                  Anéis
                </Link>
              </div>
            </div>
            <Link
              href="/sale"
              className="text-red-800 font-bold hover:text-brand-gold transition-colors"
            >
              SALE
            </Link>
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex-1 flex justify-center md:flex-none">
            <span className="font-serif text-3xl md:text-4xl text-brand-burgundy tracking-widest">
              MAONA
            </span>
          </Link>

          {/* Actions - Right */}
          <div className="flex items-center gap-4 md:gap-6 text-brand-burgundy">
            <button className="hover:text-brand-gold transition-colors">
              <Search size={20} />
            </button>
            <Link
              href="/favoritos"
              className="hover:text-brand-gold transition-colors hidden md:block"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/carrinho"
              className="hover:text-brand-gold transition-colors relative"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Movido para FORA do header para fugir do stacking context do blur */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] bg-[#F4EFEA] flex flex-col overflow-y-auto md:hidden">
          {/* Topo */}
          <div className="flex justify-between items-center px-4 h-20 border-b border-brand-gold/20">
            <span className="font-serif text-3xl text-brand-burgundy tracking-widest pl-2">
              MAONA
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-burgundy p-2"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navegação */}
          <nav className="flex flex-col px-6 py-8 gap-1">
            <Link
              onClick={() => setMobileMenuOpen(false)}
              href="/"
              className="text-brand-burgundy uppercase tracking-widest py-4 border-b border-brand-gold/10 text-base font-medium"
            >
              Home
            </Link>

            <div className="border-b border-brand-gold/10">
              <p className="text-brand-burgundy uppercase tracking-widest py-4 text-base font-medium">
                Semijoias
              </p>
              <div className="flex flex-col gap-3 pl-4 pb-4">
                {["Brincos", "Pulseiras", "Braceletes", "Colares", "Anéis"].map(
                  (cat) => (
                    <Link
                      key={cat}
                      onClick={() => setMobileMenuOpen(false)}
                      href={`/semijoias?category=${cat}`}
                      className="text-brand-text/80 py-1 text-sm hover:text-brand-gold transition-colors uppercase tracking-wider"
                    >
                      {cat}
                    </Link>
                  ),
                )}
              </div>
            </div>

            <Link
              onClick={() => setMobileMenuOpen(false)}
              href="/sale"
              className="text-red-800 uppercase tracking-widest py-4 border-b border-brand-gold/10 text-base font-bold"
            >
              Sale
            </Link>

            <Link
              onClick={() => setMobileMenuOpen(false)}
              href="/favoritos"
              className="text-brand-burgundy uppercase tracking-widest py-4 border-b border-brand-gold/10 text-base font-medium"
            >
              Favoritos
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
