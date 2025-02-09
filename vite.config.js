// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   css: {
//     postcss: './postcss.config.js',
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "shared-utils": path.resolve(__dirname, "../shared-utils"), // Update path
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
