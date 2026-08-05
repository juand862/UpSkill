import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Alias '@' -> 'src' para imports limpios en todo el proyecto
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
