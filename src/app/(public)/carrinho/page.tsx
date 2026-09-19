"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, MessageCircle } from "lucide-react";

export default function CarrinhoPage() {
  const { items, removeItem, getCartTotal, clearCart } = useCartStore();

  const handleCheckout = () => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "55199717173924";

    let text = "Olá! Gostaria de fazer o pedido das seguintes peças:\n\n";
    items.forEach((item) => {
      const price =
        item.is_on_sale && item.sale_price ? item.sale_price : item.price;
      let itemText = `• ${item.quantity}x ${item.name}`;
      if (item.material) {
        itemText += ` (Cód: ${item.material})`;
      }
      itemText += ` — R$ ${Number(price).toFixed(2).replace(".", ",")}\n`;
      text += itemText;
    });
    text += `\n*Total: R$ ${getCartTotal().toFixed(2).replace(".", ",")}*`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-4xl font-serif text-brand-burgundy text-center mb-12 uppercase tracking-widest">
        Sua Sacola
      </h1>

      {items.length === 0 ? (
        <div className="text-center space-y-6">
          <p className="text-gray-500">Sua sacola está vazia no momento.</p>
          <Link
            href="/semijoias"
            className="inline-block border border-brand-burgundy text-brand-burgundy px-8 py-3 uppercase tracking-widest text-sm hover:bg-brand-burgundy hover:text-white transition-colors"
          >
            Ver Semijoias
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12">
          {/* Lista de Itens */}
          <div className="md:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b border-gray-100 pb-6"
              >
                <div className="w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 text-[10px] uppercase tracking-wider">
                      Sem foto
                    </div>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-serif text-brand-burgundy text-lg">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Qtd: {item.quantity}
                    </p>
                    {item.material && (
                      <p className="text-xs text-gray-400 mt-1">
                        Cód: {item.material}
                      </p>
                    )}
                  </div>
                  <p className="text-brand-text font-medium">
                    R${" "}
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="bg-brand-nude p-6 h-fit border border-brand-gold/20">
            <h3 className="font-serif text-brand-burgundy text-xl mb-6">
              Resumo
            </h3>

            <div className="flex justify-between mb-4 text-brand-text">
              <span>Subtotal</span>
              <span>R$ {getCartTotal().toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="border-t border-brand-gold/20 pt-4 flex justify-between font-medium text-lg mb-8">
              <span>Total</span>
              <span>R$ {getCartTotal().toFixed(2).replace(".", ",")}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] text-white py-4 uppercase tracking-widest text-sm hover:bg-[#1EBE5A] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              Finalizar pelo WhatsApp
            </button>
            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
              Você será redirecionada para o WhatsApp com os itens da sua
              sacola. O pagamento e o frete serão combinados por lá.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
