export { motionTokens } from "../../tokens/motion/motion.js";
import { motionTokens } from "../../tokens/motion/motion.js";
const toSeconds = (value) => (typeof value === "number" ? value / 1000 : value);

export const motion = {
  duration(name = "base") {
    return motionTokens.duration[name] ?? motionTokens.duration.base;
  },
  ease(name = "standard") {
    return motionTokens.ease[name] ?? motionTokens.ease.standard;
  },
  distance(name = "md") {
    return motionTokens.distance[name] ?? motionTokens.distance.md;
  },
  stagger(name = "base") {
    return motionTokens.stagger[name] ?? motionTokens.stagger.base;
  },
};

/**
 * Animation Default Settings
 *
 * Base timing and easing values used across all sections.
 */
export const ANIMATION_DEFAULTS = {
  duration: toSeconds(motion.duration("base")),
  stagger: motion.stagger("base"),
  ease: {
    in: motion.ease("enter"),
    out: motion.ease("exit"),
    inOut: motion.ease("standard"),
  },
  // translateY: -motion.distance("md"),
  // translateX: -motion.distance("md"),
  overwrite: "auto",
};

/**
 * Hero Intro Hold
 *
 * The beat between the background video's intro completing and Hero playing its
 * own intro. Hero's reveal is chained to `video:intro:complete` (see
 * LandingSequence), not to the home header — the video finishing is the cue.
 *
 * `gsap.delayedCall` consumes this, so it is in seconds.
 * Reduced motion zeroes it: the chain still runs, just without the pause.
 */
export const HERO_INTRO_HOLD = { delay: toSeconds(motion.duration("slow")) }; // seconds

/**
 * Card Parallax Animation (lg+ breakpoints)
 *
 * Body moves upward relative to figure as card scrolls through viewport.
 * Figure remains at default speed (yPercent: 0), body drifts up by this offset.
 */
export const CARD_PARALLAX = {
  bodyYPercent: -600, // subtle upward drift
  bodyYOrigin: 300, // start body offset below the fold
};

/**
 * Hero Section Animation Defaults
 *
 * Specific overrides for the Hero section animations.
 */
export const HERO_LANDING = {
  from: {
    autoAlpha: 0,
    yPercent: 1,
  },
  to: {
    autoAlpha: 1,
    yPercent: 0,
    stagger: motionTokens.stagger.base,
  },
};

/**
 * BACKGROUND Section Animation Defaults
 *
 * Specific overrides for the BACKGROUND section animations.
 */
export const BACKGROUND_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  // translateY: -motion.distance("lg"),
};

export const HERO_INTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("loose"),
  translateY: -motion.distance("lg"),
};

/**
 * Hero Mission Statement — gel-led arrival
 *
 * The mission statement's reveal, cued by its own ScrollTrigger rather than by
 * hero's intro timeline: it sits a full `h-dvh` below the header, so it is
 * off-screen when the intro plays and anything sequenced there would play
 * unseen.
 *
 * Three overlapping beats — the `gel_subheading` band wipes in from the left,
 * the overview <h2> rides in behind its tail, then the body copy staggers up.
 * The band leading is the point: it rhymes with the heading gel's arrival so the
 * two headings read as the same gesture at different scales.
 *
 * `staggerAmount` is a TOTAL, not a per-item delay — the body paragraph count
 * comes from Sanity and is variable, so a per-item `each` would let a long
 * statement drag. GSAP distributes the total across however many there are.
 */
export const HERO_MISSION_REVEAL = {
  gelDuration: toSeconds(motion.duration("slow")),
  duration: toSeconds(motion.duration("base")),
  distance: motion.distance("lg"),
  staggerAmount: motion.stagger("loose") * 2, // total spread across all paragraphs
  ease: "power2.out",
  // Fraction of the gel wipe the text overlaps into, so the beats read as one
  // gesture rather than three queued ones. Mirrors sweep.js's 0.2 overlap.
  overlap: 0.2,
  // ScrollTrigger start: fire while the section is comfortably in view, not at
  // the very edge — the reveal should land before the reader arrives at it.
  start: "top 70%",
};

/**
 * Hero Outro — line fade, gel expand
 *
 * Scrub-driven exit, two beats while the section is pinned: H1 lines fade
 * last-to-first, then the heading gel grows from its own vertical center to
 * fill the viewport. `pinRatio` sets the scroll (scrub) distance as a
 * fraction of viewport height; `gelDuration` is timeline seconds for the
 * gel beat.
 */
export const HERO_OUTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("fast")),
  stagger: motion.stagger("tight"),
  pinRatio: 1, //2.5,
  gelDuration: toSeconds(motion.duration("slow")),
};

/**
 * Organizations Section Animation Defaults
 *
 * Includes per-item reveal behavior tuned for viewport-threshold entry.
 */
export const ORGANIZATIONS_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("loose"),
  translateY: -motion.distance("md"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5,
  ease: {
    in: motion.ease("exit"),
    out: motion.ease("enter"),
  },
};

/**
 * Work Section Animation Defaults
 *
 * Includes per-item reveal behavior tuned for viewport-threshold entry.
 */
export const WORK_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("base"),
  translateY: -motion.distance("md"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5,
  ease: {
    in: motion.ease("exit"),
    out: motion.ease("enter"),
  },
};

export const AWARDS_INTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slower")),
  // Gel sheets get their own knob so they can be paced independently of the
  // content. Under the scrubbed AWARDS_TRIGGER, what matters is the *ratio* of
  // gelDuration to duration (relative share of the scroll range), not seconds.
  gelDuration: toSeconds(motion.duration("slower")),
};

/**
 * Project Header Section Animation Defaults
 */
export const PROJECT_HEADER_ANIMATION = {
  yPercent: -15,
  ease: "none",
  scrollTrigger: {
    start: "top top",
    end: "bottom top",
    scrub: true,
    invalidateOnRefresh: true,
  },
};
