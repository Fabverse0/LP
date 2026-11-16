import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // React rarely changes between releases, so it caches on its own.
        manualChunks(id) {
          if (id.includes("node_modules/react")) return "react";
          return undefined;
        },
      },
    },
  },
});
