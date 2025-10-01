/** @format */

export function paint(elem, palette) {
  console.log("Chart", elem);
  const pie = elem.querySelector(".pie");
  const donut = elem.querySelector(".donut");
  const headlines = elem.querySelector(".headlines");

  const chrome = elem.querySelector(".chrome");
  chrome.setAttribute("stroke", palette.primary.light);
  chrome.setAttribute("stroke-width", 10);
  chrome.setAttribute("fill", palette.secondary.dark);
}
