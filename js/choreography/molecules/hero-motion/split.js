import { gsap, SplitText } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { motion } from "../../config/ix/motion.js";
import { HERO_INTRO, HERO_OUTRO } from "../../config/ix/presets/hero.js";
import { HERO_SELECTORS } from "../../config/contracts/selectors/selectors.js";
import { attachHeadingGel, getHeadingGelEl } from "./heading-gel.js";

const HERO_EL_ATTR = HERO_SELECTORS.elementAttribute;

const selectHeroEl = (view, name) =>
  view?.querySelector(`[${HERO_EL_ATTR}="${name}"]`) ?? null;

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
  const title = selectHeroEl(view, HERO_SELECTORS.title);
  const context = selectHeroEl(view, HERO_SELECTORS.context);

  const tl = gsap.timeline({
    id: TIMELINE_IDS.intro,
    duration: HERO_INTRO.duration,
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

  // Multi-word keywords tokenize (type:"words" yields single-word elements),
  // so each token is matched independently. The whole word element is
  // highlighted — `normalize` only strips punctuation for the *match*, not
  // from the colored target.
  keywords.forEach((keyword) => {
    normalize(keyword)
      .split(/\s+/)
      .forEach((token) => {
        split.words.forEach((word) => {
          if (normalize(word.innerText) === token) highlights.push(word);
        });
      });
  });
  // Reading-order cascade: context and title overlap into one continuous
  // downward gesture; the keyword ignite punctuates the tail. The overview
  // heading now lives outside <header> and is not part of this cascade. The
  // aside + body copy are not animated here at all.
  tl.from(
    context,
    { duration: motion.duration("base") / 1000, opacity: 0, y: 100 },
    0,
  );
  const charDuration = motion.duration("instant") / 1000;
  const charStagger = motion.stagger("tight") * 0.5;

  // Line bands grow left to right, one line after another, ahead of the
  // letters. Each band lasts as long as its own line's letter cascade, so the
  // text keeps a constant `bandLead` behind the background all the way down.
  // background-size (not scaleX / clip-path) so the letters are never
  // squashed or cut. Without the split (no JS, reduced) the CSS band shows.
  tl.addLabel("bands", "-=0.3");
  split.lines.forEach((line, i) => {
    const band = selectHeroEl(line, HERO_SELECTORS.band);
    if (!band) return;
    const lineChars = split.chars.filter((char) => line.contains(char));
    // The template's bg utility is the single source of the band colour; read
    // it before swapping the flat colour for an animatable gradient.
    const bandColor = getComputedStyle(band).backgroundColor;
    gsap.set(band, {
      backgroundColor: "transparent",
      backgroundImage: `linear-gradient(${bandColor}, ${bandColor})`,
      backgroundRepeat: "no-repeat",
    });
    tl.fromTo(
      band,
      { backgroundSize: "0% 100%" },
      {
        backgroundSize: "100% 100%",
        duration: Math.max(lineChars.length * charStagger, charDuration),
        ease: "none",
      },
      i === 0 ? "bands" : ">",
    );
  });

  tl.from(
    split.chars,
    {
      duration: charDuration,
      opacity: 0,
      y: 100,
      rotation: 45,
      stagger: charStagger,
    },
    `bands+=${HERO_INTRO.bandLead}`,
  );

  // Highlight keywords in the title split
  tl.to(highlights, {
    color: tokenColor("secondary-600"),
    stagger: motion.duration("md") / 1000,
  });

  // Both positioned outside the timeline — standing behaviours, not phases of
  // this reveal. The heading's band is a full-bleed backdrop; the mission
  // statement owns its own scroll-cued arrival (it sits an `h-dvh` below the
  // header, so anything sequenced here would play off-screen) and attaches the
  // overview band itself as that arrival's first beat.
  // attachHeadingGel(view, gelManager);
  //attachMissionStatement(view, gelManager);

  return tl;
}

/**
 * Hero outro: two scrub-driven beats while the section is pinned.
 * 1. H2's SplitText lines fade to opacity 0, last line first.
 * 2. The heading gel grows from its own vertical center to fill the viewport.
 *
 * HeroTriggers hands this timeline to a dedicated pin trigger, so playback
 * progress is owned by scroll position, not this function. Positional values
 * are function-based so `invalidateOnRefresh` re-measures them on resize.
 *
 * Returns an empty, id-tagged timeline (no children) when the heading hasn't
 * been split yet (intro not built for this view) — HeroTriggers reads that as
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

  const gelEl = getHeadingGelEl(gelManager);

  tl.addLabel("outro");

  // 1. line fade, last line first
  tl.to(split.lines, {
    opacity: 0,
    duration: HERO_OUTRO.duration,
    ease: HERO_OUTRO.ease.out,
    stagger: { each: HERO_OUTRO.stagger, from: "end" },
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
      duration: HERO_OUTRO.gelDuration,
      ease: HERO_OUTRO.ease.inOut,
    });
  }
  tl.addLabel("gel-open");

  return tl;
}
