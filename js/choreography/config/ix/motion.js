export { resolveSectionMotionProfile } from "./profiles.js";
import { SECTION_OVERRIDES } from "./profiles.js";
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
 * Home Landing Nav Reveal
 *
 * GSAP staggered fade-up of the page-nav items when the home header enters its
 * `menu` role (HomeHeaderManager._showNav). GSAP-only values — the loader-state
 * CSS does not consume these, so naming them here forks nothing.
 *
 * NOTE: `duration` is intentionally absent. It is the seam token
 * `--hanko-enter-duration`, shared with the loader CSS and read at runtime in
 * HomeHeaderManager — defining it here would re-introduce the dual source of
 * truth this work removed.
 */
export const HOME_NAV_REVEAL = {
  distance: motion.distance("lg"), // 24px fade-up start offset
  // Sits between the `tight` (0.05) and `base` (0.1) stagger tokens; kept
  // explicit pending a decision to snap to a token.
  stagger: 0.08,
  ease: "power2.out",
};

/**
 * Home Landing Hero Hold + Transition
 *
 * The home header rests in its `hero` role for `HOME_HERO_HOLD.delay` seconds,
 * then auto-plays the deconstruct -> build transition to the `menu` role. Time
 * is the sole trigger — scroll and tap are inert (see
 * specs/animation/home-header-hero-to-menu-transition.animation-spec.md). Tune
 * the hold here; `?heroHold=<seconds>` overrides at runtime for rebuild-free DX,
 * and reduced motion zeroes it.
 *
 * The transition is transform-only (compositor-safe — never width/layout): the
 * hero panel slides off-stage (`HOME_HERO_OUTRO`) to reveal page content, the
 * role flips to `menu` while the panel is off-screen, then the now-narrow rail
 * slides back in (`HOME_HERO_BUILD`). The nav-item reveal is HOME_NAV_REVEAL.
 */
export const HOME_HERO_HOLD = { delay: 0 }; // seconds

/**
 * Bio Intro Hold
 *
 * The beat between the background video's intro completing and Bio playing its
 * own intro. Bio's reveal is chained to `video:intro:complete` (see
 * LandingSequence), not to the home header — the video finishing is the cue.
 *
 * `gsap.delayedCall` consumes this, so it is in seconds like HOME_HERO_HOLD.
 * Reduced motion zeroes it: the chain still runs, just without the pause.
 */
export const BIO_INTRO_HOLD = { delay: toSeconds(motion.duration("slow")) }; // seconds

/**
 * Bio Heading Gel Entrance
 *
 * The gel band's arrival, played as bio's `landing` phase once the background
 * video's intro has completed and `BIO_INTRO_HOLD.delay` has elapsed. It gates
 * the bio intro: LandingSequence awaits `bio.playLanding()` before calling
 * `bio.playIntro()` (see molecules/bio-motion/heading-gel.js).
 *
 * The band starts fully offscreen — one viewport height below the fold, offset
 * right by `xViewportRatio` of the viewport width — with a slight tilt, then
 * resolves to its synced resting geometry. Short and eased-out: it is an
 * arrival, not a gesture with its own narrative.
 *
 * Both offsets are fractions of the viewport rather than distance tokens: they
 * are measured at play time against `window.innerWidth`/`innerHeight`, so there
 * is no fixed px value to fork.
 */
export const BIO_GEL_ENTRANCE = {
  xViewportRatio: 0.33, // start x offset, as a fraction of viewport width
  yViewportRatio: 1.2, // start y offset below the fold, as a fraction of viewport height
  rotation: -16, // degrees; resolves to 0
  duration: toSeconds(motion.duration("slower")), // seconds; longer than the intro to gate it
  ease: "power2.out",
};

/**
 * Home Header Resize Settle
 *
 * Debounce (seconds) before the home header re-asserts its inline transform for
 * whichever role it is resting in. The brief is "correct when the resize
 * completes", not "correct during every intermediate frame" — a drag-resize
 * fires continuously, and re-asserting per frame would fight the drag.
 */
export const HOME_RESIZE_SETTLE = { delay: 0.15 }; // seconds

export const HOME_HERO_OUTRO = {
  xPercent: -100, // slide the full-bleed hero off to the left
  duration: toSeconds(motion.duration("slow")),
  ease: "power3.inOut",
};

export const HOME_HERO_BUILD = {
  xPercent: 0, // rail returns to its resting left edge
  duration: toSeconds(motion.duration("slow")),
  ease: "power3.out",
};

export const THROW_OUT_ANIMATION = {
  duration: toSeconds(motion.duration("slow")),
  xPercent: -100,
  yPercent: -125,
  rotation: -12,
  transformOrigin: "50% 66%",
};

export const THROW_IN_ANIMATION = {
  duration: toSeconds(motion.duration("slow")),
  xPercent: 100,
  yPercent: 125,
  rotation: 12,
  transformOrigin: "50% 66%",
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

export const HERO_INTRO = {
  yPercent: 100,
};

export const HERO_OUTRO = {
  top: "0%",
  height: "50%",
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

/**
 * Bio Section Animation Defaults
 *
 * Specific overrides for the Bio section animations.
 */
export const BIO_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slower")),
  translateY: -motion.distance("lg"),
  itemTranslateY: -motion.distance("md"),
  itemRevealViewportRatio: 0.5,
  subSectionStartDelay: ANIMATION_DEFAULTS.duration,
  stickySubheadingFadeDuration: ANIMATION_DEFAULTS.duration,
  stickyHeaderCollapseDuration: ANIMATION_DEFAULTS.duration,
  stickySubheadingTopThreshold: 1,
};

export const BIO_INTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("loose"),
  translateY: -motion.distance("lg"),
};

/**
 * Bio Mission Statement — gel-led arrival
 *
 * The mission statement's reveal, cued by its own ScrollTrigger rather than by
 * bio's intro timeline: it sits a full `h-dvh` below the header, so it is
 * off-screen when the intro plays and anything sequenced there would play
 * unseen.
 *
 * Three overlapping beats — the `gel_subheading` band wipes in from the left,
 * the overview <h3> rides in behind its tail, then the body copy staggers up.
 * The band leading is the point: it rhymes with the heading gel's arrival so the
 * two headings read as the same gesture at different scales.
 *
 * `staggerAmount` is a TOTAL, not a per-item delay — the body paragraph count
 * comes from Sanity and is variable, so a per-item `each` would let a long
 * statement drag. GSAP distributes the total across however many there are.
 */
export const BIO_MISSION_REVEAL = {
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
 * Bio Outro — line fade, gel expand
 *
 * Scrub-driven exit, two beats while the section is pinned: H2 lines fade
 * last-to-first, then the heading gel grows from its own vertical center to
 * fill the viewport. `pinRatio` sets the scroll (scrub) distance as a
 * fraction of viewport height; `gelDuration` is timeline seconds for the
 * gel beat.
 */
export const BIO_OUTRO = {
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

/**
 * Awards Section Animation Defaults
 *
 */

export const AWARDS_ANIMATION_DEFAULTS = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slow")),
  stagger: motion.stagger("loose"),
  translateY: -motion.distance("lg"),
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
