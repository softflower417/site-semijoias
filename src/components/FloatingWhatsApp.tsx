"use client";

import { MessageCircle } from "lucide-react";

function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "5519971713924";
  const withoutCountry = digits.startsWith("55") ? digits.slice(2) : digits;
  return `55${withoutCountry.replace(/^0+/, "")}`;
}

export default function FloatingWhatsApp() {
  const whatsappNumber = normalizeWhatsAppNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5519971713924",
  );
  const message = encodeURIComponent(
    "Olá! Gostaria de tirar uma dúvida sobre as peças.",
  );
  const href = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
    >
      <MessageCircle size={26} />
    </a>
  );
}
