import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { PRODUCTS } from "../data/products";

// 1. FUNÇÃO DE VERIFICAÇÃO DE HORÁRIO
const verificarLojaAberta = () => {
  const agora = new Date();
  const horaAtual = agora.getHours();
  // Aberto das 08h às 17h59
  return horaAtual >= 8 && horaAtual < 18;
};

export default function Products({ onAddToCart }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState({});
  const [quantities, setQuantities] = useState({});
  const [mistoQty, setMistoQty] = useState({});

  // 2. STATUS DA LOJA
  const lojaAberta = verificarLojaAberta();

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = current + delta;
      if (next >= 1) return { ...prev, [id]: next };
      return prev;
    });
  };

  const updateMisto = (id, flavor, delta) => {
    setMistoQty(prev => {
      const current = prev[id] || { brig: 0, beij: 0 };
      const nextValue = (current[flavor] || 0) + delta;
      if (nextValue >= 0) return { ...prev, [id]: { ...current, [flavor]: nextValue } };
      return prev;
    });
  };

  const handleAddWithDetails = (product) => {
    // BLOQUEIO DE SEGURANÇA SE FECHADO
    if (!lojaAberta) return;

    if (product.isMisto) {
      const qty = mistoQty[product.id] || { brig: 0, beij: 0 };
      const totalMisto = qty.brig + qty.beij;
      if (totalMisto < 10) return alert("Mínimo 10 unidades para mistos.");
      
      onAddToCart({
        cartId: crypto.randomUUID(),
        name: `${product.name} (${qty.brig} Brig, ${qty.beij} Beij)`,
        price: `R$ ${(2.5 * totalMisto).toFixed(2).replace('.', ',')}`,
        image: product.image
      });
      return;
    }

    const qty = quantities[product.id] || 1;
    const hasSizes = product.sizes && product.sizes.length > 0;
    
    // Mínimo para docinhos simples
    if (!hasSizes && qty < 10 && product.name.toLowerCase().includes('unidade')) {
      return alert("O pedido mínimo para docinhos é de 10 unidades.");
    }

    const sizeIdx = selectedSizeIndex[product.id] || 0;
    let finalName = product.name;
    if (hasSizes) finalName += ` (${product.sizes[sizeIdx].label})`;
    if (product.fillings) finalName += ` + ${product.fillings[0]}`;
    if (!hasSizes) finalName = `${qty}x ${finalName}`;

    const finalPrice = hasSizes 
      ? `R$ ${product.sizes[sizeIdx].price.toFixed(2).replace('.', ',')}` 
      : `R$ ${(parseFloat(product.price.toString().replace(',', '.')) * qty).toFixed(2).replace('.', ',')}`;

    onAddToCart({
      cartId: crypto.randomUUID(), 
      name: finalName,
      price: finalPrice,
      image: product.image
    });
  };

  return (
    <section className="py-10 md:py-20 bg-white" id="produtos">
      <div className="max-w-6xl mx-auto px-4 text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
          Cardápio Shay Cakes
        </h3>
        {!lojaAberta && (
          <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold border border-red-100 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            LOJA FECHADA NO MOMENTO (08h às 18h)
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 px-2 md:px-4">
        {PRODUCTS.map((product) => {
          const currentMisto = mistoQty[product.id] || { brig: 0, beij: 0 };
          const totalMisto = currentMisto.brig + currentMisto.beij;
          const hasSizes = product.sizes && product.sizes.length > 0;
          const isDocinho = !hasSizes && product.name.toLowerCase().includes('unidade');
          const abaixoDoMinimo = isDocinho && (quantities[product.id] || 1) < 10;
          const abaixoMisto = product.isMisto && totalMisto < 10;

          return (
            <div key={product.id} className={`bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all ${!lojaAberta ? 'opacity-75 grayscale-[0.3]' : ''}`}>
              <div className="aspect-square w-full overflow-hidden bg-slate-100 relative">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                {!lojaAberta && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-full text-[10px] font-black shadow-sm">FECHADO</span>
                  </div>
                )}
              </div>

              <div className="p-3 md:p-5 flex flex-col flex-grow">
                <h4 className="font-bold text-sm md:text-lg mb-2 leading-tight h-10">{product.name}</h4>
                
                {/* INTERFACE DE ESCOLHA (SÓ ATIVA SE ABERTO) */}
                <div className={`space-y-3 mb-4 ${!lojaAberta ? 'pointer-events-none' : ''}`}>
                  {product.isMisto ? (
                    <div className="space-y-2">
                       <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg">
                          <span className="text-[10px] font-bold">🍫 Brig.</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateMisto(product.id, 'brig', -5)} className="text-[#8FB9A8]"><Minus size={14}/></button>
                            <span className="text-xs font-bold">{currentMisto.brig}</span>
                            <button onClick={() => updateMisto(product.id, 'brig', 5)} className="text-[#8FB9A8]"><Plus size={14}/></button>
                          </div>
                       </div>
                       <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg">
                          <span className="text-[10px] font-bold">🥥 Beij.</span>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateMisto(product.id, 'beij', -5)} className="text-[#8FB9A8]"><Minus size={14}/></button>
                            <span className="text-xs font-bold">{currentMisto.beij}</span>
                            <button onClick={() => updateMisto(product.id, 'beij', 5)} className="text-[#8FB9A8]"><Plus size={14}/></button>
                          </div>
                       </div>
                    </div>
                  ) : hasSizes ? (
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.map((size, index) => (
                        <button key={size.label} onClick={() => setSelectedSizeIndex(prev => ({...prev, [product.id]: index}))}
                          className={`text-[10px] px-2 py-1 rounded-full border ${ (selectedSizeIndex[product.id] || 0) === index ? 'bg-[#8FB9A8] text-white' : 'bg-white'}`}>
                          {size.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-50 w-fit px-2 py-1 rounded-full border border-slate-100">
                      <button onClick={() => updateQty(product.id, -1)} className="text-[#8FB9A8]"><Minus size={14} /></button>
                      <span className="font-bold text-sm">{quantities[product.id] || 1}</span>
                      <button onClick={() => updateQty(product.id, 1)} className="text-[#8FB9A8]"><Plus size={14} /></button>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-slate-50">
                  <button
                    disabled={!lojaAberta || abaixoDoMinimo || abaixoMisto}
                    onClick={() => handleAddWithDetails(product)}
                    className={`w-full py-2 md:py-3 rounded-xl text-xs md:text-base font-bold transition-all shadow-sm 
                    ${!lojaAberta 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : (abaixoDoMinimo || abaixoMisto)
                        ? 'bg-pink-50 text-pink-200 cursor-not-allowed'
                        : 'bg-[#F4A8B9] text-white hover:bg-[#e698a9] active:scale-95'}`}
                  >
                    {!lojaAberta ? 'Loja Fechada' : (abaixoDoMinimo || abaixoMisto) ? 'Mínimo 10' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
