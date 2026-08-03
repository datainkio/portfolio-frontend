/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.organisms.image
 *   role: Frontend runtime module: js/displays/blockframes/organisms/Image.js
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
export function paint(elem, palette) {
  const sun = elem.querySelector(".sun");
  const mountains = elem.querySelector(".mountains");
  const sky = elem.querySelector(".sky");

  sun.setAttribute("fill", palette.dark);
  mountains.setAttribute("fill", palette.DEFAULT);
  sky.setAttribute("fill", palette.light);
}
