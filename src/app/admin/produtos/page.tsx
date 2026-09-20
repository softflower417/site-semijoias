'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminProdutos() {
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.material && product.material.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    const [productsRes, salesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('sales').select('*')
    ]);
    
    if (productsRes.data) {
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
    }
    if (salesRes.data) setSales(salesRes.data);
    setLoading(false);
  };

  // Calcular vendidos por produto
  const getSoldCount = (productId: string, productName: string) => {
    return sales.filter(sale => 
      sale.product_name === productName
    ).length;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const handleSale = async (product: any) => {
    if (product.stock_quantity <= 0) {
      alert('Produto esgotado!');
      return;
    }

    try {
      const newQuantity = product.stock_quantity - 1;
      const newStatus = newQuantity <= 0 ? 'inactive' : product.status;

      // Atualizar apenas quantidade e status
      const { error: updateError } = await supabase
        .from('products')
        .update({
          stock_quantity: newQuantity,
          status: newStatus
        })
        .eq('id', product.id);

      if (updateError) {
        console.error('Erro ao atualizar produto:', updateError);
        alert('Erro ao atualizar produto: ' + updateError.message);
        return;
      }

      // Registrar venda automaticamente
      const { error: saleError } = await supabase.from('sales').insert([{
        product_name: product.name,
        value: product.is_on_sale && product.sale_price ? product.sale_price : product.price,
        date: new Date().toISOString().split('T')[0],
        notes: 'Venda via botão Vendi'
      }]);

      if (saleError) {
        console.error('Erro ao registrar venda:', saleError);
        alert('Erro ao registrar venda: ' + saleError.message);
        return;
      }

      fetchProducts();
      alert('Venda registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      alert('Erro ao processar venda: ' + (error as any).message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-serif text-brand-burgundy">Produtos</h1>
        <Link 
          href="/admin/produtos/novo" 
          className="bg-brand-gold text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-brand-gold/90 transition-colors w-full md:w-auto"
        >
          <Plus size={20} />
          NOVO PRODUTO
        </Link>
      </div>

      {/* Barra de Pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquisar produtos por nome, categoria ou material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-2">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Nome</th>
              <th className="px-6 py-4 font-medium">Categoria</th>
              <th className="px-6 py-4 font-medium">Preço</th>
              <th className="px-6 py-4 font-medium text-center">Qtd</th>
              <th className="px-6 py-4 font-medium text-center">Vendidos</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                {searchTerm ? 'Nenhum produto encontrado com os termos da pesquisa.' : 'Nenhum produto cadastrado.'}
              </td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-gray-500">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                    {product.is_on_sale && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">SALE</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900">{product.stock_quantity}</td>
                  <td className="px-6 py-4 text-center font-medium text-green-600">{getSoldCount(product.id, product.name)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'active' ? 'bg-green-100 text-green-800' : 
                      product.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'active' ? 'Ativo' : 
                       product.status === 'out_of_stock' ? 'Esgotado' : 
                       'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleSale(product)}
                      disabled={product.stock_quantity <= 0}
                      className={`px-3 py-1.5 text-xs rounded flex items-center gap-1 transition-colors ${
                        product.stock_quantity <= 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      title="Registrar venda"
                    >
                      Vendi
                    </button>
                    <Link href={`/admin/produtos/${product.id}/editar`} className="text-blue-600 hover:text-blue-800 p-1" title="Editar">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 p-1" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
