/**
 * ---
 * aix:
 *   id: frontend.js.preloader
 *   role: Frontend runtime module: js/preloader.js
 *   status: stable
 *   surface: public
 *   scope: frontend
 *   runtime: browser
 *   tags:
 *     - frontend
 *     - js
 *     - runtime
 *     - preloader.js
 * ---
 */
const LOGS = {
  description:
    "\nA good preloader reduces the *perceived* time from when a given page is requested to when the initial content is visually rendered. The particular strategy used here splits up the load sequence into three stages.\nFirst, it uses runtime-generated visuals to minimize the size of the initial payload of HTML and JS required for first paint. It then loads the remaining assets while providing visual feedback on progress. The final stage is triggered once two events have occurred: the main choreography file (a.k.a. AnimationDirector) announces it has completed initialization, and BackgroundVideo announces that it is ready for playback. At this point the preloader initiates its outro animation and, on completion, removes itself from the DOM.\nTechnical note: Choreography depends on GSAP for runtime behavior, but preloader visibility can start without GSAP.",
  methods: "",
  color: "color: #5e99d9",
};
const trace = (message) => console.log("%c[Preloader] " + message, LOGS.color);
trace(LOGS.description);
const preloader = document.querySelector("[data-preloader]");
if (preloader) {
  trace("DOM element found, initializing...");
  const stack = preloader.querySelector("[data-preloader-stack]");
  const textEl = preloader.querySelector("[data-preloader-text]");
  const main = document.querySelector("main");
  const prefersReduce = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const SCROLL_SMOOTHER_STORAGE_KEY = "scrollSmoother";
  trace("Does the user prefer reduced motion? " + prefersReduce);
  const restoreState = (() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      scrollY: window.scrollY,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      window.scrollTo({
        top: prev.scrollY,
        left: 0,
        behavior: "instant" in window ? "instant" : "auto",
      });
    };
  })();

  const normalizeBooleanFlag = (value) => {
    if (typeof value !== "string") return false;
    const normalized = value.trim().toLowerCase();
    return (
      normalized === "on" ||
      normalized === "true" ||
      normalized === "1" ||
      normalized === "enabled"
    );
  };

  const readScrollSmootherPreference = (el) => {
    const fromDataset = el && el.dataset ? el.dataset.scrollSmoother : null;
    const fromQuery = (() => {
      try {
        return new URLSearchParams(window.location.search).get(
          "scrollSmoother",
        );
      } catch (_) {
        return null;
      }
    })();
    const fromStorage = (() => {
      try {
        return window.localStorage.getItem(SCROLL_SMOOTHER_STORAGE_KEY);
      } catch (_) {
        return null;
      }
    })();
    return normalizeBooleanFlag(fromQuery ?? fromStorage ?? fromDataset);
  };

  const persistScrollSmootherPreference = (value) => {
    try {
      window.localStorage.setItem(
        SCROLL_SMOOTHER_STORAGE_KEY,
        value ? "on" : "off",
      );
    } catch (_) {
      /* no-op */
    }
  };

  const exposeScrollSmootherDXHooks = (enabled) => {
    if (typeof window === "undefined") return;
    window.__scrollSmoother = {
      enable() {
        persistScrollSmootherPreference(true);
        console.info("ScrollSmoother enabled. Reload to apply.");
      },
      disable() {
        persistScrollSmootherPreference(false);
        console.info("ScrollSmoother disabled. Reload to apply.");
      },
      clear() {
        try {
          window.localStorage.removeItem(SCROLL_SMOOTHER_STORAGE_KEY);
        } catch (_) {
          /* no-op */
        }
      },
      status: () => enabled,
    };
  };

  const scrollSmootherEnabled = readScrollSmootherPreference(preloader);
  exposeScrollSmootherDXHooks(scrollSmootherEnabled);

  const updateFiletypeMessage = (() => {
    let rafId = null;
    let nextLabel = null;
    return (ext) => {
      if (!textEl || !ext) return;
      nextLabel = `Loading ${ext.toUpperCase()}…`;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        textEl.textContent = nextLabel;
        rafId = null;
      });
    };
  })();

  const startResourceObserver = () => {
    trace(
      "Preparing resource observer for displaying filetype-specific loading messages",
    );
    if (
      !("PerformanceObserver" in window) ||
      !("getEntriesByType" in performance)
    )
      return () => {};
    const seen = new Set();
    const processEntries = (entries) => {
      for (const entry of entries) {
        const url = entry.name;
        if (!url || seen.has(url)) continue;
        seen.add(url);
        const ext = extractExt(url);
        if (ext) updateFiletypeMessage(ext);
      }
    };
    // Process already buffered entries
    processEntries(performance.getEntriesByType("resource"));

    const observer = new PerformanceObserver((list) =>
      processEntries(list.getEntries()),
    );
    try {
      observer.observe({ type: "resource", buffered: true });
    } catch (_) {
      try {
        observer.observe({ entryTypes: ["resource"] });
      } catch (_) {
        return () => {};
      }
    }
    return () => observer.disconnect();
  };

  const extractExt = (url) => {
    try {
      const path = new URL(url, window.location.href).pathname;
      const part = path.split(".").pop();
      if (!part || part.includes("/")) return null;
      return part.toLowerCase();
    } catch (_) {
      return null;
    }
  };

  const stopObserver = startResourceObserver();
  const choreographyEnabled =
    typeof window.__enableChoreography === "boolean"
      ? window.__enableChoreography
      : true;

  const animateIntro = () => {
    trace("Intro animation started");
    if (!stack) return;
    if (typeof window.gsap !== "undefined") {
      const tl = window.gsap.timeline({
        defaults: { duration: 0.35, ease: "power2.out" },
      });
      tl.fromTo(
        stack,
        { autoAlpha: 0, y: 12, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1 },
      );
      return tl;
    }
    if (prefersReduce) {
      stack.style.opacity = "1";
      stack.style.transform = "translateY(0)";
      return;
    }
    stack.animate(
      [
        { opacity: 0, transform: "translateY(12px) scale(0.985)" },
        { opacity: 1, transform: "translateY(0px) scale(1)" },
      ],
      {
        duration: 320,
        easing: "cubic-bezier(0.22,0.61,0.36,1)",
        fill: "forwards",
      },
    );
  };

  const animateExit = () =>
    new Promise((resolve) => {
      trace("Exit animation started");
      const finish = () => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("preloader:out"));
        }
        resolve();
      };
      if (typeof window.gsap !== "undefined") {
        window.gsap
          .timeline({ defaults: { duration: 1, ease: "power2.inOut" } })
          .to(stack, { autoAlpha: 0.9, y: -6 }, 0)
          .to(preloader, { autoAlpha: 0 }, 0)
          .add(finish);
        return;
      }
      if (prefersReduce) {
        trace("User prefers reduced motion, skipping exit animation");
        preloader.style.transition = "opacity 500ms ease";
        preloader.style.opacity = "0";
        preloader.addEventListener("transitionend", finish, { once: true });
        setTimeout(finish, 220);
        return;
      }
      preloader
        .animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-8px)" },
          ],
          {
            duration: 500,
            easing: "cubic-bezier(0.4,0.0,0.2,1)",
            fill: "forwards",
          },
        )
        .addEventListener("finish", finish);
    });

  const fontsReady =
    "fonts" in document ? document.fonts.ready : Promise.resolve();
  const domReady =
    document.readyState !== "loading"
      ? Promise.resolve()
      : new Promise((res) =>
          document.addEventListener("DOMContentLoaded", res, { once: true }),
        );
  const timeout = new Promise((res) => setTimeout(res, 1800));

  const hydrateDeferredVideos = () => {
    const videos = document.querySelectorAll(
      "video[data-defer-video][data-src]",
    );
    videos.forEach((video) => {
      if (video.src) return;
      const src = video.getAttribute("data-src");
      if (!src) return;
      try {
        video.setAttribute("preload", "metadata");
        video.src = src;
        video.removeAttribute("data-src");
        video.removeAttribute("data-defer-video");
        // Do not call load() to avoid interrupting autoplay/play promises.
      } catch (err) {
        console.warn("[Preloader]", "Deferred video hydrate failed", err);
      }
    });
  };

  // Wait for Director to complete initialization before exiting preloader
  // Handles both cases: Director already initialized or event dispatched later
  const directorReady = new Promise((resolve) => {
    if (!choreographyEnabled) {
      trace("Choreography disabled, skipping director wait");
      resolve();
      return;
    }

    if (window.director) {
      resolve();
      return;
    }

    window.addEventListener(
      "director:ready",
      () => {
        resolve();
      },
      { once: true },
    );
  });

  const waitForDirector = () => directorReady;

  const ready = async () => {
    trace(
      "Initialization complete. Start the animated loading view and wait for resources and director...",
    );
    animateIntro();
    trace("Loading fonts, DOM, timeout, and director...");
    await fontsReady;
    trace("Fonts ready");
    await Promise.race([domReady, timeout]);
    trace("DOM ready (or timeout reached)");
    await waitForDirector(); // wait for Director init to finish
    trace("Director is ready. Starting preloader exit sequence.");
    await animateExit(); // re-enable exit animation
    trace("Preloader exit animation complete. Cleaning up.");
    stopObserver();
    trace("Resource observer stopped.");
    preloader.remove();
    trace("Preloader element removed from DOM.");
    restoreState();
    trace("Scroll position restored.");
    if (main) main.setAttribute("aria-busy", "false");
    trace("Main content marked as ready.");
    hydrateDeferredVideos();
    trace("Deferred videos hydrated.");
    if (scrollSmootherEnabled) {
      trace("ScrollSmoother preference enabled. Initializing ScrollSmoother.");
      initializeScrollSmoother(preloader.dataset.gsapSrc);
    } else {
      trace(
        "ScrollSmoother preference disabled. Skipping ScrollSmoother initialization.",
      );
    }
  };

  const initializeScrollSmoother = async (src) => {
    const hasGSAP = typeof window.gsap !== "undefined";
    const hasSmoother = typeof window.ScrollSmoother !== "undefined";
    if (hasGSAP && hasSmoother) {
      window.gsap.registerPlugin(window.ScrollSmoother);
      window.ScrollSmoother.create({ smooth: 1, effects: true });
      return;
    }
    if (!src) return; // optional deferred load
    await loadGSAPScript(src);
    if (
      typeof window.gsap !== "undefined" &&
      typeof window.ScrollSmoother !== "undefined"
    ) {
      window.gsap.registerPlugin(window.ScrollSmoother);
      window.ScrollSmoother.create({ smooth: 1, effects: true });
    }
  };

  const loadGSAPScript = (src) => {
    trace("Loading GSAP script from " + src);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  };

  ready();
} else {
  console.warn(
    "[Preloader]",
    "No preloader element found. Skipping initialization.",
  );
}
