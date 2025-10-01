/** @format */

export function paint(elem, palette) {
  var chrome = elem.querySelector(".chrome");
  var text = elem.querySelector(".text");
  var modules = elem.querySelectorAll(".module");

  chrome.setAttribute("fill", palette.primary.light);
}
