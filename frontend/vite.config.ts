import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api-wilayah': {
        target: 'https://emsifa.github.io/api-wilayah-indonesia/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-wilayah/, '')
      }
    }
  }
})
