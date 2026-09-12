'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, DollarSign, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-burgundy text-brand-nude flex flex-col">
        <div className="p-6">
          <h2 className="font-serif text-2xl tracking-widest text-center">SAONA</h2>
          <p className="text-center text-xs opacity-70 mt-1 uppercase tracking-widest">Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          <Link 
            href="/admin/produtos" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${pathname.includes('/admin/produtos') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}
          >
            <Package size={20} />
            <span>Produtos</span>
          </Link>
          
          <Link 
            href="/admin/financeiro" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${pathname.includes('/admin/financeiro') ? 'bg-brand-gold text-white' : 'hover:bg-white/10'}`}
          >
            <DollarSign size={20} />
            <span>Financeiro</span>
          </Link>
        </nav>

        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md hover:bg-white/10 transition-colors text-left"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
