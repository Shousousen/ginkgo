import { resolve } from 'node:path';
import { defineConfig } from 'vite';
 
export default defineConfig((opt) => {
  return {
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          background: resolve(__dirname, 'src/background.ts'),
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
    },
  };
});