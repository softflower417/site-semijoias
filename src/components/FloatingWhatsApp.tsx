'use client';

import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const message = encodeURIComponent('Olá! Gostaria de falar com a SAONA.');
  const href = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center gap-2"
    >
      <MessageCircle size={24} />
      <span className="hidden md:inline font-medium text-sm pr-2">Falar com a SAONA</span>
    </a>
  );
}
