import { defineConfig } from 'vite'
import react from '@vitejs/react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
 // <--- COLOQUE O NOME DO SEU REPOSITÓRIO AQUI
})