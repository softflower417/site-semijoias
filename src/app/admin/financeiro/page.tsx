'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { 
  Plus, Trash2, DollarSign, 
  Package, Calculator, Target, PieChart as PieChartIcon, 
  Wallet 
} from 'lucide-react';
import Swal from 'sweetalert2';

const COLORS = ['#8B4513', '#D4AF37', '#C0C0C0', '#FFD700', '#E5E4E2', '#B76E79', '#98D8C8', '#F7DC6F'];

export default function AdminFinanceiro() {
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [supabase] = useState(() => createClient());

  // Formulário Vendas
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [newSale, setNewSale] = useState({ product_name: '', value: '', date: new Date().toISOString().split('T')[0], notes: '' });

  // Calculadora
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevious, setCalcPrevious] = useState<any>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  const [calcNewNumber, setCalcNewNumber] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, salesRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('sales').select('*').order('date', { ascending: false })
    ]);
    
    if (productsRes.data) setProducts(productsRes.data);
    if (salesRes.data) setSales(salesRes.data);
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

  const deleteSale = async (id: string) => {
    const result = await Swal.fire({
      title: 'Excluir venda?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B4513',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await supabase.from('sales').delete().eq('id', id);
      fetchData();
      Swal.fire('Excluído!', 'A venda foi excluída.', 'success');
    }
  };

  // Cálculos financeiros
  const totalSales = sales.reduce((acc, curr) => acc + Number(curr.value), 0);

  // Cálculos do estoque
  const totalInventoryValue = products.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.stock_quantity)), 0);
  const totalInvested = totalInventoryValue / 2; // Metade do valor de venda
  const balance = totalSales - totalInvested;

  // Dados para gráfico de pizza por categoria
  const categoryData = products.reduce((acc, curr) => {
    const category = curr.category || 'Outros';
    acc[category] = (acc[category] || 0) + Number(curr.stock_quantity);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Dados para gráfico de barras - valor por categoria
  const categoryValueData = products.reduce((acc, curr) => {
    const category = curr.category || 'Outros';
    const value = Number(curr.price) * Number(curr.stock_quantity);
    acc[category] = (acc[category] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(categoryValueData).map(([name, value]) => ({ 
    name, 
    value: Number(value).toFixed(2),
    invested: (Number(value) / 2).toFixed(2)
  }));

  // Funções da calculadora
  const handleCalcNumber = (num: string) => {
    if (calcDisplay === '0' || calcNewNumber) {
      setCalcDisplay(num);
      setCalcNewNumber(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const handleCalcOperation = (op: string) => {
    setCalcOperation(op);
    setCalcPrevious(parseFloat(calcDisplay));
    setCalcNewNumber(true);
  };

  const handleCalcEquals = () => {
    const prev = calcPrevious;
    const current = parseFloat(calcDisplay);
    let result = 0;

    switch (calcOperation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '×': result = prev * current; break;
      case '÷': result = prev / current; break;
      default: return;
    }

    setCalcDisplay(result.toString());
    setCalcOperation(null);
    setCalcPrevious(null);
    setCalcNewNumber(true);
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrevious(null);
    setCalcOperation(null);
    setCalcNewNumber(true);
  };

  const handleCalcPercent = () => {
    const current = parseFloat(calcDisplay);
    setCalcDisplay((current / 100).toString());
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-serif text-brand-burgundy">Dashboard Financeiro</h1>
        <button 
          onClick={() => setShowCalculator(!showCalculator)}
          className="bg-brand-gold text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-gold/90 transition-colors text-sm"
        >
          <Calculator size={16} />
          Calculadora
        </button>
      </div>

      {/* Calculadora Flutuante */}
      {showCalculator && (
        <div className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl p-4 z-50 w-72 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700 text-sm">Calculadora</h3>
            <button onClick={() => setShowCalculator(false)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          <div className="bg-gray-100 p-3 rounded-lg mb-3 text-right">
            <div className="text-2xl font-mono font-semibold text-gray-800">
              {calcDisplay}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '%', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (['+', '-', '×', '÷'].includes(btn)) {
                    handleCalcOperation(btn);
                  } else if (btn === '%') {
                    handleCalcPercent();
                  } else {
                    handleCalcNumber(btn);
                  }
                }}
                className={`p-2 rounded-lg font-semibold transition-colors text-sm ${
                  ['+', '-', '×', '÷'].includes(btn) 
                    ? 'bg-brand-gold text-white hover:bg-brand-gold/90' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={handleCalcEquals}
              className="col-span-2 bg-green-600 text-white p-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm"
            >
              =
            </button>
            <button
              onClick={handleCalcClear}
              className="col-span-2 bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
            >
              C
            </button>
          </div>
        </div>
      )}

      {/* Cards Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-500 p-1.5 md:p-2 rounded-lg text-white"><DollarSign size={16} /></div>
            <span className="text-xs md:text-sm font-medium text-green-700 uppercase tracking-wider">Total Vendido</span>
          </div>
          <p className="text-lg md:text-3xl font-bold text-green-800">R$ {totalSales.toFixed(2).replace('.', ',')}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500 p-1.5 md:p-2 rounded-lg text-white"><Target size={16} /></div>
            <span className="text-xs md:text-sm font-medium text-blue-700 uppercase tracking-wider">Total Investido</span>
          </div>
          <p className="text-lg md:text-3xl font-bold text-blue-800">R$ {totalInvested.toFixed(2).replace('.', ',')}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 md:p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-purple-500 p-1.5 md:p-2 rounded-lg text-white"><Package size={16} /></div>
            <span className="text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Valor Estoque</span>
          </div>
          <p className="text-lg md:text-3xl font-bold text-purple-800">R$ {totalInventoryValue.toFixed(2).replace('.', ',')}</p>
        </div>

        <div className="bg-gradient-to-br from-brand-gold/20 to-brand-gold/40 p-3 md:p-6 rounded-xl shadow-sm border border-brand-gold/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-brand-gold p-1.5 md:p-2 rounded-lg text-white"><Wallet size={16} /></div>
            <span className="text-xs md:text-sm font-medium text-brand-burgundy uppercase tracking-wider">Lucro Líquido</span>
          </div>
          <p className={`text-lg md:text-3xl font-bold ${balance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
            R$ {balance.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-8 mb-6">
        {/* Gráfico de Pizza - Quantidade por Categoria */}
        <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-serif text-sm md:text-lg text-brand-burgundy mb-3 md:mb-4">Distribuição por Categoria</h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} peças`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras - Valor por Categoria */}
        <div className="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-serif text-sm md:text-lg text-brand-burgundy mb-3 md:mb-4">Valor por Categoria</h3>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
                <Legend />
                <Bar dataKey="value" fill="#D4AF37" name="Valor Venda" animationDuration={1000} />
                <Bar dataKey="invested" fill="#8B4513" name="Valor Investido" animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vendas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-lg text-brand-burgundy">Vendas</h2>
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[500px]">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase">
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
    </div>
  );
}