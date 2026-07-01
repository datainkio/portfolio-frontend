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
  const split = new SplitText(title, { type: "words" });
  const tl = gsap.timeline({ id: TIMELINE_IDS.landing });

  const keywords = ["more just", "informed", "compassionate world"];
  const highlights = [];

  // Strip punctuation + case so "just" matches the rendered "just," etc.
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

  // Wrap the word's letter-core in a span (leaving any leading/trailing
  // punctuation outside it) and return that span, so only letters get styled.
  const isolateCore = (word) => {
    const [, lead = "", core = "", trail = ""] =
      word.innerText.match(/^(\W*)(.*?)(\W*)$/) ?? [];
    if (!core) return word;
    word.innerHTML = `${lead}<span data-bio-highlight>${core}</span>${trail}`;
    return word.querySelector("[data-bio-highlight]");
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

  tl.addLabel("landing");
  tl.to(
    highlights,
    { color: tokenColor("secondary-600"), stagger: 0.05 },
    "landing",
  );
  return tl;
}

// Reset the gel to fill the viewport, then rebuild its mask. The gel is
