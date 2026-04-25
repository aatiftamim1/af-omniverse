import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['framer-motion', 'lucide-react'],
          'terminal': ['xterm', 'xterm-addon-fit'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2020',
  },
  server: {
    warmup: {
      clientFiles: ['./src/context/AppContext.tsx', './src/pages/Dashboard.tsx'],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'xterm', 'xterm-addon-fit'],
    exclude: [],
  },
});