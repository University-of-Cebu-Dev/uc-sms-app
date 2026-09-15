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
      // Use each API's `https` launch profile (Identity :7032, SMS API :7164).
      // The `http` profiles bind 5135/5286 only; this proxy will then fail with
      // ECONNREFUSED and the login form shows "sign-in service unavailable".
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
