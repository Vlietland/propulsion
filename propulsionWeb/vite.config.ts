import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

export default defineConfig({
  base: '/', // Use '/' for local development
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@src': '/propulsionWeb/src'
    }
  }
});
