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
      // UCSMS.API's own native "https" launch profile.
      '/api': {
        // https, not http: app.UseHttpsRedirection() 307s every HTTP request to its
        // HTTPS port, which took the browser's fetch() straight out of this
        // same-origin proxy to a different origin. Targeting the HTTPS port
        // directly avoids that redirect entirely.
        target: 'https://localhost:7164',
        changeOrigin: true,
        secure: false, // dev cert is self-signed; Node's proxy client doesn't trust it
      },
      '/identity-api': {
        target: 'https://localhost:7032/api',
        changeOrigin: true,
        secure: false, // dev cert is self-signed; Node's proxy client doesn't trust it
        rewrite: (path) => path.replace(/^\/identity-api/, ''),
      },
    },
  },
})
