import { defineConfig, globalIgnores } from "eslint/config";

/** Minimal ESLint config for non-Next workspace packages */
const libraryConfig = defineConfig([
  globalIgnores(["dist/**", "node_modules/**", "**/*.d.ts"]),
]);

export default libraryConfig;
