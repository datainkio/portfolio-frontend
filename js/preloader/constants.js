/**
 * ---
 * aix:
 *   id: frontend.js.preloader.constants
 *   role: Frontend runtime module: js/preloader/constants.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader
 *     - constants
 * ---
 */

export const PRELOADER_SELECTORS = {
  root: "[data-preloader]",
  stack: "[data-preloader-stack]",
  text: "[data-preloader-text]",
  main: "main",
  deferredVideos: "video[data-defer-video][data-src]",
};

export const PRELOADER_ATTRIBUTES = {
  ariaBusy: "aria-busy",
  ariaBusyReady: "false",
  dataSrc: "data-src",
  dataDeferVideo: "data-defer-video",
  preload: "preload",
  preloadMetadata: "metadata",
};

export const PRELOADER_STYLE_VALUES = {
  hiddenOverflow: "hidden",
  scrollBehaviorInstant: "instant",
  scrollBehaviorAuto: "auto",
  opacityVisible: "1",
  opacityHidden: "0",
};

export const PRELOADER_MEDIA_QUERIES = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
};

export const PRELOADER_GLOBAL_FLAGS = {
  enableChoreography: "__enableChoreography",
};

export const SCROLL_SMOOTHER_STORAGE_KEY = "scrollSmoother";

export const SCROLL_SMOOTHER_QUERY_PARAM = "scrollSmoother";

export const SCROLL_SMOOTHER_STORAGE_VALUES = {
  enabled: "on",
  disabled: "off",
};

export const SCROLL_SMOOTHER_TRUE_VALUES = ["on", "true", "1", "enabled"];

export const SCROLL_SMOOTHER_SETTINGS = {
  smooth: 1,
  effects: true,
};

export const SCROLL_SMOOTHER_DX_MESSAGES = {
  enabled: "ScrollSmoother enabled. Reload to apply.",
  disabled: "ScrollSmoother disabled. Reload to apply.",
};

export const PRELOADER_TIMINGS = {
  domReadyTimeoutMs: 1800,
  reducedMotionFallbackMs: 520,
  introFallbackDurationMs: 320,
  exitFallbackDurationMs: 500,
  gsapIntroDuration: 0.35,
  gsapExitDuration: 1,
};

export const PRELOADER_ANIMATION = {
  gsapIntroEase: "power2.out",
  gsapExitEase: "power2.inOut",
  introFrom: { autoAlpha: 0, y: 12, scale: 0.985 },
  introTo: { autoAlpha: 1, y: 0, scale: 1 },
  introFallbackFrom: {
    opacity: 0,
    transform: "translateY(12px) scale(0.985)",
  },
  introFallbackTo: {
    opacity: 1,
    transform: "translateY(0px) scale(1)",
  },
  reducedMotionIntroTransform: "translateY(0)",
  reducedMotionExitTransition: "opacity 500ms ease",
  exitFallbackFrom: { opacity: 1, transform: "translateY(0)" },
  exitFallbackTo: { opacity: 0, transform: "translateY(-8px)" },
  introFallbackEasing: "cubic-bezier(0.22,0.61,0.36,1)",
  exitFallbackEasing: "cubic-bezier(0.4,0.0,0.2,1)",
  fillModeForwards: "forwards",
  stackExitTo: { autoAlpha: 0.9, y: -6 },
};

export const PRELOADER_ASSET = {
  consoleImageEnabled: false,
  consoleImageUrl: "/assets/images/console-test.jpg",
  consoleImageScale: 0.2,
  consoleImageWidth: 768,
  consoleImageHeight: 94,
};

