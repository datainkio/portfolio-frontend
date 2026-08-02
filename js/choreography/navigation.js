/**
 * ---
 * aix:
 *   id: frontend.js.choreography.navigation
 *   role: Frontend runtime module: js/choreography/navigation.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - choreography
 *     - navigation.js
 * ---
 */
/**
 * Detect when a user clicks a link, play an outro, and navigate to the desired page after the animation completes.
 *
 * See choreography/pages/ for transition animations. Assume each page has an intro and outro animation.
 */

document.addEventListener("DOMContentLoaded", () => {
  const animatedLinks = document.querySelectorAll("a.sexy-link");

  animatedLinks.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });
});

function handleLinkClick(event) {
  event.preventDefault(); // Prevent immediate navigation

  const targetUrl = this.href; // Get the URL to navigate to

  // Example Animation: Fade out the body
  gsap.to("body", {
    duration: 0.5,
    opacity: 0,
    onComplete: () => {
      window.location.href = targetUrl; // Navigate after animation
    },
  });

  // You can customize the animation as needed
}
