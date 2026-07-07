import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 850,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          auth: ["@clerk/clerk-react"],
          query: ["@tanstack/react-query"],
          motion: ["framer-motion"],
          icons: ["lucide-react"],
          charts: ["recharts"],
          markdown: ["react-markdown", "remark-gfm"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "@clerk/clerk-react",
      "@tanstack/react-query",
      "framer-motion",
      "lucide-react",
      "react-markdown",
      "recharts",
      "remark-gfm",
    ],
  },
});
