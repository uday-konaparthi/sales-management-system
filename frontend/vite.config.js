import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react(),],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@repo/shadcn-ui': path.resolve(__dirname, 'src/components'),
    },
  },
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['@undecaf/zbar-wasm'], // ✅ prevents pre-bundling issues
  },
  server: {
    mimeTypes: {
      'application/wasm': ['wasm']
    }
  }
})
