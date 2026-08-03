/**
 * ---
 * aix:
 *   id: frontend.js.displays.blockframes.templates.cart
 *   role: Frontend runtime module: js/displays/blockframes/templates/Cart.js
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
import * as CartItem from "../organisms/Cart Item.js";
export function paint(elem, palette) {
  const items = elem.querySelectorAll(".item");
  items.forEach((item) => {
    CartItem.paint(item, palette);
  });
  const chrome = elem.querySelector(".chrome");
  chrome.setAttribute("fill", palette.secondary.light);
}
