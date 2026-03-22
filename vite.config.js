import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0', // បើកឱ្យគ្រប់ឧបករណ៍ក្នុង Wi-Fi ចូលមើលបាន
    port: 5173,
    strictPort: true,
  }
})