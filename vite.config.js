import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true, // این گزینه ممکنه مشکل شما رو حل کنه
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
