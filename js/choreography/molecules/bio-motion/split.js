import {
  gsap,
  SplitText,
  ScrollTrigger,
} from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO, BIO_OUTRO, motion } from "../../config/ix/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { attachHeadingGel, getHeadingGelEl } from "./heading-gel.js";
import { attachOverviewGel } from "./overview-gel.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

// Rebuilds re-run `intro()` on the same DOM (matchMedia / resize). Without
// caching + reverting the prior split, `new SplitText` on already-split markup
// nests garbage and `buildOutro` targets the wrong elements.
const headingSplits = new WeakMap();

function buildHeadingSplit(view, title) {
  headingSplits.get(view)?.revert();
  const split = new SplitText(title, {
    type: "lines,words,chars",
    mask: "chars",
  });
  headingSplits.set(view, split);
  return split;
}

// Resolve a design-system color token (e.g. "secondary-600") to its hex value
// by reading the live CSS custom property. Keeps motion in sync with the tokens
// in styles/colors.css instead of hardcoding a hex.
const tokenColor = (name) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${name}`)
    .trim();

export function intro(view, gelManager) {
  const title = selectBioEl(view, "heading");
  const context = selectBioEl(view, "context");
  const aside = selectBioEl(view, "aside");

  const tl = gsap.timeline({
    id: TIMELINE_IDS.landing,
    duration: BIO_INTRO.duration,
  });
  const split = buildHeadingSplit(view, title);

  const keywords = ["just", "informed", "engaged"];
  const highlights = [];

  // Strip punctuation + case so "just" matches the rendered "just," etc.
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  const isolateCore = (word) => {
    const [, lead = "", core = "", trail = ""] =
      word.innerText.match(/^(\W*)(.*?)(\W*)$/) ?? [];
    if (!core) return word;
    return word;
  };

  // Multi-word keywords tokenize (type:"words" yields single-word elements),
  // so each token is matched independently and its letter-core collected.
  keywords.forEach((keyword) => {
    normalize(keyword)
      .split(/\s+/)
      .forEach((token) => {
        split.words.forEach((word) => {
          if (normalize(word.innerText) === token)
            highlights.push(isolateCore(word));
        });
      });
  });
  // Reading-order cascade: context and title overlap into one continuous
  // downward gesture; the keyword ignite punctuates the tail. The overview
  // heading now lives outside <header> and is not part of this cascade. The
  // aside + body copy are split out into their own scroll-triggered reveal
  // (buildAsideReveal) so they animate on entry rather than up-front.
  tl.from(
    context,
    { duration: motion.duration("base") / 1000, opacity: 0, y: 100 },
    0,
  );
  tl.from(
    split.chars,
    {
      duration: motion.duration("fast") / 1000,
      opacity: 0,
      y: 100,
      rotation: 45,
      stagger: motion.stagger("tight"),
    },
    "-=0.3",
  );
  tl.to(highlights, {
    color: tokenColor("secondary-600"),
    stagger: motion.duration("md") / 1000,
  });

  // Full-bleed gel bands behind the <h2> and overview <h3>. Positioned outside
  // the timeline: they are standing background states, not phases of the reveal.
  attachHeadingGel(view, gelManager);
  attachOverviewGel(view, gelManager);

  return tl;
}

/**
 * Bio outro: four scrub-driven beats while the section is pinned.
 * 1. H2's SplitText lines fade to opacity 0, last line first.
 * 2. The heading gel grows from its own vertical center to fill the viewport.
 * 3. The mission statement travels up to rest vertically centered.
 * 4. The aside travels to rest vertically centered, fading its children in.
 *
 * BioTriggers hands this timeline to a dedicated pin trigger, so playback
 * progress is owned by scroll position, not this function. Positional values
 * are function-based so `invalidateOnRefresh` re-measures them on resize.
 *
 * Returns an empty, id-tagged timeline (no children) when the heading hasn't
 * been split yet (intro not built for this view) — BioTriggers reads that as
 * "no motion" and skips creating the pin.
 *
 * @param {HTMLElement|null} view
 * @param {object|null} gelManager GelAnimationManager instance.
 * @returns {gsap.core.Timeline}
 */
export function outro(view, gelManager) {
  const tl = gsap.timeline({ id: TIMELINE_IDS.outro });
  const split = headingSplits.get(view);
  if (!split?.lines?.length) return tl;

  const mission = selectBioEl(view, "mission-statement");
  const aside = selectBioEl(view, "aside");
  const gelEl = getHeadingGelEl(gelManager);
  const travellers = [mission, aside].filter(Boolean);

  tl.addLabel("outro");

  // 1. line fade, last line first
  tl.to(split.lines, {
    opacity: 0,
    duration: BIO_OUTRO.duration,
    ease: BIO_OUTRO.ease.out,
    stagger: { each: BIO_OUTRO.stagger, from: "end" },
  });
  tl.addLabel("lines-out");

  // 2. gel grows from its own vertical center to fill the viewport.
  // transformOrigin is already "center center" from attachHeadingGel's sync.
  if (gelEl) {
    tl.to(gelEl, {
      scaleY: () => {
        const currentScaleY = gsap.getProperty(gelEl, "scaleY") || 1;
        const unscaledHeight =
          gelEl.getBoundingClientRect().height / currentScaleY;
        return window.innerHeight / unscaledHeight;
      },
      duration: BIO_OUTRO.gelDuration,
      ease: BIO_OUTRO.ease.inOut,
    });
  }
  tl.addLabel("gel-open");

  // 3. mission statement travels up to fill the viewport. It is `h-dvh
  //    content-center` (bio.njk) and sits exactly one viewport below the
  //    `h-dvh` header, so -100vh lands its box on the viewport with its
  //    content vertically centered by its own layout.
  if (mission) {
    tl.to(travellers, {
      y: () => -window.innerHeight,
      duration: BIO_OUTRO.travelDuration,
      ease: BIO_OUTRO.ease.inOut,
    });
  }
  tl.addLabel("mission-centered");

  // 4. aside travels the rest of the way to its own vertical center, fading
  //    its children in as it settles.
  if (aside) {
    tl.to(
      travellers,
      {
        y: () => {
          const rect = aside.getBoundingClientRect();
          const current = gsap.getProperty(aside, "y") || 0;
          return current - (rect.top - (window.innerHeight - rect.height) / 2);
        },
        duration: BIO_OUTRO.travelDuration,
        ease: BIO_OUTRO.ease.inOut,
      },
      "<",
    );
    tl.from(
      aside.children,
      { opacity: 0, y: 100, stagger: BIO_OUTRO.stagger },
      "<",
    );
  }
  tl.addLabel("aside-centered");

  return tl;
}
