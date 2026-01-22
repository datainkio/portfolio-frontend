/**
 * ---
 * aix:
 *   id: frontend.eleventy.shortcodes.collapsible
 *   role: Eleventy module: eleventy/shortcodes/collapsible.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - shortcodes
 * ---
 */
export function collapsible(content, label, accordion) {
  return `
      <input type="radio" name="${accordion}"/>
      <label class="collapse-title">${label}</label>
      <div class="collapse-content">${content}</div>
  `;
}
