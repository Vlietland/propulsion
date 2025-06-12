import { defineConfig, loadEnv } from 'vite'
import path from 'path'

const env = loadEnv('development', process.cwd(), 'VITE_')

export default defineConfig({
  base: '/propulsion/',
  define: {
    __ASSET_BASE_PATH__: JSON.stringify(env.VITE_ASSET_BASE_PATH || '/propulsion'),
    __BASE_LEVEL__: JSON.stringify(env.VITE_BASE_LEVEL || '1')
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './propulsionWeb/src'),
      '@excalibur-tiled': path.resolve(__dirname, './propulsionWeb/external/excalibur-tiled/src'),
      '@assets': path.resolve(__dirname, './propulsionWeb/publish')
    },
    dedupe: ['excalibur']
  },
  publicDir: 'propulsionWeb/publish',
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        // Ensure excalibur is not duplicated
        manualChunks: {
          excalibur: ['excalibur']
        }
      }
    }
  },
  server: {
    // Handle favicon requests when running with base path in dev mode
    proxy: {
      '^/favicon.ico$': {
        target: 'http://localhost:5173/propulsion',
        changeOrigin: true,
        rewrite: () => '/favicon.ico'
      }
    }
  }
})
