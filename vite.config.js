import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    // Disable source maps in production (security best practice)
    sourcemap: false,

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },

    // Minify with terser settings
    minify: 'esbuild',
  },

  // Remove console logs and debugger in production
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  // Server proxy for dev (routes API calls to avoid CORS in dev)
  server: {
    port: 5173,
    open: true,
  },
}))
