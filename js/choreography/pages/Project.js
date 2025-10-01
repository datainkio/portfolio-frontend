/**
 * Introduces intro and outro animations to a Project page.
 *
 * Primary elements of a Project page:
 * - #project-banner
 * - article.project
 * - article.project header
 * - article.project header nav, h1, #awards
 * - article.project section#abstract
 * - article.project section.nugget
 * - article.project #project-nav
 */

const TL = gsap.timeline();
const DUR = 0.75;

document.addEventListener("DOMContentLoaded", () => {
  const animatedLinks = document.querySelectorAll("a.sexy-link");
  animatedLinks.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });
  // TODO: Address FOUC
  TL.from("#project-banner", { duration: DUR, opacity: 0, y: -24 });
  TL.from("article", { duration: DUR, opacity: 0, y: 12 }, "-=25%");
  TL.from("#project-nav", { duration: DUR, opacity: 0 }, "-=25%");
});

function handleLinkClick(event) {
  event.preventDefault(); // Prevent immediate navigation

  // Leave the page when the animation is complete
  TL.eventCallback("onReverseComplete", () => {
    window.location.href = this.href;
  });
  TL.timeScale(2); // Double the speed of the animation
  TL.reverse(); // Play the animation in reverse
}
