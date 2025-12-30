import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel plugins for optimization
      babel: {
        plugins: [
          // Remove console logs in production
          process.env.NODE_ENV === 'production' && [
            'transform-remove-console',
            { exclude: ['error', 'warn'] }
          ],
        ].filter(Boolean),
      },
    }),
    
    // Gzip compression
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // Only compress files > 10KB
      algorithm: 'gzip',
      ext: '.gz',
    }),
    
    // Brotli compression (better than gzip)
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    
    // Bundle analyzer (only in analyze mode)
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
  
  server: {
    port: 3000,
    open: true,
    // Enable HMR for better dev experience
    hmr: {
      overlay: true,
    },
  },
  
  // Build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for debugging (disable in production)
    sourcemap: process.env.NODE_ENV !== 'production',
    
    // Minify with terser for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
    },
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-framer': ['framer-motion'],
          'vendor-styled': ['styled-components'],
          'vendor-icons': ['lucide-react'],
          
          // Feature chunks
          'features-qr': [
            './src/components/features/QRGenerator/QRCanvas.jsx',
            './src/components/features/QRGenerator/QRSettings.jsx',
          ],
          'features-pdf': [
            './src/utils/pdfAssembly.js',
            './src/utils/pdfPrinter.js',
          ],
          
          // Utils chunk
          'utils': [
            './src/utils/validators.js',
            './src/utils/formatters.js',
            './src/utils/performance.js',
          ],
        },
        
        // File naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning threshold
    
    // Asset handling
    assetsInlineLimit: 4096, // 4KB - inline assets smaller than this
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // CSS minification
    cssMinify: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'styled-components',
      'framer-motion',
      'lucide-react',
    ],
    exclude: [
      // Exclude large dependencies that should be lazy loaded
    ],
  },
  
  // Performance settings
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Drop console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
