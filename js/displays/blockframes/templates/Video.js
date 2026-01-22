/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.video
 *   role: Frontend runtime module: js/displays/blockframes/templates/Video.js
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
  const chrome = elem.querySelector(".chrome");
  const text = elem.querySelectorAll(".text");
  const video = elem.querySelector(".video");
  const play = elem.querySelector(".play");

  play.setAttribute("fill", palette.primary.dark);
  video.setAttribute("fill", palette.neutral.light);
  chrome.setAttribute("fill", palette.primary.DEFAULT);
}
