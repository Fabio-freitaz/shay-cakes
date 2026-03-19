import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';


export default function App() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    nome: '', 
    tipoEntrega: 'Retirada', 
    endereco: '', 
    dataEntrega: '', 
    observacao: ''
  });

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    // Sem scroll automático aqui, como você pediu!
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToForm = () => {
    document.getElementById('encomenda')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800">
      <Header onScroll={scrollToForm} />
      <main>
        <Hero />
        <Products onAddToCart={addToCart} />
       <OrderForm 
         cart={cart} 
         setCart={setCart} // Necessário para reiniciar o site
         onRemove={removeFromCart}
         formData={formData} 
         setFormData={setFormData}
        onChange={handleInputChange}
/>
      </main>
      <Footer />
    </div>
  );
}