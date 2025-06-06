import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/',
  define: {
    __ASSET_BASE_PATH__: JSON.stringify(process.env.VITE_ASSET_BASE_PATH || '')
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './propulsionWeb/src'),
      '@excalibur-tiled': path.resolve(__dirname, './propulsionWeb/external/excalibur-tiled/src'),
      '@assets': path.resolve(__dirname, './propulsionWeb/publish')
    }
  },
  publicDir: 'propulsionWeb/publish',
  build: {
    outDir: 'docs'
  }
})
