/** @format */

export function paint(elem, palette) {
  console.log("Landing", elem);
  const cards = elem.querySelectorAll(".card");
  cards.forEach((card) => {
    Card.paint(card, palette.primary.light);
  });
  const chrome = elem.querySelector(".chrome");
  chrome.setAttribute("stroke", palette.accent.light);
  chrome.setAttribute("stroke-width", 10);
  chrome.setAttribute("fill", palette.secondary.dark);
}