export const PRELOADER_LOGGER = {
  prefix: "[Preloader]",
  color: "color: #5e99d9",
  styleToken: "%c ",
  fallbackScale: 1,
  fallbackWidth: 768,
  fallbackHeight: 94,
  description:
    "\nA good preloader reduces the *perceived* time from when a given page is requested to when the initial content is visually rendered. The particular strategy used here splits up the load sequence into three stages.\nFirst, it uses runtime-generated visuals to minimize the size of the initial payload of HTML and JS required for first paint. It then loads the remaining assets while providing visual feedback on progress. The final stage is triggered once two events have occurred: the main choreography file (a.k.a. AnimationDirector) announces it has completed initialization, and BackgroundVideo announces that it is ready for playback. At this point the preloader initiates its outro animation and, on completion, removes itself from the DOM.\nTechnical note: Choreography depends on GSAP for runtime behavior, but preloader visibility can start without GSAP.",
  consoleImageLoadFailedMessage: "Console image could not be rendered",
  consoleImageStyle: {
    fontSize: "font-size: 1px",
    lineHeight: "line-height: 1",
    backgroundRepeat: "background-repeat: no-repeat",
    backgroundPosition: "background-position: center center",
    colorTransparent: "color: transparent",
    minHorizontalPaddingPx: 24,
    minVerticalPaddingPx: 12,
    minDimensionPx: 1,
    declarationSeparator: ";",
  },
  image: {
    decoding: "async",
    referrerPolicy: "no-referrer",
  },
};

export const PRELOADER_READINESS = {
  fontsKey: "fonts",
  documentLoadingState: "loading",
  domContentLoadedEvent: "DOMContentLoaded",
};

export const PRELOADER_RESOURCE_OBSERVER = {
  loadingLabelTemplate: "Loading {EXT}...",
  extensionSeparator: ".",
  invalidExtensionMarker: "/",
  performanceObserverApi: "PerformanceObserver",
  getEntriesByTypeApi: "getEntriesByType",
  resourceEntryType: "resource",
  bufferedObserveOptions: { type: "resource", buffered: true },
  fallbackObserveOptions: { entryTypes: ["resource"] },
};

export const PRELOADER_ANIMATION_MESSAGES = {
  introStarted: "Intro animation started",
  exitStarted: "Exit animation started",
  reducedMotionExit: "User prefers reduced motion, using reduced-motion exit",
};

export const PRELOADER_CONTROLLER_MESSAGES = {
  resourceObserverStopped: "Resource observer stopped.",
  resourceObserverCleanupFailed: "Resource observer cleanup failed",
  preloaderElementRemoved: "Preloader element removed from DOM.",
  preloaderElementCleanupFailed: "Preloader element cleanup failed",
  scrollPositionRestored: "Scroll position restored.",
  scrollStateRestorationFailed: "Scroll state restoration failed",
  mainContentReady: "Main content marked as ready.",
  deferredVideosHydrated: "Deferred videos hydrated.",
  noPreloaderElement: "No preloader element found. Skipping initialization.",
  domFound: "DOM element found, initializing...",
  reducedMotionPreferencePrefix: "Does the user prefer reduced motion? ",
  initializationComplete:
    "Initialization complete. Start the animated loading view and wait for resources and director...",
  loadingReadiness: "Loading fonts, DOM, timeout, and director...",
  directorReady: "Director is ready. Starting preloader exit sequence.",
  exitComplete: "Preloader exit animation complete. Cleaning up.",
  flowFailed: "Preloader flow failed. Proceeding with safe cleanup.",
  scrollSmootherInitializationFailed: "ScrollSmoother initialization failed",
};

export const PRELOADER_READINESS_MESSAGES = {
  choreographyDisabled: "Choreography disabled, skipping director wait",
  fontsReady: "Fonts ready",
  domReadyOrTimeout: "DOM ready (or timeout reached)",
};

export const PRELOADER_RESOURCE_MESSAGES = {
  preparing:
    "Preparing resource observer for displaying filetype-specific loading messages",
};

export const PRELOADER_DEFERRED_VIDEO_MESSAGES = {
  hydrateFailed: "Deferred video hydrate failed",
};

export const PRELOADER_SCROLL_SMOOTHER_MESSAGES = {
  loadingScriptPrefix: "Loading GSAP script from ",
  disabled:
    "ScrollSmoother preference disabled. Skipping ScrollSmoother initialization.",
  delegated:
    "ScrollSmoother preference enabled. Delegating to AnimationDirector stage.",
  standalone:
    "ScrollSmoother preference enabled. Using standalone ScrollSmoother initialization.",
};
