/**
 * ---
 * aix:
 *   id: frontend.scripts.clearcache
 *   role: Build/utility script: scripts/clearCache.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - clearCache.js
 * ---
 */
import { rm } from "fs/promises";
import { join } from "path";

const cacheDir = join(process.cwd(), ".cache");

try {
  await rm(cacheDir, { recursive: true, force: true });
  console.log("✓ Cache cleared");
} catch (error) {
  console.error("✗ Error clearing cache:", error);
}
