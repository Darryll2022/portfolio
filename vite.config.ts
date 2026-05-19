import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  build: {
    // Strip all comments/banners that leak framework names
    rollupOptions: {
      output: {
        // Randomise chunk names — prevents fingerprinting by file name
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash][extname]',
        // No banner comments
        banner: '',
      },
    },
    // No source maps in production
    sourcemap: false,
    // Minify aggressively — removes identifiable strings where possible
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // strip all console.* calls
        drop_debugger: true,
        passes: 2,
      },
      mangle: {
        toplevel: true,       // mangle top-level names — harder to fingerprint
      },
      format: {
        comments: false,      // strip all comments including @license banners
      },
    },
  },
})
