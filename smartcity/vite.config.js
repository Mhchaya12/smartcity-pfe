import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/components/ui': path.resolve(__dirname, './src/components/components_dash_technicien/ui'),
      '@/components/dash': path.resolve(__dirname, './src/components/components_dash_technicien'),
      "@/lib": path.resolve(__dirname, './src/lib'),
      "@/hooks": path.resolve(__dirname, './src/hooks'),
      "@/data": path.resolve(__dirname, './src/data'),
      "@/pages": path.resolve(__dirname, './src/pages'),
    },
  },
  server: {
    port: 3000
  }
}) 
