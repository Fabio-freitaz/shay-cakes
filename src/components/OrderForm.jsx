import React from 'react';
import { MessageCircle, Trash2, ShoppingBag, Clock, Calendar } from 'lucide-react';

export default function OrderForm({ cart, onRemove, formData, setFormData, onChange, setCart }) {
  const hoje = new Date().toISOString().split('T')[0];

  // Gera horários de 30 em 30 minutos (08:00 às 20:00)
  const horarios = [];
  for (let h = 8; h <= 20; h++) {
    horarios.push(`${h.toString().padStart(2, '0')}:00`);
    if (h !== 20) horarios.push(`${h.toString().padStart(2, '0')}:30`);
  }

  // --- CÁLCULO DO TOTAL (CORRIGIDO PARA QUALQUER FORMATO) ---
  const total = cart.reduce((acc, item) => {
    // Remove "R$", espaços, pontos de milhar e troca vírgula por ponto
    const precoLimpo = item.price
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    
    const valor = parseFloat(precoLimpo);
    return acc + (isNaN(valor) ? 0 : valor);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    if (!formData.horaEntrega) return alert("Por favor, escolha um horário!");

    const meuNumero = "5584981369994"; // Verifique se este é o número da Shay
    const dataBR = formData.dataEntrega.split('-').reverse().join('/');
    
    // Monta a lista de itens formatada para o WhatsApp
    const itensTexto = cart.map(item => `• ${item.name} (${item.price})`).join('\n');
    const totalFormatado = total.toFixed(2).replace('.', ',');

    // Montagem da mensagem usando Template Strings (mais limpo)
    const mensagemRaw = `🌸 *Novo Pedido - Shay Cakes* 🌸\n\n` +
      `*Cliente:* ${formData.nome}\n\n` +
      `*ITENS:*\n${itensTexto}\n\n` +
      `*TOTAL DO PEDIDO: R$ ${totalFormatado}*\n\n` +
      `*Tipo:* ${formData.tipoEntrega}\n` +
      `${formData.tipoEntrega === 'Entrega' ? `*Endereço:* ${formData.endereco}\n` : ''}` +
      `*Data:* ${dataBR}\n` +
      `*Horário:* ${formData.horaEntrega}\n` +
      `${formData.observacao ? `\n*OBS:* ${formData.observacao}` : ''}`;

    // Codifica a mensagem para URL e abre o WhatsApp
    const mensagemFinal = encodeURIComponent(mensagemRaw);
    window.open(`https://wa.me/${meuNumero}?text=${mensagemFinal}`, '_blank');

    // REINICIA O ESTADO APÓS O ENVIO
    setCart([]); 
    setFormData({
      nome: '', 
      tipoEntrega: 'Retirada', 
      endereco: '', 
      dataEntrega: '', 
      horaEntrega: '', 
      observacao: ''
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert("Pedido enviado para o WhatsApp! ✨");
  };

  return (
    <section id="encomenda" className="py-20 bg-[#FDF8F9]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-pink-50 overflow-hidden">
          <div className="bg-[#8FB9A8] p-8 text-center text-white font-bold text-2xl uppercase tracking-widest">Finalizar Encomenda</div>
          
          <div className="p-8 space-y-8">
            {/* RESUMO DO CARRINHO */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
                <ShoppingBag size={20} className="text-[#F4A8B9]"/> Resumo do Pedido:
              </h4>
              
              {cart.length === 0 ? (
                <p className="text-slate-400 text-center py-4 italic">Nenhum doce selecionado ainda...</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li key={item.cartId} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#8FB9A8] text-sm">{item.price}</span>
                        <button type="button" onClick={() => onRemove(item.cartId)} className="text-red-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </li>
                  ))}
                  
                  <div className="pt-4 mt-2 border-t border-double border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-bold">Valor Total:</span>
                    <span className="text-2xl font-black text-[#8FB9A8]">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </ul>
              )}
            </div>

            {/* FORMULÁRIO DE DADOS DO CLIENTE */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Nome Completo</label>
                <input required name="nome" value={formData.nome} onChange={onChange} placeholder="Ex: Maria Silva" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#8FB9A8]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, tipoEntrega: 'Retirada'})} className={`p-4 rounded-xl border font-bold transition-all ${formData.tipoEntrega === 'Retirada' ? 'bg-[#8FB9A8] text-white' : 'bg-slate-50 text-slate-400'}`}>Retirada</button>
                <button type="button" onClick={() => setFormData({...formData, tipoEntrega: 'Entrega'})} className={`p-4 rounded-xl border font-bold transition-all ${formData.tipoEntrega === 'Entrega' ? 'bg-[#8FB9A8] text-white' : 'bg-slate-50 text-slate-400'}`}>Entrega</button>
              </div>

              {formData.tipoEntrega === 'Entrega' && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Endereço em Tabatinga</label>
                  <input required name="endereco" value={formData.endereco} onChange={onChange} placeholder="Rua, número e ponto de referência" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#8FB9A8]" />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Data da Entrega</label>
                  <input required type="date" name="dataEntrega" min={hoje} value={formData.dataEntrega} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#8FB9A8]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Horário</label>
                  <select required name="horaEntrega" value={formData.horaEntrega} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#8FB9A8] appearance-none">
                    <option value="">Escolha a hora...</option>
                    {horarios.map(hora => <option key={hora} value={hora}>{hora}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Observações (Opcional)</label>
                <textarea name="observacao" value={formData.observacao} onChange={onChange} placeholder="Ex: Topo de bolo com nome 'Parabéns Maria'..." rows="2" className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-[#8FB9A8]" />
              </div>
              
              <button type="submit" disabled={cart.length === 0} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:bg-slate-200">
                <MessageCircle size={28} /> Finalizar Pedido
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}