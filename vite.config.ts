import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pokemon-tcg-pocket-dex/',  // 確保這行存在
})
