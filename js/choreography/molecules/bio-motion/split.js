import {
  gsap,
  SplitText,
  ScrollTrigger,
} from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO } from "../../config/ix/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

// The section's only direct-child <p> is the body copy — the header's <p>s are
// nested inside <header>. It's injected via `{{ body | safe }}` and carries no
// data-bio-el hook, so this couples to structure rather than a CSS class.
const selectBioBody = (view) => view?.querySelector(":scope > p") ?? null;

// Stable id so rebuilds (matchMedia / resize re-invoke the variant) can kill the
// prior instance instead of stacking duplicate triggers.
const ASIDE_REVEAL_ST_ID = "bio-aside-reveal";

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
  const subheading = selectBioEl(view, "subheading");
  const aside = selectBioEl(view, "aside");

  const tl = gsap.timeline({
    id: TIMELINE_IDS.landing,
    duration: BIO_INTRO.duration,
  });
  const split = new SplitText(title, {
    type: "lines,words,chars",
    mask: "chars",
  });

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
  // Reading-order cascade: context, title, and subheading overlap into one
  // continuous downward gesture; the keyword ignite punctuates the tail. The
  // aside + body copy are split out into their own scroll-triggered reveal
  // (buildAsideReveal) so they animate on entry rather than up-front.
  tl.from(context, { duration: 0.5, opacity: 0, y: 100 }, 0);
  tl.from(
    split.chars,
    { duration: 0.25, opacity: 0, y: 100, rotation: 45, stagger: 0.05 },
    "-=0.3",
  );
  tl.to(highlights, { color: tokenColor("secondary-600"), stagger: 1 });
  tl.from(
    subheading,
    { duration: 0.25, opacity: 0, y: 100, delay: 1.25 },
    "-=0.3",
  );

  buildAsideReveal(view, aside);

  return tl;
}

/**
 * Scroll-triggered reveal for the body copy + aside, separate from the intro
 * timeline (which plays up-front off the header). Fires once when the body <p>
 * enters the viewport — no scrub, no pin — with the same fade+lift the header
 * elements use. Reduced motion is handled upstream by the profile system
 * swapping to the `reduced` variant, so no reduced branch belongs here.
 *
 * @param {HTMLElement|null} view  Section root.
 * @param {HTMLElement|null} aside Resolved [data-bio-el="aside"] element.
 * @returns {gsap.core.Tween|null}
 */
function buildAsideReveal(view, aside) {
  const body = selectBioBody(view);
  const targets = [body, ...(aside?.children ?? [])].filter(Boolean);
  if (!targets.length) return null;

  // Idempotent across rebuilds: kill the prior trigger before creating a fresh
  // one so matchMedia/resize re-invocations don't stack duplicates.
  ScrollTrigger.getById(ASIDE_REVEAL_ST_ID)?.kill();

  return gsap.from(targets, {
    opacity: 0,
    y: 100,
    duration: 0.5,
    stagger: BIO_INTRO.stagger,
    scrollTrigger: {
      id: ASIDE_REVEAL_ST_ID,
      trigger: body ?? aside,
      start: "top 80%",
      once: true,
    },
  });
}

// Reset the gel to fill the viewport, then rebuild its mask. The gel is
