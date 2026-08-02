/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.calendar
 *   role: Frontend runtime module: js/displays/blockframes/templates/Calendar.js
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
  console.log("Calendar");
  const pagination = elem.querySelector(".pagination");
  const days = elem.querySelector(".days");
  const background = elem.querySelector(".background");
  const chrome = elem.querySelector(".chrome");

  days.setAttribute("fill", palette.primary.light);
  pagination.setAttribute("fill", palette.secondary.light);
  background.setAttribute("fill", palette.primary.dark);
  chrome.setAttribute("fill", palette.semantic.success);
  // chrome.setAttribute("stroke-width", 10);
}
