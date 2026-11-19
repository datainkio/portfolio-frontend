import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { HERO_INTRO } from "../../config/ix/presets/hero.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const HERO_EL_ATTR = HERO_SELECTORS.elementAttribute;

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

// The gel is absolute inset-0 inside the fixed inset-0 #sizzle-background
// container, so its left/top/width/height percentages resolve against the
// viewport (which is also why no gel is ever ScrollTrigger-pinned).
// Convert the hero section's own viewport rect to those same percentages so
// the sweep is scoped to hero, not a full-viewport wipe that blankets the
// fixed background video sitting behind it.
const heroRectAsViewportPercent = (view) => {
  const rect = view?.getBoundingClientRect?.();
  if (!rect) return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!vw || !vh) return null;
  return {
    left: `${(rect.left / vw) * 100}%`,
    top: `${(rect.top / vh) * 100}%`,
    width: `${(rect.width / vw) * 100}%`,
    height: `${(rect.height / vh) * 100}%`,
  };
};

export function createSweepIn(view, gelManager) {
  const gel = gelManager?.getGel?.("gel_hero") ?? null;
  const header = selectHeroEl(view, "header");
  const tl = gsap.timeline({ id: TIMELINE_IDS.intro });

  if (gel?.view) {
    tl.addLabel("intro");

    // Reset the gel to fill the hero section's own bounds, then rebuild its
    // mask. This runs as a leading timeline callback (not at build time) so
    // it lands the moment the intro plays and reads hero's current rect, and
    // refreshes the polygon while the gel is at full size (scaleY:1) — never
    // mid-scale, since GelGeometry measures the transformed box.
    tl.call(() => {
      const geometry = heroRectAsViewportPercent(view);
      if (geometry) gsap.set(gel.view, geometry);
      gel.refresh();
    });

    // Grow from the bottom. startAt + immediateRender:false defers the scaleY:0
    // start-state to playback so it cannot stomp the hero arrangement while Hero
    // is off-screen; overwrite:"auto" kills any competing arrangement tween.
    tl.to(
      gel.view,
      {
        startAt: { scaleY: 0, transformOrigin: "bottom center" },
        scaleY: 1,
        transformOrigin: "bottom center",
        duration: HERO_INTRO.duration,
        ease: HERO_INTRO.ease.out,
        overwrite: "auto",
        immediateRender: false,
      },
      ">",
    );
  }

  if (header) {
    tl.addLabel("middle");
    tl.from(
      header,
      {
        autoAlpha: 0,
        y: 40,
        duration: HERO_INTRO.duration,
        ease: HERO_INTRO.ease.out,
      },
      // Overlap the text reveal with the last 20% of the gel wipe
      gel?.view ? `>-=${HERO_INTRO.duration * 0.2}` : 0,
    );
  }

  return tl;
}

export function createSweepOut(view, gelManager) {
  const header = selectHeroEl(view, "header");
  const gel = gelManager?.getGel?.("gel_hero") ?? null;
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  tl.addLabel("outro");
  if (header) {
    tl.to(header, { opacity: 0, duration: HERO_INTRO.duration });
  }
  if (gel?.view) {
    tl.to(gel.view, { scaleY: 0, duration: HERO_INTRO.duration });
  }
  return tl;
}
