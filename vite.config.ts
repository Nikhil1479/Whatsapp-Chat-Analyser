import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Whatsapp-Chat-Analyser/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Add cache-busting for deployments
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // Add timestamp to asset names for cache busting
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.')
          const ext = info[info.length - 1]
          const name = info.slice(0, -1).join('.')
          return `assets/${name}-[hash].${ext}`
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
