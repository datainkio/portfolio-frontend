export const PRELOADER_SELECTORS = {
  root: "[data-preloader]",
  // Last child in during the intro and last child out during the outro
  // (styles/components/hanko.css). Their CSS animations finishing marks the
  // end of each sequence.
  introLast: "[data-preloader-subtitle]",
  outroLast: "[data-preloader-logo]",
  // The home sizzle video. Playback must have begun before the splash exits,
  // so the preloader starts it itself (BackgroundVideo's later play() is a
  // no-op on a playing element).
  backgroundVideo: "#background video",
  main: "main",
  deferredVideos: "video[data-defer-video][data-src]",
  // Opt-in marker for videos whose playback is decorative. Under
  // prefers-reduced-motion these are left unhydrated so their poster stands
  // in. Videos WITHOUT this attribute hydrate as before.
  motionOptional: "[data-motion-optional]",
};

// Outro state flip. JS sets `data-preloader-state="exit"` on the preloader
// root; the CSS outro (styles/components/hanko.css) runs the intro in reverse
// off that single attribute change. The intro and idle states are CSS-auto
// from first paint and need no attribute.
export const PRELOADER_STATE = {
  attribute: "data-preloader-state",
  exit: "exit",
};

// Set by views/templates/partials/choreography-script/choreography-script.njk before this module
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
  // Upper bound on the background video's play() promise. A refused autoplay
  // rejects at once and releases the gate itself; this covers a slow first
  // buffer, so the splash never holds the page on a video that may not start.
  videoPlayingTimeoutMs: 4000,
  // Fallbacks for the CSS intro and outro (styles/components/hanko.css). Each
  // sequence is awaited via its last child's animation `finished` promise,
  // which a paused tab or a mid-flight style change could hold open. Both
  // must exceed the sequence total: step 0.4s + 2 × 0.2s stagger = 0.8s.
  introFallbackMs: 1000,
  outroFallbackMs: 1000,
};
