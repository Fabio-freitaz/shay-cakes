import React, { useState } from 'react';
import { Minus, Plus, Check, ShoppingBasket } from 'lucide-react';
import { PRODUCTS } from "../data/products";

export default function Products({ onAddToCart }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState({});
  const [selectedFilling, setSelectedFilling] = useState({});
  const [quantities, setQuantities] = useState({});
  
  // Estado para controlar os sabores mistos (Brigadeiro e Beijinho)
  const [mistoQty, setMistoQty] = useState({});

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
      if (nextValue >= 0) {
        return { ...prev, [id]: { ...current, [flavor]: nextValue } };
      }
      return prev;
    });
  };

  const handleAddWithDetails = (product) => {
    const hasSizes = product.sizes && product.sizes.length > 0;
    const hasFillings = product.fillings && product.fillings.length > 0;
    
    // Lógica para Produto Misto (Brigadeiro + Beijinho)
    if (product.isMisto) {
      const qty = mistoQty[product.id] || { brig: 0, beij: 0 };
      const totalMisto = qty.brig + qty.beij;

      if (totalMisto < 10) {
        return alert("O pedido mínimo para docinhos mistos é de 10 unidades no total.");
      }

      const finalName = `${product.name} (${qty.brig} Brigadeiro, ${qty.beij} Beijinho)`;
      const unitPrice = parseFloat(product.price.toString().replace(',', '.'));
      const totalPrice = (unitPrice * totalMisto).toFixed(2).replace('.', ',');

      onAddToCart({
        cartId: crypto.randomUUID(),
        name: finalName,
        price: `R$ ${totalPrice}`,
        image: product.image
      });
      return;
    }

    // Lógica para Produtos Normais (Bolos e Doces Simples)
    const qty = quantities[product.id] || 1;
    if (!hasSizes && qty < 10 && product.name.toLowerCase().includes('unidade')) {
      return alert("O pedido mínimo para docinhos é de 10 unidades.");
    }

    const sizeIdx = selectedSizeIndex[product.id] || 0;
    const filling = selectedFilling[product.id] || (hasFillings ? product.fillings[0] : "");

    let finalName = product.name;
    if (hasSizes) finalName += ` (${product.sizes[sizeIdx].label})`;
    if (hasFillings) finalName += ` + Cobertura: ${filling}`;
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
          Nossas Delícias
        </h3>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 px-2 md:px-4">
        {PRODUCTS.map((product) => {
          const hasSizes = product.sizes && product.sizes.length > 0;
          const hasFillings = product.fillings && product.fillings.length > 0;
          const currentSizeIdx = selectedSizeIndex[product.id] || 0;
          const currentQty = quantities[product.id] || 1;
          const currentFilling = selectedFilling[product.id] || (hasFillings ? product.fillings[0] : "");

          // Lógica de visualização do Misto
          const isMisto = product.isMisto;
          const currentMisto = mistoQty[product.id] || { brig: 0, beij: 0 };
          const totalMisto = currentMisto.brig + currentMisto.beij;

          return (
            <div key={product.id} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="aspect-square w-full overflow-hidden bg-slate-100">
                <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
              </div>

              <div className="p-3 md:p-5 flex flex-col flex-grow">
                <h4 className="font-bold text-sm md:text-lg mb-2 leading-tight h-10">{product.name}</h4>
                
                {/* OPÇÃO MISTA (BRIGADEIRO + BEIJINHO NO MESMO ID) */}
                {isMisto ? (
                  <div className="space-y-2 mb-3">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Escolha as Qtds:</p>
                    <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold">🍫 Brig.</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateMisto(product.id, 'brig', -5)} className="text-[#8FB9A8]"><Minus size={12}/></button>
                        <span className="text-xs font-bold">{currentMisto.brig}</span>
                        <button onClick={() => updateMisto(product.id, 'brig', 5)} className="text-[#8FB9A8]"><Plus size={12}/></button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold">🥥 Beij.</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateMisto(product.id, 'beij', -5)} className="text-[#8FB9A8]"><Minus size={12}/></button>
                        <span className="text-xs font-bold">{currentMisto.beij}</span>
                        <button onClick={() => updateMisto(product.id, 'beij', 5)} className="text-[#8FB9A8]"><Plus size={12}/></button>
                      </div>
                    </div>
                    <p className="text-[9px] text-center font-bold text-[#8FB9A8]">Total: {totalMisto} unid.</p>
                  </div>
                ) : (
                  <>
                    {/* TAMANHOS (BOLOS) */}
                    {hasSizes && (
                      <div className="mb-3">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Tamanho:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.sizes.map((size, index) => (
                            <button key={size.label} onClick={() => setSelectedSizeIndex(prev => ({ ...prev, [product.id]: index }))}
                              className={`text-[10px] px-2 py-1 rounded-full border ${currentSizeIdx === index ? 'bg-[#8FB9A8] text-white border-[#8FB9A8]' : 'bg-slate-50 text-slate-500'}`}>
                              {size.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* COBERTURAS (BOLOS) */}
                    {hasFillings && (
                      <div className="mb-3">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Cobertura:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.fillings.map((fill) => (
                            <button key={fill} onClick={() => setSelectedFilling(prev => ({ ...prev, [product.id]: fill }))}
                              className={`text-[10px] px-2 py-1 rounded-full border flex items-center gap-1 ${currentFilling === fill ? 'bg-[#F4A8B9] text-white border-[#F4A8B9]' : 'bg-white text-slate-400 border-slate-100'}`}>
                              {currentFilling === fill && <Check size={10}/>} {fill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* QUANTIDADE (DOCES SIMPLES) */}
                    {!hasSizes && (
                      <div className="mb-3">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Quantidade:</p>
                        <div className="flex items-center gap-3 bg-slate-50 w-fit px-2 py-1 rounded-full border border-slate-100">
                          <button onClick={() => updateQty(product.id, -1)} className="text-[#8FB9A8]"><Minus size={14} /></button>
                          <span className="font-bold text-sm">{currentQty}</span>
                          <button onClick={() => updateQty(product.id, 1)} className="text-[#8FB9A8]"><Plus size={14} /></button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-auto pt-3 border-t border-slate-50">
                  <p className="text-[#8FB9A8] font-bold text-base md:text-xl mb-3">
                    R$ {isMisto 
                      ? (parseFloat(product.price.toString().replace(',', '.')) * totalMisto).toFixed(2).replace('.', ',')
                      : hasSizes ? product.sizes[currentSizeIdx].price.toFixed(2).replace('.', ',') 
                      : (parseFloat(product.price.toString().replace(',', '.')) * currentQty).toFixed(2).replace('.', ',')}
                  </p>
                  <button
                    onClick={() => handleAddWithDetails(product)}
                    className="w-full bg-[#F4A8B9] text-white py-2 md:py-3 rounded-xl text-xs md:text-base font-bold transition-all hover:bg-[#e698a9] active:scale-95 shadow-sm"
                  >
                    Adicionar
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