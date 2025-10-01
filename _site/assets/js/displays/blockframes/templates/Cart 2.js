import * as CartItem from "../organisms/Cart Item.js";
export function paint(elem, palette) {
    const items = elem.querySelectorAll(".item");
    items.forEach(item => {
        CartItem.paint(item, palette);
    })
    const chrome = elem.querySelector(".chrome");
    chrome.setAttribute("fill", palette.secondary.light);
}