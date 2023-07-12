import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./src/manifest";
import { resolve } from "path";
import zipPack from "vite-plugin-zip-pack";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    zipPack({
      outDir: `package`,
      inDir: "build",
      outFileName: `${pkg.name.replace(" ", "-")}-v${pkg.version}.zip`,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@lib": resolve(__dirname, "src/lib"),
      "@api": resolve(__dirname, "src/lib/api"),
      "@bridge": resolve(__dirname, "src/lib/bridge"),
      "@component": resolve(__dirname, "src/lib/component"),
      "@message": resolve(__dirname, "src/lib/message"),
      "@polyfill": resolve(__dirname, "src/lib/polyfill"),
      "@storage": resolve(__dirname, "src/lib/storage"),
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "build",
    rollupOptions: {
      output: {
        chunkFileNames: "assets/chunk-[hash].js",
      },
    },
  },
});
