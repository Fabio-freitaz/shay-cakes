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

  // --- AQUI É ONDE A CONTA É FEITA ---
  const total = cart.reduce((acc, item) => {
    // Remove o "R$", troca a vírgula por ponto e transforma em número para somar
    const valor = parseFloat(item.price.replace('R$', '').replace('.', '').replace(',', '.'));
    return acc + valor;
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Seu carrinho está vazio!");
    if (!formData.horaEntrega) return alert("Por favor, escolha um horário!");

    const meuNumero = "5584981369996"; 
    const dataBR = formData.dataEntrega.split('-').reverse().join('/');
    const itensTexto = cart.map(item => `- ${item.name} (${item.price})`).join('%0A');
    const totalFormatado = total.toFixed(2).replace('.', ',');

    const mensagem = `🌸 *Novo Pedido - Shay Cakes* 🌸%0A%0A` +
      `*Cliente:* ${formData.nome}%0A%0A` +
      `*🛒 ITENS:*%0A${itensTexto}%0A%0A` +
      `*💰 TOTAL DO PEDIDO: R$ ${totalFormatado}*%0A%0A` +
      `*Tipo:* ${formData.tipoEntrega}%0A` +
      `${formData.tipoEntrega === 'Entrega' ? `*Endereço:* ${formData.endereco}%0A` : ''}` +
      `*Data:* ${dataBR}%0A` +
      `*Horário:* ${formData.horaEntrega}%0A` +
      `${formData.observacao ? `%0A*⚠️ OBS:* ${formData.observacao}` : ''}`;

    // 1. Abre o WhatsApp
    window.open(`https://wa.me/${meuNumero}?text=${mensagem}`, '_blank');

    // 2. REINICIA O SITE
    setCart([]); 
    setFormData({
      nome: '', 
      tipoEntrega: 'Retirada', 
      endereco: '', 
      dataEntrega: '', 
      horaEntrega: '', 
      observacao: ''
    });

    // 3. Volta para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    alert("Pedido enviado com sucesso! ✨");
  };

  return (
    <section id="encomenda" className="py-20 bg-[#FDF8F9]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-pink-50 overflow-hidden">
          <div className="bg-[#8FB9A8] p-8 text-center text-white font-bold text-2xl">Finalizar Encomenda</div>
          
          <div className="p-8 space-y-8">
            {/* RESUMO COM CÁLCULO AUTOMÁTICO */}
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
                  
                  {/* EXIBIÇÃO DO VALOR TOTAL */}
                  <div className="pt-4 mt-2 border-t border-double border-slate-200 flex justify-between items-center">
                    <span className="text-slate-600 font-bold">Valor Total:</span>
                    <span className="text-2xl font-black text-[#8FB9A8]">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </ul>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input required name="nome" value={formData.nome} onChange={onChange} placeholder="Seu nome" className="w-full p-4 bg-slate-50 rounded-xl border outline-none focus:ring-2 focus:ring-[#8FB9A8]" />
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, tipoEntrega: 'Retirada'})} className={`p-4 rounded-xl border font-bold transition-all ${formData.tipoEntrega === 'Retirada' ? 'bg-[#8FB9A8] text-white' : 'bg-slate-50 text-slate-400'}`}>Retirada</button>
                <button type="button" onClick={() => setFormData({...formData, tipoEntrega: 'Entrega'})} className={`p-4 rounded-xl border font-bold transition-all ${formData.tipoEntrega === 'Entrega' ? 'bg-[#8FB9A8] text-white' : 'bg-slate-50 text-slate-400'}`}>Entrega</button>
              </div>

              {formData.tipoEntrega === 'Entrega' && <input required name="endereco" value={formData.endereco} onChange={onChange} placeholder="Endereço completo" className="w-full p-4 bg-slate-50 rounded-xl border outline-none" />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="date" name="dataEntrega" min={hoje} value={formData.dataEntrega} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl border outline-none" />
                <select required name="horaEntrega" value={formData.horaEntrega} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl border outline-none appearance-none">
                  <option value="">Selecione o horário</option>
                  {horarios.map(hora => <option key={hora} value={hora}>{hora}</option>)}
                </select>
              </div>

              <textarea name="observacao" value={formData.observacao} onChange={onChange} placeholder="Observações (opcional)" rows="2" className="w-full p-4 bg-slate-50 rounded-xl border outline-none" />
              
              <button type="submit" disabled={cart.length === 0} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                <MessageCircle size={28} /> Finalizar Pedido
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}