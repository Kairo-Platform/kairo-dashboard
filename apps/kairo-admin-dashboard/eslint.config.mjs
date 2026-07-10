import nextConfig from "@kairo/config-eslint/next";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...nextConfig,
  globalIgnores(["**/*.d.ts"]),
]);
