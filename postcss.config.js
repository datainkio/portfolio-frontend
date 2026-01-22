/**
 * ---
 * aix:
 *   id: frontend.postcss-config
 *   role: PostCSS configuration for the frontend build.
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - postcss.config.js
 * ---
 */
export default {
  plugins: ["@tailwindcss/postcss"],
};
