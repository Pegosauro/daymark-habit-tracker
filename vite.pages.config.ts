import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/daymark-habit-tracker/',
  plugins: [react()],
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true,
  },
})
