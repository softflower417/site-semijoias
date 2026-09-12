'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, ImagePlus, X, Sparkles } from 'lucide-react';

export default function RequestSection() {
  const [supabase] = useState(() => createClient());
  const [form, setForm] = useState({ name: '', whatsapp: '', message: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let image_url: string | null = null;

    // Upload da imagem se houver
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `requests/${Date.now()}.${ext}`;
      const { data, error: uploadError } = await supabase.storage
        .from('request-images')
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        // Falha no upload da imagem, continuamos sem ela
        console.error('Erro upload:', uploadError.message);
      } else if (data) {
        const { data: urlData } = supabase.storage.from('request-images').getPublicUrl(data.path);
        image_url = urlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from('customer_requests').insert([{
      name: form.name,
      whatsapp: form.whatsapp,
      message: form.message,
      image_url,
    }]);

    setLoading(false);

    if (insertError) {
      setError('Não foi possível enviar sua solicitação. Tente novamente.');
    } else {
      setSuccess(true);
      setForm({ name: '', whatsapp: '', message: '' });
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <section className="py-24 bg-brand-burgundy text-brand-nude">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Título */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Sparkles size={28} className="text-brand-gold" />
          </div>
          <h2 className="text-3xl font-serif tracking-widest mb-4">PEÇA SOB ENCOMENDA</h2>
          <p className="text-brand-nude/70 font-light leading-relaxed">
            Não encontrou o que procurava? Envie sua sugestão ou referência e vamos buscar a peça ideal para você.
          </p>
        </div>

        {success ? (
          <div className="text-center py-12">
            <div className="text-brand-gold text-5xl mb-4">✦</div>
            <h3 className="font-serif text-2xl mb-3">Solicitação recebida!</h3>
            <p className="text-brand-nude/70 mb-8">Entraremos em contato pelo WhatsApp em breve.</p>
            <button
              onClick={() => setSuccess(false)}
              className="border border-brand-gold text-brand-gold px-8 py-3 uppercase tracking-widest text-sm hover:bg-brand-gold hover:text-white transition-colors"
            >
              Fazer outro pedido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome e WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-nude/60 mb-2">Seu nome *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Luiza"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/10 border border-brand-nude/20 text-brand-nude placeholder-brand-nude/40 px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-brand-nude/60 mb-2">WhatsApp *</label>
                <input
                  required
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.whatsapp}
                  onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full bg-white/10 border border-brand-nude/20 text-brand-nude placeholder-brand-nude/40 px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-nude/60 mb-2">Descreva o que você procura *</label>
              <textarea
                required
                rows={4}
                placeholder="Ex: Brinco argola dourada grande, colar delicado com estrela..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white/10 border border-brand-nude/20 text-brand-nude placeholder-brand-nude/40 px-4 py-3 focus:outline-none focus:border-brand-gold transition-colors resize-none"
              />
            </div>

            {/* Upload de Imagem (opcional) */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-brand-nude/60 mb-2">Imagem de referência (opcional)</label>
              {imagePreview ? (
                <div className="relative w-32 h-32">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover border border-brand-nude/20" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-brand-nude/30 cursor-pointer hover:border-brand-gold transition-colors">
                  <ImagePlus size={24} className="text-brand-nude/40 mb-2" />
                  <span className="text-xs text-brand-nude/40">Clique para adicionar uma foto de referência</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-white py-4 uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>

            <p className="text-center text-xs text-brand-nude/40">
              Após enviar, entraremos em contato pelo WhatsApp para confirmar o pedido.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
