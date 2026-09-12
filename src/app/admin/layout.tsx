'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Package, DollarSign, LogOut, Inbox } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Create client safely
  const [supabase] = useState(() => createClient());

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex justify-between items-center bg-brand-burgundy text-brand-nude p-4 z-40 shadow-md">
        <div className="flex flex-col">
          <h2 className="font-serif text-xl tracking-widest leading-none">SAONA</h2>
          <span className="text-[10px] uppercase tracking-widest opacity-70">Admin</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-brand-nude">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* Mobile Hamburger Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-brand-burgundy flex flex-col text-brand-nude">
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <div className="flex flex-col">
              <h2 className="font-serif text-xl tracking-widest leading-none">SAONA</h2>
              <span className="text-[10px] uppercase tracking-widest opacity-70">Admin</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-brand-nude">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <nav className="flex flex-col flex-1 px-6 py-8 space-y-4">
            <Link onClick={() => setMobileMenuOpen(false)} href="/admin/produtos" className={`flex items-center gap-4 px-4 py-4 rounded-md transition-colors ${pathname.includes('/admin/produtos') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}>
              <Package size={24} /><span className="text-lg">Produtos</span>
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/admin/financeiro" className={`flex items-center gap-4 px-4 py-4 rounded-md transition-colors ${pathname.includes('/admin/financeiro') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}>
              <DollarSign size={24} /><span className="text-lg">Financeiro</span>
            </Link>
            <Link onClick={() => setMobileMenuOpen(false)} href="/admin/pedidos" className={`flex items-center gap-4 px-4 py-4 rounded-md transition-colors ${pathname.includes('/admin/pedidos') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}>
              <Inbox size={24} /><span className="text-lg">Pedidos</span>
            </Link>
          </nav>

          <div className="p-6 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-4 w-full rounded-md hover:bg-white/10 transition-colors text-left text-red-300">
              <LogOut size={24} /><span className="text-lg">Sair do painel</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-brand-burgundy text-brand-nude flex-col z-50">
        <div className="p-6">
          <h2 className="font-serif text-2xl tracking-widest text-center">SAONA</h2>
          <p className="text-center text-xs opacity-70 mt-1 uppercase tracking-widest">Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          <Link href="/admin/produtos" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${pathname.includes('/admin/produtos') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}>
            <Package size={20} /><span>Produtos</span>
          </Link>
          <Link href="/admin/financeiro" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${pathname.includes('/admin/financeiro') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}>
            <DollarSign size={20} /><span>Financeiro</span>
          </Link>
          <Link href="/admin/pedidos" className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${pathname.includes('/admin/pedidos') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}>
            <Inbox size={20} /><span>Pedidos</span>
          </Link>
        </nav>

        <div className="p-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-md hover:bg-white/10 transition-colors text-left">
            <LogOut size={20} /><span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 w-full relative">
        {children}
      </main>
    </div>
  );
}
