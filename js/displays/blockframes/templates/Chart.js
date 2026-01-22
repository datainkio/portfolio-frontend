/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.chart
 *   role: Frontend runtime module: js/displays/blockframes/templates/Chart.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - displays
 *     - blockframes
 * ---
 */
/** @format */

export function paint(elem, palette) {
  console.log("Chart", elem);
  const pie = elem.querySelector(".pie");
  const donut = elem.querySelector(".donut");
  const headlines = elem.querySelector(".headlines");

  const chrome = elem.querySelector(".chrome");
  chrome.setAttribute("stroke", palette.primary.light);
  chrome.setAttribute("stroke-width", 10);
  chrome.setAttribute("fill", palette.secondary.dark);
}
