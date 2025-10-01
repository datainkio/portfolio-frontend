/** @format */

export function paint(elem, palette) {
  var chrome = elem.querySelector(".chrome");
  var text = elem.querySelector(".text");

  chrome.setAttribute("fill", palette.secondary.light);
}
