/** @format */

export function paint(elem, palette) {
  var chrome = elem.querySelector(".chrome");
  var teaser_A = elem.querySelector(".teaser_A");
  var teaser_B = elem.querySelector(".teaser_B");
  var teaser_C = elem.querySelector(".teaser_C");
  var teaser_D = elem.querySelector(".teaser_D");

  chrome.setAttribute("fill", palette.accent.light);
}
