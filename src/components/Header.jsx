import React from 'react';

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#E8F3ED] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center">
        
        {/* LADO ESQUERDO: LOGO REDONDA + NOME */}
        <div className="flex items-center gap-3">
          {/* CONTAINER REDONDO DA LOGO */}
          <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center overflow-hidden rounded-full border-2 border-pink-100 shadow-sm bg-slate-50 shrink-0">
            <img 
              src='/image/logo.png' 
              alt='Logo Shay Cakes' 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 
              className="text-xl md:text-2xl font-bold text-[#8FB9A8] leading-tight" 
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Shay Cakes
            </h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300 font-bold hidden md:block">
              Confeitaria Artesanal
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}