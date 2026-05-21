/**
 * ---
 * aix:
 *   id: frontend.js.utils.diagnostics.scroll-blocked
 *   role: Frontend runtime module: js/utils/diagnostics/scroll-blocked.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - utils
 *     - diagnostics
 * ---
 */
// Add before closing </body> tag
// Diagnostic: Find what's blocking scroll
(function () {
  console.group("Scroll Diagnostic");

  // Check body/html overflow
  const body = getComputedStyle(document.body);
  const html = getComputedStyle(document.documentElement);
  console.log("Body overflow-y:", body.overflowY);
  console.log("HTML overflow-y:", html.overflowY);

  // Check for fixed position blockers
  const fixed = Array.from(document.querySelectorAll("*")).filter((el) => {
    const style = getComputedStyle(el);
    return (
      style.position === "fixed" &&
      style.pointerEvents !== "none" &&
      el.offsetHeight > window.innerHeight * 0.5
    );
  });
  console.log("Large fixed elements without pointer-events:none:", fixed);

  // Check smooth scroll wrappers
  const wrapper = document.querySelector("#smooth-wrapper");
  if (wrapper) {
    const wStyle = getComputedStyle(wrapper);
    console.log("Smooth wrapper position:", wStyle.position);
    console.log("Smooth wrapper overflow:", wStyle.overflow);
    console.log("Smooth wrapper height:", wStyle.height);
  }

  // Test if scroll is actually working
  let scrollCount = 0;
  const testScroll = () => {
    scrollCount++;
    console.log("Scroll event fired:", scrollCount);
  };
  window.addEventListener("scroll", testScroll, { passive: true });

  setTimeout(() => {
    window.removeEventListener("scroll", testScroll);
    console.log("Total scroll events in 5s:", scrollCount);
    if (scrollCount === 0) {
      console.error("⚠️ NO SCROLL EVENTS - Scroll is completely blocked");
    }
  }, 5000);

  // ScrollSmoother-aware diagnostic
  const smoother = window.ScrollSmoother && ScrollSmoother.get();
  if (window.ScrollTrigger) {
    let stEvents = 0;
    ScrollTrigger.addEventListener("scrollStart", () => {
      stEvents++;
    });
    ScrollTrigger.addEventListener("scrollEnd", () => {
      /* noop */
    });
    setTimeout(() => {
      console.log("ScrollTrigger scrollStart events in 5s:", stEvents);
      if (stEvents === 0) {
        console.warn(
          "No ScrollTrigger events detected; check smoother initialization and DOM IDs.",
        );
      }
    }, 5000);
  } else {
    console.warn(
      "ScrollTrigger not available; only window scroll events counted.",
    );
  }

  console.groupEnd();
})();
