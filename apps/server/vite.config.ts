import { defineConfig } from "vite"
import { resolve } from "path"

import pkg from "./package.json"

const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
]

export default defineConfig({
  build: {
    outDir: "dist",

    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "server-bundle",
      formats: ["cjs"],
    },

    rollupOptions: {
      external: externalPackages,
    },

    emptyOutDir: false,
  },
})
