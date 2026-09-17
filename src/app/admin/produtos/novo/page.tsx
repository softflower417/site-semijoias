"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ImagePlus, X, GripVertical } from "lucide-react";
import Link from "next/link";

interface ImagePreview {
  file: File;
  preview: string;
  id: string;
}

export default function NovoProduto() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImagePreview[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    is_on_sale: false,
    sale_price: "",
    category: "Brincos",
    stock_quantity: "1",
    material: "",
    plating: "",
    measurements: "",
    warranty: "1 ano para defeitos de fabricação",
    status: "active",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const priceNum = parseFloat(formData.price.replace(",", "."));
    const salePriceNum = formData.sale_price
      ? parseFloat(formData.sale_price.replace(",", "."))
      : null;
    const stockNum = parseInt(formData.stock_quantity, 10) || 0;
    const newStatus = stockNum <= 0 ? "out_of_stock" : formData.status;

    // 1. Inserir produto
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name: formData.name,
          description: formData.description,
          price: priceNum,
          is_on_sale: formData.is_on_sale,
          sale_price: salePriceNum,
          category: formData.category,
          stock_quantity: stockNum,
          material: formData.material,
          plating: formData.plating,
          measurements: formData.measurements,
          warranty: formData.warranty,
          status: newStatus,
        },
      ])
      .select()
      .single();

    if (productError || !product) {
      alert("Erro ao criar produto: " + productError?.message);
      setLoading(false);
      return;
    }

    // 2. Upload das imagens para o Storage
    const bucketName = "product-images";
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = img.file.name.split(".").pop() || "jpg";
      const path = `products/${product.id}/${Date.now()}_${i}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(path, img.file, { upsert: true, cacheControl: "3600" });

      if (uploadError) {
        console.error(
          "Erro ao enviar imagem para Storage:",
          uploadError.message,
        );
        alert(
          "Falha ao enviar algumas imagens. Verifique se o bucket product-images está público e com políticas de upload.",
        );
        continue;
      }

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(uploadData.path);
      if (!urlData?.publicUrl) {
        console.error(
          "Não foi possível gerar a URL pública da imagem:",
          uploadData.path,
        );
        continue;
      }

      const { error: imageInsertError } = await supabase
        .from("product_images")
        .insert([
          {
            product_id: product.id,
            image_url: urlData.publicUrl,
            sort_order: i,
          },
        ]);

      if (imageInsertError) {
        console.error(
          "Erro ao gravar imagem no banco:",
          imageInsertError.message,
        );
      }
    }

    setLoading(false);
    router.push("/admin/produtos");
    router.refresh();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/produtos"
          className="text-gray-400 hover:text-brand-burgundy transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-serif text-brand-burgundy">
          Novo Produto
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-lg shadow border border-gray-100"
      >
        {/* Upload de Imagens */}
        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-1 border-b border-gray-100 pb-2">
            Fotos do Produto
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            A primeira foto será a capa. Adicione quantas quiser.
          </p>

          <div className="flex flex-wrap gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative w-28 h-28 border border-gray-200 rounded overflow-hidden group"
              >
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-brand-gold text-white py-0.5">
                    CAPA
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Botão de adicionar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-28 h-28 border-2 border-dashed border-gray-200 hover:border-brand-gold flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-brand-gold transition-colors rounded"
            >
              <ImagePlus size={22} />
              <span className="text-[10px]">Adicionar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageAdd}
            />
          </div>
        </section>

        {/* Informações Básicas */}
        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">
            Informações Básicas
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Peça *
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              >
                <option value="Brincos">Brincos</option>
                <option value="Colares">Colares</option>
                <option value="Pulseiras">Pulseiras</option>
                <option value="Braceletes">Braceletes</option>
                <option value="Anéis">Anéis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qtd em Estoque *
              </label>
              <input
                required
                type="number"
                min="0"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Precificação */}
        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">
            Precificação
          </h2>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço Normal (R$) *
              </label>
              <input
                required
                type="text"
                placeholder="199.90"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
            <div className="flex items-center h-[42px] pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_on_sale"
                  checked={formData.is_on_sale}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand-gold focus:ring-brand-gold rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Ativar Sale?
                </span>
              </label>
            </div>
            {formData.is_on_sale && (
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Preço Promocional (R$)
                </label>
                <input
                  required
                  type="text"
                  placeholder="149.90"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-red-300 rounded focus:ring-1 focus:ring-red-500 outline-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* Especificações */}
        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">
            Especificações Técnicas
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especificação
              </label>
              <input
                type="text"
                placeholder="Ex: MAO-001"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medidas
              </label>
              <input
                type="text"
                placeholder="Ex: 40cm + 5cm extensor"
                name="measurements"
                value={formData.measurements}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Garantia
              </label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-1 focus:ring-brand-gold outline-none"
              />
            </div>
          </div>
        </section>

        {/* Status */}
        <section>
          <h2 className="text-lg font-serif text-brand-burgundy mb-4 border-b border-gray-100 pb-2">
            Visibilidade
          </h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === "active"}
                onChange={handleChange}
                className="text-brand-gold"
              />
              <span className="text-sm text-gray-700">
                Ativo (visível no site)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === "inactive"}
                onChange={handleChange}
                className="text-brand-gold"
              />
              <span className="text-sm text-gray-700">Inativo (oculto)</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-burgundy text-white px-8 py-3 rounded uppercase tracking-widest text-sm hover:bg-brand-burgundy/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Salvando..." : "Salvar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
}
