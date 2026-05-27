import Hero from "../organisms/hero/Hero.js";
import Bio from "../organisms/bio/Bio.js";
import BackgroundVideo from "../organisms/background/BackgroundVideo.js";
import Awards from "../organisms/awards/Awards.js";
import Organizations from "../organisms/organizations/Organizations.js";
import Work from "../organisms/work/Work.js";

export const SECTION_REGISTRY = {
  hero: Hero,
  video: BackgroundVideo,
  bio: Bio,
  awards: Awards,
  organizations: Organizations,
  work: Work,
};

/** @param {string} sectionId @returns {string} */
export function getSectionName(sectionId) {
  const names = {
    hero: "Hero Section",
    video: "Background Video",
    bio: "Biography Section",
    awards: "Awards Section",
    organizations: "Organizations Section",
    work: "Work Section",
  };
  return names[sectionId] || sectionId;
}

/** @returns {string[]} */
export function getSectionIds() {
  return Object.keys(SECTION_REGISTRY);
}

/** @param {string} sectionId @returns {boolean} */
export function isSectionRegistered(sectionId) {
  return sectionId in SECTION_REGISTRY;
}
