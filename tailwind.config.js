/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'shay-green': '#8FB9A8',
        'shay-pink': '#F4A8B9',
      }
    },
  },
  plugins: [],
}