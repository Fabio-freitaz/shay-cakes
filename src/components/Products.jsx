import React, { useState } from 'react';
import { PRODUCTS } from "../data/products";

export default function Products({ onAddToCart }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState({});

const handleAddWithDetails = (product) => {
  const index = selectedSizeIndex[product.id] || 0;
  const choice = product.sizes[index];

  const finalProduct = {
    // Muito mais seguro e evita qualquer chance de colisão de ID
    cartId: crypto.randomUUID(), 
    name: `${product.name} (${choice.label})`,
    price: `R$ ${choice.price.toFixed(2).replace('.', ',')}`,
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
          const currentIndex = selectedSizeIndex[product.id] || 0;
          const currentChoice = product.sizes[currentIndex];

          return (
            <div key={product.id} className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col">
              <img src={product.image} className="h-52 w-full object-cover" alt={product.name} />
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-bold text-lg mb-1 leading-tight">{product.name}</h4>
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">{product.description}</p>

                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Tamanho / Qtd:</p>
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

                <div className="mt-auto pt-4 border-t border-slate-50">
                  <p className="text-[#8FB9A8] font-bold text-xl mb-4">R$ {currentChoice.price.toFixed(2).replace('.', ',')}</p>
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