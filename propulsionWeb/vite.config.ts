import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-plugin-tsconfig-paths'

// Custom plugin to suppress asset warnings
const suppressAssetWarnings = () => {
  return {
    name: 'suppress-asset-warnings',
    configureServer() {
      const originalWarn = console.warn
      console.warn = (...args) => {
        const message = args.join(' ')
        if (message.includes('Files in the public directory are served at the root path') ||
            message.includes('Instead of /docs/')) {
          return
        }
        originalWarn(...args)
      }
    }
  }
}

export default defineConfig({
  base: '/', // Use '/' for local development
  plugins: [tsconfigPaths(), suppressAssetWarnings()],
  resolve: {
    alias: {
      '@src': '/src'
    }
  },
  publicDir: 'docs',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'ASSET_NOT_FOUND' && warning.message.includes('/docs/')) {
          return
        }
        if (warning.message.includes('Files in the public directory are served at the root path')) {
          return
        }
        warn(warning)
      }
    }
  },
  logLevel: 'error' // Only show errors, not warnings
})
