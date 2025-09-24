import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import { defineConfig } from "eslint/config"

export default defineConfig([
  // Base for all JS/TS
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.es2021,
      },
    },
    rules: {
      semi: ["error", "never"],
      quotes: ["error", "double", { avoidEscape: true }],
    },
  },

  // TypeScript-specific
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/semi": ["error", "never"],
      "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true }],
    },
  },

  // React-specific
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react: pluginReact },
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: { version: "detect" },
    },
  },

  // Node-specific
  {
    files: ["**/*.{js,cjs,mjs,ts,cts,mts}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  ...tseslint.configs.stylistic,
])
