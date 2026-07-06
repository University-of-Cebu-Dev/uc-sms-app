import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5286',
        changeOrigin: true,
      },
      '/identity-api': {
        target: 'http://localhost:5135/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/identity-api/, ''),
      },
    },
  },
})
