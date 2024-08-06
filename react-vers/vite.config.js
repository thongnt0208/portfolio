import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sass from "sass";
import alias from "@rollup/plugin-alias";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    alias({
      entries: [
        { find: "@assets", replacement: fileURLToPath(new URL("./src/assets", import.meta.url)) },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
