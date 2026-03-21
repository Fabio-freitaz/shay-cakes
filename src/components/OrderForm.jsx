import React from 'react';
import { MessageCircle, Trash2, ShoppingBag } from 'lucide-react';

// 📍 LISTA DE BAIRROS E TAXAS REAIS
const TAXAS_ENTREGA = {
  "Barra de Tabatinga": 5.00,
  "Búzios": 7.00,
  "Pirangi": 10.00,
  "Camurupim": 10.00,
  "Barreta": 8.00
};

// FUNÇÃO PARA VERIFICAR SE ESTÁ ABERTO
const verificarLojaAberta = () => {
  const agora = new Date();
  const horaAtual = agora.getHours();
  return horaAtual >= 8 && horaAtual < 18; // Aberto das 08h às 18h
};

export default function OrderForm({ cart, onRemove, formData, setFormData, onChange, setCart }) {
  const lojaAberta = verificarLojaAberta();
  const hoje = new Date().toISOString().split('T')[0];
  
  const horarios = [];
  for (let h = 8; h <= 20; h++) {
    horarios.push(`${h.toString().padStart(2, '0')}:00`, `${h.toString().padStart(2, '0')}:30`);
  }

  // CÁLCULO DOS VALORES
  const subtotal = cart.reduce((acc, item) => {
    const precoLimpo = item.price.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    return acc + (parseFloat(precoLimpo) || 0);
  }, 0);

  const taxaAdicional = formData.tipoEntrega === 'Entrega' ? (TAXAS_ENTREGA[formData.bairro] || 0) : 0;
  const totalGeral = subtotal + taxaAdicional;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Adicione itens ao carrinho primeiro!");
    
    const meuNumero = "5584981369996";
    const dataBR = formData.dataEntrega.split('-').reverse().join('/');
    const itensTexto = cart.map(item => `• ${item.name} (${item.price})`).join('\n');
    
    const mensagemRaw = `🌸 *Novo Pedido - Shay Cakes* 🌸\n\n` +
      `*Cliente:* ${formData.nome}\n\n` +
      `*ITENS:*\n${itensTexto}\n\n` +
      `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n` +
      `${formData.tipoEntrega === 'Entrega' ? `*Taxa Entrega (${formData.bairro}):* R$ ${taxaAdicional.toFixed(2).replace('.', ',')}\n` : ''}` +
      `*TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n\n` +
      `*Tipo:* ${formData.tipoEntrega}\n` +
      `${formData.tipoEntrega === 'Entrega' ? `*Endereço:* ${formData.endereco}\n` : ''}` +
      `*Data:* ${dataBR}\n*Horário:* ${formData.horaEntrega}\n` +
      `${formData.observacao ? `\n*OBS:* ${formData.observacao}` : ''}`;

    window.open(`https://wa.me/${meuNumero}?text=${encodeURIComponent(mensagemRaw)}`, '_blank');
    setCart([]);
    setFormData({ nome: '', tipoEntrega: 'Retirada', endereco: '', bairro: '', dataEntrega: '', horaEntrega: '', observacao: '' });
    alert("Pedido enviado! ✨");
  };

  // SE A LOJA ESTIVER FECHADA, MOSTRA O AVISO EM VEZ DO FORMULÁRIO
  if (!lojaAberta) {
    return (
      <div className="py-20 text-center bg-[#FDF8F9]">
         <div className="max-w-md mx-auto p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100">
            <span className="text-4xl">🌙</span>
            <h2 className="text-xl font-bold text-slate-800 mt-4">Estamos descansando!</h2>
            <p className="text-slate-500 text-sm mt-2">
              A Shay Cakes abre todos os dias das 08:00 às 18:00. <br/>
              Aguardamos sua encomenda amanhã!
            </p>
         </div>
      </div>
    );
  }

  return (
    <section id="encomenda" className="py-20 bg-[#FDF8F9]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-pink-50">
          <div className="bg-[#8FB9A8] p-6 text-center text-white font-bold text-xl flex items-center justify-center gap-2">
            <ShoppingBag size={24}/> Finalizar Encomenda
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200">
              <ul className="space-y-2">
                {cart.map((item) => (
                  <li key={item.cartId} className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{item.price}</span>
                      <button onClick={() => onRemove(item.cartId)} className="text-red-400 hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                    </div>
                  </li>
                ))}
                <div className="pt-3 mt-3 border-t space-y-1">
                  <div className="flex justify-between text-slate-500 text-xs italic">
                    <span>Subtotal:</span> <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {formData.tipoEntrega === 'Entrega' && formData.bairro && (
                    <div className="flex justify-between text-pink-400 text-xs font-bold">
                      <span>Taxa de Entrega ({formData.bairro}):</span> <span>+ R$ {taxaAdicional.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl text-[#8FB9A8]">
                    <span>Total:</span> <span>R$ {totalGeral.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input required name="nome" value={formData.nome} onChange={onChange} placeholder="Seu nome" className="w-full p-4 bg-slate-50 rounded-xl outline-none border-2 border-transparent focus:border-[#8FB9A8]" />
              
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setFormData({...formData, tipoEntrega: 'Retirada'})} className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.tipoEntrega === 'Retirada' ? 'bg-[#8FB9A8] text-white border-[#8FB9A8]' : 'bg-white text-slate-400 border-slate-100'}`}>Retirada</button>
                <button type="button" onClick={() => setFormData({...formData, tipoEntrega: 'Entrega'})} className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.tipoEntrega === 'Entrega' ? 'bg-[#8FB9A8] text-white border-[#8FB9A8]' : 'bg-white text-slate-400 border-slate-100'}`}>Entrega</button>
              </div>

              {formData.tipoEntrega === 'Entrega' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <select required name="bairro" value={formData.bairro} onChange={onChange} className="w-full p-4 bg-slate-50 rounded-xl outline-none border-2 border-transparent focus:border-[#8FB9A8]">
                    <option value="">Selecione seu Bairro...</option>
                    {Object.keys(TAXAS_ENTREGA).map(b => (
                      <option key={b} value={b}>{b} - R$ {TAXAS_ENTREGA[b].toFixed(2).replace('.', ',')}</option>
                    ))}
                  </select>
                  <input required name="endereco" value={formData.endereco} onChange={onChange} placeholder="Endereço (Rua, nº, Ref)" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-[#8FB9A8]" />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" name="dataEntrega" min={hoje} value={formData.dataEntrega} onChange={onChange} className="p-4 bg-slate-50 rounded-xl outline-none" />
                <select required name="horaEntrega" value={formData.horaEntrega} onChange={onChange} className="p-4 bg-slate-50 rounded-xl outline-none">
                  <option value="">Hora...</option>
                  {horarios.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <textarea name="observacao" value={formData.observacao} onChange={onChange} placeholder="Observações (opcional)" rows="2" className="w-full p-4 bg-slate-50 rounded-xl outline-none" />
              
              <button 
                type="submit" 
                disabled={cart.length === 0}
                className={`w-full py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95 
                ${cart.length > 0 ? 'bg-[#25D366] hover:bg-[#1eb956] text-white cursor-pointer shadow-green-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
              >
                <MessageCircle size={28} /> 
                <span>Enviar no WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}