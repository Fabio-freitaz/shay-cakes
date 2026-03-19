import { Heart } from 'lucide-react';

export default function Header({ onScroll }) {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#E8F3ED]">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="text-[#F4A8B9] fill-[#F4A8B9]" size={24} />
          <h1 className="text-2xl font-bold text-[#8FB9A8]" style={{ fontFamily: 'Georgia, serif' }}>Shay Cakes</h1>
        </div>
        <button onClick={onScroll} className="hidden md:block bg-[#8FB9A8] hover:bg-[#7ba392] text-white px-6 py-2 rounded-full font-medium transition-all shadow-sm">
          Fazer Encomenda
        </button>
      </div>
    </header>
  );
}