import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getManualChunk = (id: string) => {
  if (!id.includes("node_modules")) return undefined;
  if (id.includes("react") || id.includes("react-dom")) return "react-vendor";
  if (id.includes("react-router-dom")) return "router-vendor";
  if (id.includes("@clerk")) return "auth-vendor";
  if (id.includes("@tanstack")) return "query-vendor";
  if (id.includes("axios")) return "http-vendor";
  if (id.includes("framer-motion")) return "motion-vendor";
  if (id.includes("lucide-react")) return "icons-vendor";
  if (id.includes("recharts")) return "charts-vendor";
  if (id.includes("react-markdown") || id.includes("remark-gfm")) return "markdown-vendor";
  if (id.includes("@radix-ui")) return "radix-vendor";
  return "vendor";
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    minify: "esbuild",
    sourcemap: false,
    assetsInlineLimit: 2048,
    chunkSizeWarningLimit: 750,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: getManualChunk,
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  optimizeDeps: {
    include: [
      "@clerk/clerk-react",
      "@tanstack/react-query",
      "axios",
      "framer-motion",
      "lucide-react",
      "react-markdown",
      "recharts",
      "remark-gfm",
    ],
  },
});
