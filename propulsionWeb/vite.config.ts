import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-plugin-tsconfig-paths'

export default defineConfig({
  base: '/', // Use '/' for local development
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@src': '/src'
    }
  },
  publicDir: 'docs', // Serve static files from docs instead of public
})
