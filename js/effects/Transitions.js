/**
 * ---
 * aix:
 *   id: frontend.js.effects.transitions
 *   role: Frontend runtime module: js/effects/Transitions.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - effects
 *     - Transitions.js
 * ---
 */
export function reveal(params) {
  // var elem = document.getElementById(id);
  var tl = gsap.timeline();
  tl.fromTo(
    params.elem,
    { y: params.origin.y, opacity: params.origin.opacity },
    {
      duration: params.duration,
      y: params.destination.y,
      opacity: params.destination.opacity,
      ease: params.ease,
    },
  );
  return tl;
}
