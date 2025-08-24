import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Whatsapp-Chat-Analyser/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimize for SEO and performance
    minify: 'esbuild',
    sourcemap: false,
    // Split chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['date-fns', 'lucide-react']
        },
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
    },
    // Optimize CSS
    cssCodeSplit: true,
    // Asset size warnings
    chunkSizeWarningLimit: 1000
  },
  // Optimize for performance
  server: {
    host: true,
    port: 5173
  }
})
