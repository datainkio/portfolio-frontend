## Plan: Finish Remaining Performance TODOs

TL;DR: Minify/bundle choreography JS, keep all animation loads deferred, preload the true LCP asset and first hero font via the shared head partial, tighten CSS loading (optional critical inline), and avoid extra request chains. These steps target FCP/LCP on first visit.

### Steps

1. Ensure deferred animation loads: verify long-scroll keeps `defer` on Director and add `defer` to CDN GSAP/ScrollTrigger/Smoother imports in the layout to avoid parser blocking.
2. Bundle/minify choreography JS: add an esbuild/rollup task to emit minified chunks for `/assets/js/choreography/**` and point template/script tags to the bundled output.
3. LCP discovery: pick the LCP (hero poster/image or first frame); add `<link rel="preload" as="image" href="...">` in `njk/templates/partials/head.njk` and remove any lazy attribute on that element.
4. Font preload: add `preconnect` to `fonts.googleapis.com`/`fonts.gstatic.com` and preload the hero’s first-used Alexandria woff2 variant in the head partial.
5. CSS critical path: keep `build:css` in prod; optionally add a critical-CSS inline transform (or preload+onload swap) so above-the-fold hero/bio styles arrive sooner.
6. Request-chain cleanup: avoid duplicate GSAP loads (remove local fallback if still present) and keep background video hydration deferred; ensure no CSS-imported LCP assets—reference them directly in HTML.

### Further Considerations

1. Do you prefer adding critical CSS via an Eleventy transform or a preload+onload swap for `/assets/styles.css`? Option A: inline critical; Option B: preload+swap; Option C: leave as-is.
