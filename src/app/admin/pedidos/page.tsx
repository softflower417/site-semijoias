'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Eye, CheckCircle, Inbox } from 'lucide-react';

const statusLabel: Record<string, string> = {
  pending: 'Novo',
  seen: 'Visualizado',
  done: 'Concluído',
};

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  seen: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};

export default function AdminPedidos() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from('customer_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('customer_requests').update({ status }).eq('id', id);
    fetchRequests();
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Inbox size={24} className="text-brand-burgundy" />
        <h1 className="text-2xl font-serif text-brand-burgundy">Pedidos & Sugestões</h1>
        {requests.filter(r => r.status === 'pending').length > 0 && (
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
            {requests.filter(r => r.status === 'pending').length} novo(s)
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-5 py-3 font-medium">Data</th>
              <th className="px-5 py-3 font-medium">Nome</th>
              <th className="px-5 py-3 font-medium">WhatsApp</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Carregando...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">Nenhum pedido recebido ainda.</td></tr>
            ) : (
              requests.map(r => (
                <tr key={r.id} className={`hover:bg-gray-50 cursor-pointer ${r.status === 'pending' ? 'font-semibold' : ''}`} onClick={() => { setSelected(r); if (r.status === 'pending') updateStatus(r.id, 'seen'); }}>
                  <td className="px-5 py-4 text-gray-500">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-5 py-4">{r.name}</td>
                  <td className="px-5 py-4">
                    <a href={`https://wa.me/55${r.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-green-600 hover:underline">
                      {r.whatsapp}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-normal ${statusColor[r.status]}`}>
                      {statusLabel[r.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={e => { e.stopPropagation(); setSelected(r); }} className="text-gray-400 hover:text-brand-burgundy p-1">
                      <Eye size={18} />
                    </button>
                    {r.status !== 'done' && (
                      <button onClick={e => { e.stopPropagation(); updateStatus(r.id, 'done'); }} className="text-gray-400 hover:text-green-600 p-1 ml-1" title="Marcar como concluído">
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalhes */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-xl text-brand-burgundy">{selected.name}</h3>
                <a href={`https://wa.me/55${selected.whatsapp.replace(/\D/g,'')}`} target="_blank" className="text-green-600 text-sm hover:underline">{selected.whatsapp}</a>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[selected.status]}`}>{statusLabel[selected.status]}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-4 text-sm text-gray-700 leading-relaxed">
              {selected.message}
            </div>

            {selected.image_url && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Imagem de referência</p>
                <img src={selected.image_url} alt="Referência" className="max-h-64 rounded border border-gray-100 object-contain" />
              </div>
            )}

            <div className="flex gap-3">
              {selected.status !== 'done' && (
                <button onClick={() => updateStatus(selected.id, 'done')} className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Marcar como concluído
                </button>
              )}
              <a href={`https://wa.me/55${selected.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Olá ${selected.name}! Vi sua solicitação na SAONA e vim te atender.`)}`}
                target="_blank"
                className="flex-1 bg-[#25D366] text-white py-2 rounded text-sm hover:bg-[#1EBE5A] flex items-center justify-center gap-2">
                Responder no WhatsApp
              </a>
            </div>

            <button onClick={() => setSelected(null)} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 py-2">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
