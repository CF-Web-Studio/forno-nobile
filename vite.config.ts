import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// GitHub Pages project site: https://cf-web-studio.github.io/forno-nobile/
// MPA — cada tier é uma entrada HTML própria, acessível por URL direta.
export default defineConfig({
  base: "/forno-nobile/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        essencial: resolve(__dirname, "essencial/index.html"),
        profissional: resolve(__dirname, "profissional/index.html"),
        premium: resolve(__dirname, "premium/index.html"),
      },
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-dom/client"],
          gsap: ["gsap", "gsap/ScrollTrigger"],
          lenis: ["lenis"],
        },
      },
    },
  },
});
