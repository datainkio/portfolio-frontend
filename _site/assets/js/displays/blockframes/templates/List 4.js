/** @format */

export function paint(elem, palette) {
  var chrome = elem.querySelector(".chrome");
  var text = elem.querySelectorAll(".text");
  var bullets = elem.querySelectorAll(".bullet");
  var star = elem.querySelector(".star");
  var header = elem.querySelector(".header");

  chrome.setAttribute("fill", palette.secondary.DEFAULT);
}
