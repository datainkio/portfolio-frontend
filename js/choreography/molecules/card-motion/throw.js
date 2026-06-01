import { gsap } from "/assets/js/choreography/system/gsap.js";
import { isReducedMotion } from "../../managers/ReducedMotionHandler/ReducedMotionHandler.js";
import {
  CARD_FIGURE_CLIP_TRIGGER,
  CARD_FIGURE_PARALLAX_TRIGGER,
  motion,
} from "../../config/index/index.js";
export function createThrowTimeline({
  article,
  body,
  index = 0,
  triggerEl,
  reduceMotion,
} = {}) {
  if (isReducedMotion(reduceMotion)) {
    gsap.set(article, { clearProps: CLEAR.articleBase });
    return { kill() {} };
  }

  const tl = gsap.timeline({
    // duration: motion.duration("slow"),
    scrollTrigger: {
      trigger: article,
      start: "top top",
      end: "bottom 50px",
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl.add(createIntroTimeline(article));
  tl.add(createInterTimeline(article));
  tl.add(createOutroTimeline(article));

  return {
    kill() {
      killST(tl);
      gsap.set(article, { clearProps: CLEAR.article });
      if (image) gsap.set(image, { clearProps: CLEAR.figureImage });
      if (body) gsap.set(body, { clearProps: CLEAR.body });
    },
  };
}

function createIntroTimeline(article) {
  const figure = article.querySelector('[data-card-el="figure"]');
  const body = article.querySelector('[data-card-el="body"]');

  const initialHeight = getViewport().height;
  gsap.set([figure, body], { y: initialHeight });

  const tl = gsap.timeline();
  tl.to(figure, {
    // duration: motion.duration("slow"),
    motionPath: {
      path: toViewportPath(VIEWPORT_PATHS.throwIn),
      curviness: 1.5,
      autoRotate: 90,
    },
  });

  return tl;
}

function createInterTimeline(article) {
  const figure = article.querySelector('[data-card-el="figure"]');
  const body = article.querySelector('[data-card-el="body"]');

  // Capture before any DOM mutation — once body goes position:absolute it
  // leaves the grid flow and article's auto height shrinks.
  const figureHeight = figure.offsetHeight;
  const articleHeight = article.offsetHeight;
  const bodyHeight = body.offsetHeight;
  const collapseDistance = figureHeight + bodyHeight - articleHeight;

  const tl = gsap.timeline();
  tl.call(() => {
    gsap.set(body, {
      position: "absolute",
      bottom: collapseDistance,
      left: 0,
      right: 0,
      zIndex: 10,
    });
  });
  tl.to(body, {
    y: collapseDistance,
    //duration: motion.duration("slow"),
  });
  tl.to(article, {
    height: bodyHeight * 1.5,
    // duration: motion.duration("slow"),
  });

  return tl;
}

function createOutroTimeline(article) {
  const tl = gsap.timeline();
  return tl;
}

const VIEWPORT_PATHS = {
  throwIn: [
    { x: 85, y: 100 },
    { x: 10, y: 33 },
    { x: 0, y: 0 },
  ],
  throwOut: [
    { x: 0, y: 0 },
    { x: 25, y: -25 },
    { x: 100, y: -100 },
  ],
};

const getViewport = () => {
  const viewport = window.visualViewport;

  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
  };
};

const toViewportPath = (points) => {
  const { width, height } = getViewport();

  return points.map(({ x, y }) => ({
    x: width * (x / 100),
    y: height * (y / 100),
  }));
};
