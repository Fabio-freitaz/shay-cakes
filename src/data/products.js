export const PRODUCTS = [
  {
    id: 1,
    name: 'Bolo de Cenoura',
    description: 'Massa fofinha e artesanal com uma cobertura generosa de brigadeiro cremoso.',
    image: '/image/imagem.png',
    sizes: [
      { label: 'P ', price: 20.00 },
      { label: 'M ', price: 30.00 }
    ],
    fillings: ["Chocolate", "Ninho", "Nutella"] // <--- Adicione isso
  },
{
    id: 3,
    name: 'Docinhos (Misto)',
    description: 'Escolha a quantidade desejada (mínimo 10 unidades).',
    price: 2.50, // Mudei de '2,50' para 2.50
    image: '/image/imagem1.png',
    isMisto: true 
  },

];