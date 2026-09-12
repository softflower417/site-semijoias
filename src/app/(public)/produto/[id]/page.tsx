'use client';

import { useState } from 'react';
import { Heart, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function ProdutoPage({ params }: { params: { id: string } }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  // Mock product data for now
  const product = {
    id: params.id,
    name: 'Brinco Gota Dourada',
    price: 189.90,
    sale_price: null,
    is_on_sale: false,
    stock_quantity: 0, // Simulating an out of stock product for example, or you can fetch it
    description: 'Um brinco elegante em formato de gota, perfeito para ocasiões especiais. Possui acabamento impecável e brilho intenso.',
    specs: {
      material: 'Metal Hipoalergênico',
      plating: 'Ouro 18k (10 milésimos)',
      measurements: 'Altura: 3cm | Largura: 1.5cm',
      warranty: '1 ano para defeitos de fabricação'
    },
    image_url: ''
  };

  const isOutOfStock = product.stock_quantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    alert('Peça adicionada ao carrinho!');
  };

  const handleBuyWhatsApp = () => {
    if (isOutOfStock) return;
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const price = isOutOfStock ? product.price : (product.is_on_sale && product.sale_price ? product.sale_price : product.price);
    const text = encodeURIComponent(`Olá! Tenho interesse nesta peça: *${product.name}* — R$ ${Number(price).toFixed(2).replace('.', ',')}`);
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        
        {/* Galeria de Fotos */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-white border border-gray-100 flex items-center justify-center text-gray-400 relative">
            {isOutOfStock && (
               <div className="absolute top-4 left-4 bg-gray-900 text-white text-xs px-3 py-1 uppercase tracking-widest z-10">
                 Esgotado
               </div>
            )}
            Foto Principal
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-white border border-gray-100 flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:border-brand-gold">
                Foto {i}
              </div>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-serif text-brand-burgundy">{product.name}</h1>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="text-2xl font-light text-brand-text mb-8">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </div>

          <p className="text-gray-600 font-light leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-4 mb-10">
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors
                ${isOutOfStock 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-brand-burgundy text-brand-nude hover:bg-brand-burgundy/90'}`}
            >
              <ShoppingBag size={18} />
              {isOutOfStock ? 'Produto Esgotado' : 'Adicionar à Sacola'}
            </button>
            
            <button 
              onClick={handleBuyWhatsApp}
              disabled={isOutOfStock}
              className={`w-full py-4 uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors border
                ${isOutOfStock
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white'}`}
            >
              <MessageCircle size={18} />
              {isOutOfStock ? 'Indisponível' : 'Comprar pelo WhatsApp'}
            </button>
          </div>

          <div className="border-t border-brand-gold/20 pt-8 space-y-4">
            <h3 className="font-serif text-brand-burgundy text-lg mb-4">Especificações</h3>
            <div className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500">Material</span>
              <span className="col-span-2 text-brand-text">{product.specs.material}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500">Banho</span>
              <span className="col-span-2 text-brand-text">{product.specs.plating}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500">Medidas</span>
              <span className="col-span-2 text-brand-text">{product.specs.measurements}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500">Garantia</span>
              <span className="col-span-2 text-brand-text">{product.specs.warranty}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
