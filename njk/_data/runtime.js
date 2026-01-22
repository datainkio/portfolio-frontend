/**
 * ---
 * aix:
 *   id: frontend.njk.data.runtime
 *   role: Eleventy data module: njk/_data/runtime.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - njk
 *     - _data
 * ---
 */
const normalizeBoolean = value => {
  if (value === undefined) return undefined;
  const normalized = value.toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return undefined;
};

const bundlePreference = normalizeBoolean(process.env.BUNDLE_JS);

export default {
  // Defaults to bundling unless explicitly disabled via BUNDLE_JS=false
  bundleJs: bundlePreference ?? true,
};
