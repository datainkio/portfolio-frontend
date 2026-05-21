/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.organisms.cart-item
 *   role: Frontend runtime module: js/displays/blockframes/organisms/Cart Item.js
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
import * as Image from "./Image.js";
export function paint(elem, palette) {
  const operators = elem.querySelector(".operators");
  const breadcrumbs = elem.querySelectorAll(".breadcrumb");
  const title = elem.querySelector(".title");
  const image = elem.querySelector(".image");

  image.setAttribute("fill", palette.primary.DEFAULT);
  operators.setAttribute("fill", palette.secondary.light);
  operators.setAttribute("stroke", "");
  breadcrumbs.forEach((bc) => {
    bc.setAttribute("fill", palette.primary.light);
  });
  title.setAttribute("fill", palette.primary.DEFAULT);

  // console.log(operators, breadcrumbs, title, image);
}
