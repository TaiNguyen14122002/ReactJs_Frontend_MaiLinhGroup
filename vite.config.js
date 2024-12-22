// import path from "path"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/', // Đảm bảo base path được cấu hình đúng
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Proxy Firebase Storage
      '/files': {
        target: 'https://firebasestorage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/files/, ''),
      },
    },
  },
})



