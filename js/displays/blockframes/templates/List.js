/** @format */

export function paint(elem, palette) {
  var chrome = elem.querySelector(".chrome");
  var text = elem.querySelectorAll(".text");
  var bullets = elem.querySelectorAll(".bullet");
  var star = elem.querySelector(".star");
  var header = elem.querySelector(".header");

  chrome.setAttribute("fill", palette.secondary.DEFAULT);
  header.setAttribute("fill", palette.neutral.dark);
  text.forEach((t) => t.setAttribute("fill", palette.neutral.dark));
  bullets.forEach((b) => b.setAttribute("fill", palette.primary.DEFAULT));
  star.setAttribute("fill", palette.accent.DEFAULT);
}
