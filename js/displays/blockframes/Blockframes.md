---
id: frontend.js.displays.blockframes.blockframes
role: "Main controller class and public API for the blockframes system (default export). Fetches and parses an external SVG (`load()` MUST be awaited before any other method; `svgElement` is null until then), then exposes block access over the required `.Blocks` container (`inventory`, `getBlock`), responsive sizing (`makeResponsive` — viewBox + preserveAspectRatio, drops fixed width/height), and delegates the heavy lifting: styling to Painter (`paintAll`, `paintBlock`), DOM cloning/insertion to Builder (`placeBlock`), and GSAP animation to Animator (`animateBlock` → wipe). Owns a shared GSAP timeline; requires GSAP loaded before instantiation."
status: stable
surface: public
scope: frontend
runtime: browser
tags:
  - blockframes
  - displays
  - frontend
  - js
  - runtime
links:
  - "[[system/gsap|system/gsap]]"
  - "[[Builder|Builder]]"
  - "[[Painter|Painter]]"
  - "[[Animator|Animator]]"
backlinks:
  - "[[README.blockframes|README.blockframes]]"
---
