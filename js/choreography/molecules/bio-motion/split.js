import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { BIO_INTRO } from "../../config/ix/motion.js";
import { BIO_SELECTORS } from "../../config/contracts/selectors/selectors.js";

const BIO_EL_ATTR = BIO_SELECTORS.elementAttribute;

const selectBioEl = (view, name) =>
  view?.querySelector(`[${BIO_EL_ATTR}="${name}"]`) ?? null;

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

  const keywords = ["just", "informed", "compassionate"];
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
  // Reading-order cascade: context, title, subheading and aside overlap into
  // one continuous downward gesture; the keyword ignite punctuates the tail.
  tl.from(context, { duration: 0.5, opacity: 0, y: 100 }, 0);
  tl.from(
    split.chars,
    { duration: 0.5, opacity: 0, y: 100, rotation: 45, stagger: 0.015 },
    "-=0.3",
  );
  tl.to(highlights, { color: tokenColor("secondary-600"), stagger: 0.075 });
  tl.from(subheading, { duration: 0.5, opacity: 0, y: 100 }, "-=0.4");
  tl.from(
    aside?.children ?? [],
    { duration: 0.5, opacity: 0, y: 100, stagger: BIO_INTRO.stagger },
    "-=0.3",
  );
  return tl;
}

// Reset the gel to fill the viewport, then rebuild its mask. The gel is
