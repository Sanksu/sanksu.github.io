import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-404',
      closeBundle() {
        copyFileSync(resolve(__dirname, 'dist/index.html'), resolve(__dirname, 'dist/404.html'))
      }
    }
  ],
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      outDir: 'dist',
      assetsDir: 'assets'
    }
  }
}
)