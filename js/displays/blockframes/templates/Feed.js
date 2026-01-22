/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.feed
 *   role: Frontend runtime module: js/displays/blockframes/templates/Feed.js
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
  var chrome = elem.querySelector(".chrome");
  var teaser_A = elem.querySelector(".teaser_A");
  var teaser_B = elem.querySelector(".teaser_B");
  var teaser_C = elem.querySelector(".teaser_C");
  var teaser_D = elem.querySelector(".teaser_D");

  chrome.setAttribute("fill", palette.accent.light);
}
