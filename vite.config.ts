
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Provide polyfills for Node.js globals
    'process.env': {},
    'process.browser': true,
    'process.version': '"0.0.0"',
    'global': 'window',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Mark google-play-scraper as external to prevent bundling
      external: ['google-play-scraper']
    }
  }
}));
