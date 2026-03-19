import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react'; // Importe os ícones
import { PRODUCTS } from "../data/products";

export default function Products({ onAddToCart }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState({});
  const [quantities, setQuantities] = useState({}); // Estado para as quantidades individuais

  // Função para mudar a quantidade (mín 1, máx 100)
  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = current + delta;
      if (next >= 1 && next <= 100) {
        return { ...prev, [id]: next };
      }
      return prev;
    });
  };

  const handleAddWithDetails = (product) => {
    const hasSizes = product.sizes && product.sizes.length > 0;
    const index = selectedSizeIndex[product.id] || 0;
    const qty = quantities[product.id] || 1;
    
    const finalProduct = {
      cartId: crypto.randomUUID(), 
      name: hasSizes 
        ? `${product.name} (${product.sizes[index].label})` 
        : `${qty}x ${product.name}`,
      // Se não tem tamanho, o preço é unitário * quantidade
      price: hasSizes 
        ? `R$ ${product.sizes[index].price.toFixed(2).replace('.', ',')}` 
        : `R$ ${(parseFloat(product.price.toString().replace(',', '.')) * qty).toFixed(2).replace('.', ',')}`,
      image: product.image
    };

    onAddToCart(finalProduct);
  };

  return (
    <section className="py-20 bg-white" id="produtos">
      <div className="max-w-6xl mx-auto px-4 text-center mb-16">
        <h3 className="text-4xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>Nossas Delícias</h3>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {PRODUCTS.map((product) => {
          const hasSizes = product.sizes && product.sizes.length > 0;
          const currentIndex = selectedSizeIndex[product.id] || 0;
          const currentQty = quantities[product.id] || 1;

          return (
            <div key={product.id} className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
              <img src={product.image} 
               className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-in-out" 
                 alt={product.name} />
               </div>
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-bold text-lg mb-1 leading-tight">{product.name}</h4>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{product.description}</p>

                {hasSizes ? (
                  /* SELETOR DE TAMANHO (BOLOS) */
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Tamanho:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={size.label}
                          type="button"
                          onClick={() => setSelectedSizeIndex(prev => ({ ...prev, [product.id]: index }))}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                            currentIndex === index ? 'bg-[#8FB9A8] text-white border-[#8FB9A8]' : 'bg-slate-50 text-slate-500 border-slate-100'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* SELETOR DE QUANTIDADE + e - (DOCINHOS) */
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Quantidade:</p>
                    <div className="flex items-center gap-4 bg-slate-50 w-fit px-3 py-1 rounded-full border border-slate-100">
                      <button 
                        type="button"
                        onClick={() => updateQty(product.id, -1)}
                        className="text-[#8FB9A8] hover:bg-white rounded-full p-1 transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm min-w-[20px] text-center">{currentQty}</span>
                      <button 
                        type="button"
                        onClick={() => updateQty(product.id, 1)}
                        className="text-[#8FB9A8] hover:bg-white rounded-full p-1 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-50">
                  <p className="text-[#8FB9A8] font-bold text-xl mb-4">
                    R$ {hasSizes 
                      ? product.sizes[currentIndex].price.toFixed(2).replace('.', ',') 
                      : (parseFloat(product.price.toString().replace(',', '.')) * currentQty).toFixed(2).replace('.', ',')}
                  </p>
                  <button
                    onClick={() => handleAddWithDetails(product)}
                    className="bg-[#F4A8B9] hover:bg-[#e698a9] text-white w-full py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md shadow-pink-50"
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