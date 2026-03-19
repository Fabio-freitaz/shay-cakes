import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.js.dev/config/
export default defineConfig({
  plugins: [react()],
})