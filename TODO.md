# FRONTEND TODO items

## Load Performance

GOAL: Improve Lighthouse performance metrics: FCP < 2s, LCP < 2.5s on Fast 3G simulated. Current perf: 71 (was 61).

### Fix duplicate/early JS costs

DONE: Audit and remove duplicate GSAP imports (ensure only one load, prefer single module/CDN source).
TODO: Confirm all choreography scripts load with defer and no render-blocking legacy scripts remain.
TODO: Enable production minification/treeshaking for /assets/js/choreography/\*\* (verify build config).
DONE: Gate Director/animation initialization behind requestIdleCallback (fallback to setTimeout) to keep FCP/LCP JS-free.

### Improve LCP discovery and load

TODO: Identify LCP element (hero image/video) and add a head <link rel="preload" as="image" href="...">; avoid loading="lazy" on LCP.
TODO: Optimize LCP asset format and dimensions (prefer AVIF/WebP for images; MP4/H.264 for video poster/background).

### Reduce render-blocking CSS

TODO: Inline minimal critical CSS for above-the-fold hero/bio and load remaining CSS via preload + onload swap.
TODO: Ensure Tailwind production CSS is minified (npm run build:css) and purge paths are correct.
TODO: Preload first-used hero font (rel="preload" as="font" type="font/woff2" crossorigin) to avoid late discovery. NOTE: revisit step 4 font preload strategy (preconnect + Alexandria preload in head) after testing.

### Trim network weight and request chains

TODO: Avoid critical request chains (reference hero/LCP asset directly in HTML, not via CSS imports; defer non-critical assets/analytics to idle).
TODO: Gzip/Brotli-enable HTML/CSS/JS responses on prod server/CDN.
TODO: Re-run Lighthouse (mobile throttling) after changes targeting FCP < 2s and LCP < 2.5s; iterate if below 95.
