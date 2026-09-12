'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminFinanceiro() {
  const [sales, setSales] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create client safely
  const [supabase] = useState(() => createClient());

  // Formulário Vendas
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [newSale, setNewSale] = useState({ product_name: '', value: '', date: new Date().toISOString().split('T')[0], notes: '' });

  // Formulário Gastos
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', category: 'Outros', value: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [salesRes, expensesRes] = await Promise.all([
      supabase.from('sales').select('*').order('date', { ascending: false }),
      supabase.from('expenses').select('*').order('date', { ascending: false })
    ]);
    
    if (salesRes.data) setSales(salesRes.data);
    if (expensesRes.data) setExpenses(expensesRes.data);
    setLoading(false);
  };

  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('sales').insert([{
      product_name: newSale.product_name,
      value: parseFloat(newSale.value.replace(',', '.')),
      date: newSale.date,
      notes: newSale.notes
    }]);
    setShowSaleForm(false);
    setNewSale({ product_name: '', value: '', date: new Date().toISOString().split('T')[0], notes: '' });
    fetchData();
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('expenses').insert([{
      description: newExpense.description,
      category: newExpense.category,
      value: parseFloat(newExpense.value.replace(',', '.')),
      date: newExpense.date
    }]);
    setShowExpenseForm(false);
    setNewExpense({ description: '', category: 'Outros', value: '', date: new Date().toISOString().split('T')[0] });
    fetchData();
  };

  const deleteSale = async (id: string) => {
    if(confirm('Excluir venda?')) {
      await supabase.from('sales').delete().eq('id', id);
      fetchData();
    }
  };

  const deleteExpense = async (id: string) => {
    if(confirm('Excluir gasto?')) {
      await supabase.from('expenses').delete().eq('id', id);
      fetchData();
    }
  };

  const totalSales = sales.reduce((acc, curr) => acc + Number(curr.value), 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.value), 0);
  const balance = totalSales - totalExpenses;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-serif text-brand-burgundy mb-8">Dashboard Financeiro</h1>

      {/* Resumo */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Total Vendido</p>
            <p className="text-2xl font-semibold text-gray-900">R$ {totalSales.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600"><TrendingDown size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Total Gasto</p>
            <p className="text-2xl font-semibold text-gray-900">R$ {totalExpenses.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-brand-gold/20 p-3 rounded-full text-brand-gold"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Saldo Atual</p>
            <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balance.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        {/* Coluna Vendas */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl text-brand-burgundy">Vendas</h2>
            <button onClick={() => setShowSaleForm(!showSaleForm)} className="text-sm bg-green-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-green-700">
              <Plus size={16} /> Adicionar
            </button>
          </div>

          {showSaleForm && (
            <form onSubmit={handleAddSale} className="bg-green-50 p-4 rounded-lg mb-4 border border-green-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Nome do Produto" value={newSale.product_name} onChange={e => setNewSale({...newSale, product_name: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
                <input required placeholder="Valor (Ex: 199.90)" value={newSale.value} onChange={e => setNewSale({...newSale, value: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
                <input required type="date" value={newSale.date} onChange={e => setNewSale({...newSale, date: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
                <input placeholder="Observação (opcional)" value={newSale.notes} onChange={e => setNewSale({...newSale, notes: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded text-sm font-medium">Salvar Venda</button>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase">
                <tr><th className="px-4 py-3 font-medium">Data</th><th className="px-4 py-3 font-medium">Produto</th><th className="px-4 py-3 font-medium">Valor</th><th className="px-4 py-3 text-right">Ação</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhuma venda registrada.</td></tr> : null}
                {sales.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{new Date(s.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                    <td className="px-4 py-3 font-medium">{s.product_name}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">+R$ {s.value.toFixed(2).replace('.', ',')}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => deleteSale(s.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna Gastos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl text-brand-burgundy">Gastos</h2>
            <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="text-sm bg-red-600 text-white px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-700">
              <Plus size={16} /> Adicionar
            </button>
          </div>

          {showExpenseForm && (
            <form onSubmit={handleAddExpense} className="bg-red-50 p-4 rounded-lg mb-4 border border-red-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Descrição" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
                <input required placeholder="Valor (Ex: 50.00)" value={newExpense.value} onChange={e => setNewExpense({...newExpense, value: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
                <select required value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none bg-white">
                  <option value="Embalagem">Embalagem</option>
                  <option value="Fornecedor">Fornecedor</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Plataforma">Plataforma</option>
                  <option value="Outros">Outros</option>
                </select>
                <input required type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="px-3 py-2 border rounded text-sm w-full outline-none" />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded text-sm font-medium">Salvar Gasto</button>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase">
                <tr><th className="px-4 py-3 font-medium">Data</th><th className="px-4 py-3 font-medium">Descrição</th><th className="px-4 py-3 font-medium">Valor</th><th className="px-4 py-3 text-right">Ação</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum gasto registrado.</td></tr> : null}
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{new Date(e.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                    <td className="px-4 py-3 font-medium">
                      {e.description}
                      <span className="block text-xs text-gray-400 font-normal">{e.category}</span>
                    </td>
                    <td className="px-4 py-3 text-red-600 font-medium">-R$ {e.value.toFixed(2).replace('.', ',')}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => deleteExpense(e.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
