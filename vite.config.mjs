import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/fintracker/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Extraer el paquete raíz de node_modules, maneja scoped packages
          const parts = id.split('node_modules/')[1].split('/');
          let pkg = parts[0];
          if (pkg.startsWith('@') && parts.length > 1) {
            pkg = pkg + '_' + parts[1];
          }
          // Normalizar nombre (evitar caracteres no válidos)
          const name = pkg.replace(/[^a-zA-Z0-9_]/g, '_');
          return `vendor_${name}`;
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
})
