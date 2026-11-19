import { ANIMATION_DEFAULTS, motion, toSeconds } from "../motion.js";

export const AWARDS_INTRO = {
  ...ANIMATION_DEFAULTS,
  duration: toSeconds(motion.duration("slower")),
  // Gel sheets get their own knob so they can be paced independently of the
  // content. Under the scrubbed AWARDS_TRIGGER, what matters is the *ratio* of
  // gelDuration to duration (relative share of the scroll range), not seconds.
  gelDuration: toSeconds(motion.duration("slower")),
};
