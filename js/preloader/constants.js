export const PRELOADER_SELECTORS = {
  root: "[data-preloader]",
  // The hanko mark inside the preloader. Its paths carry the CSS settle
  // transition whose `transitionend` marks the end of the outro.
  hankoMount: ".hanko-mount",
  main: "main",
  deferredVideos: "video[data-defer-video][data-src]",
  // Opt-in marker for videos whose playback is decorative. Under
  // prefers-reduced-motion these are left unhydrated so their poster stands
  // in. Videos WITHOUT this attribute hydrate as before.
  motionOptional: "[data-motion-optional]",
};

// Outro state flip. JS sets `data-preloader-state="exit"` on the preloader
// root; the CSS outro (styles/components/hanko.css) settles the hanko off that
// single attribute change.
export const PRELOADER_STATE = {
  attribute: "data-preloader-state",
  exit: "exit",
};

// Set by views/templates/partials/choreography-script.njk before this module
// runs. When false, the director gate resolves immediately.
export const CHOREOGRAPHY_FLAG = "__enableChoreography";

export const PRELOADER_TIMINGS = {
  // Upper bound on how long the hero reveal will wait for webfonts.
  // document.fonts.ready is otherwise UNBOUNDED — a slow/failed Google Font
  // would stall the LCP element indefinitely. All faces use font-display:swap,
  // so on timeout the hero reveals in the fallback face and swaps in place.
  // Lower this to favor LCP over first-paint font fidelity; raise it to favor
  // showing the hero already in its brand face.
  fontsReadyTimeoutMs: 2000,
  // Upper bound on the director:ready wait. Same reasoning as fonts: if the
  // choreography script fails to load, nothing else would ever lift the scroll
  // lock or clear main[aria-busy]. The hero is already visible; a late
  // Director only delays the landing chain.
  directorReadyTimeoutMs: 8000,
  // Fallback for the CSS outro. The hanko settle (`--hanko-settle-duration`,
  // 0.4s in styles/components/hanko.css) ends with `transitionend`; under
  // prefers-reduced-motion the global utility forces `transition: none` so it
  // never fires. Must exceed the settle duration.
  settleFallbackMs: 600,
};
