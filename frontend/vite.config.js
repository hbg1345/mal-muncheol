import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // 백엔드 서버 주소
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // rewrite 옵션 제거
      },
    },
  },
})
