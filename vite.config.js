// vite.config.js
// Ejecuta con: npx vite
// Build con:   npx vite build

import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyAssetsPlugin() {
  return {
    name: 'copy-forum-assets',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'assets/forum');
      const destDir = path.resolve(__dirname, 'dist/assets/forum');
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.cpSync(srcDir, destDir, { recursive: true });
        console.log('[vite] Copied assets/forum -> dist/assets/forum');
      }
      const logoSrc = path.resolve(__dirname, 'assets/logo-forum.png');
      const logoDest = path.resolve(__dirname, 'dist/assets/logo-forum.png');
      if (fs.existsSync(logoSrc)) {
        fs.copyFileSync(logoSrc, logoDest);
      }
    },
  };
}

export default defineConfig({
  root: '.',
  base: './',
  plugins: [copyAssetsPlugin()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './index.html',
    },
  },
});