'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, ImagePlus, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ExistingImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface NewImagePreview {
  file: File;
  preview: string;
  tempId: string;
}

export default function EditarProduto({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: '', description: '', price: '', is_on_sale: false,
    sale_price: '', category: 'Brincos', stock_quantity: '1',
    material: '', plating: '', measurements: '',
    warranty: '1 ano para defeitos de fabricação', status: 'active'
  });

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(id, image_url, sort_order)')
        .eq('id', params.id)
        .single();

      if (error || !data) { router.push('/admin/produtos'); return; }

      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: String(data.price || ''),
        is_on_sale: data.is_on_sale || false,
        sale_price: data.sale_price ? String(data.sale_price) : '',
        category: data.category || 'Brincos',
        stock_quantity: String(data.stock_quantity ?? 1),
        material: data.material || '',
        plating: data.plating || '',
        measurements: data.measurements || '',
        warranty: data.warranty || '1 ano para defeitos de fabricação',
        status: data.status || 'active',
      });

      const imgs = (data.product_images || []).sort((a: ExistingImage, b: ExistingImage) => a.sort_order - b.sort_order);
      setExistingImages(imgs);
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map(file => ({
      file, preview: URL.createObjectURL(file), tempId: Math.random().toString(36).substr(2, 9)
    }));
    setNewImages(prev => [...prev, ...previews]);
  };

  const deleteExistingImage = async (img: ExistingImage) => {
    await supabase.from('product_images').delete().eq('id', img.id);
    setExistingImages(prev => prev.filter(i => i.id !== img.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const priceNum = parseFloat(formData.price.replace(',', '.'));
    const salePriceNum = formData.sale_price ? parseFloat(formData.sale_price.replace(',', '.')) : null;
    const stockNum = parseInt(formData.stock_quantity, 10) || 0;
    const newStatus = stockNum <= 0 ? 'out_of_stock' : formData.status;

    await supabase.from('products').update({
      name: formData.name, description: formData.description, price: priceNum,
      is_on_sale: formData.is_on_sale, sale_price: salePriceNum,
      category: formData.category, stock_quantity: stockNum,
      material: formData.material, plating: formData.plating,
      measurements: formData.measurements, warranty: formData.warranty, status: newStatus,
    }).eq('id', params.id);

    // Upload novas imagens
    const baseOrder = existingImages.length;
    for (let i = 0; i < newImages.length; i++) {
      const img = newImages[i];
      const ext = img.file.name.split('.').pop();
      const path = `products/${params.id}/${Date.now()}_${i}.${ext}`;
      const { data: uploadData } = await supabase.storage.from('product-images').upload(path, img.file, { upsert: true });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);
        await supabase.from('product_images').insert([{
          product_id: params.id, image_url: urlData.publicUrl, sort_order: baseOrder + i,
        }]);
      }
    }

    setSaving(false);
    router.push('/admin/produtos');
    router.refresh();
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-gray-400 hover:text-brand-burgundy">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-serif text-brand-burgundy">Editar Produto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow border border-gray-100">

        {/* Fotos */}
        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-1 border-b border-gray-100 pb-2">Fotos do Produto</h2>
          <p className="text-xs text-gray-400 mb-4">A primeira foto é a capa. Você pode adicionar novas ou remover existentes.</p>
          <div className="flex flex-wrap gap-4">
            {existingImages.map((img, i) => (
              <div key={img.id} className="relative w-28 h-28 border border-gray-200 rounded overflow-hidden group">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                {i === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-brand-gold text-white py-0.5">CAPA</span>}
                <button type="button" onClick={() => deleteExistingImage(img)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))}
            {newImages.map(img => (
              <div key={img.tempId} className="relative w-28 h-28 border border-blue-200 rounded overflow-hidden group">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-blue-500 text-white py-0.5">NOVA</span>
                <button type="button" onClick={() => setNewImages(prev => prev.filter(n => n.tempId !== img.tempId))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100">
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="w-28 h-28 border-2 border-dashed border-gray-200 hover:border-brand-gold flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-gold transition-colors rounded cursor-pointer">
              <ImagePlus size={22} />
              <span className="text-[10px]">Adicionar</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewImages} />
            </label>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">Informações Básicas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Peça *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none">
                {['Brincos','Colares','Pulseiras','Braceletes','Anéis'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qtd em Estoque *</label>
              <input required type="number" min="0" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"></textarea>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">Precificação</h2>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Normal (R$) *</label>
              <input required type="text" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none" />
            </div>
            <div className="flex items-center h-[42px] pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_on_sale" checked={formData.is_on_sale} onChange={handleChange} className="w-4 h-4 rounded" />
                <span className="text-sm font-medium text-gray-700">Ativar Sale?</span>
              </label>
            </div>
            {formData.is_on_sale && (
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">Preço Promocional (R$)</label>
                <input type="text" name="sale_price" value={formData.sale_price} onChange={handleChange} className="w-full px-4 py-2 border border-red-300 rounded focus:ring-1 focus:ring-red-500 outline-none" />
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">Especificações Técnicas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Material', name: 'material', placeholder: 'Ex: Prata 925' },
              { label: 'Banho', name: 'plating', placeholder: 'Ex: Ouro 18k' },
              { label: 'Medidas', name: 'measurements', placeholder: 'Ex: 40cm + 5cm' },
              { label: 'Garantia', name: 'warranty', placeholder: '' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input type="text" name={f.name} placeholder={f.placeholder} value={(formData as any)[f.name]} onChange={handleChange} className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none" />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">Visibilidade</h2>
          <div className="flex gap-4">
            {[{ v: 'active', l: 'Ativo (visível)' }, { v: 'inactive', l: 'Inativo (oculto)' }].map(opt => (
              <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" value={opt.v} checked={formData.status === opt.v} onChange={handleChange} />
                <span className="text-sm text-gray-700">{opt.l}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="bg-brand-burgundy text-white px-8 py-3 rounded uppercase tracking-widest text-sm hover:bg-brand-burgundy/90 transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
