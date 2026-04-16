/**
 * Section runtime behavior defaults.
 *
 * Maps section keys to behavior flags consumed by AbstractSection.
 */
export const SECTION_BEHAVIOR = {
  default: {
    autoPlayIntroOnEnter: false,
  },

  bio: {
    autoPlayIntroOnEnter: true,
    autoPlayOutroOnLeave: true,
  },
};
