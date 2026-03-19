import { ChevronDown, ShoppingBag } from 'lucide-react';

export default function Hero() {
  // Função para rolar até os produtos
  const scrollToProducts = () => {
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#E8F3ED] relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Detalhes decorativos de fundo */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-[#F4A8B9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-[#8FB9A8] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Lado Esquerdo: Texto e Botão Único */}
        <div className="flex-1 text-center md:text-left z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-white text-[#8FB9A8] text-sm font-bold mb-4 shadow-sm">
            🍰 Confeitaria Artesanal
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Bolos e doces artesanais feitos com carinho
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
            Transformando seus momentos especiais em memórias deliciosas com ingredientes selecionados e muito amor.
          </p>
          
          <div className="flex justify-center md:justify-start">
            <button 
              onClick={scrollToProducts}
              className="bg-[#F4A8B9] hover:bg-[#e698a9] text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-pink-100 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <ShoppingBag size={24} />
              Escolher minhas delícias
            </button>
          </div>
        </div>

        {/* Lado Direito: Imagem */}
        <div className="flex-1 w-full max-w-md z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#F4A8B9] rounded-[2rem] rotate-6 opacity-20"></div>
            <img 
              src="https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800" 
              className="relative rounded-[2rem] shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500 object-cover h-[450px] w-full" 
              alt="Bolo Shay Cakes" 
            />
          </div>
        </div>
      </div>

      {/* Indicador de "Role para baixo" */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <button onClick={scrollToProducts} className="text-slate-400 hover:text-[#8FB9A8] transition-colors">
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}