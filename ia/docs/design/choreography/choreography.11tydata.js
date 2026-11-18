/**
 * Directory data file: ia/docs/design/choreography/
 *
 * Layout and stylesheet come from the Design folder's data file above. Two
 * templates are paginated over the `choreographyDocs` global (see
 * eleventy/collections/choreographySystem.js): module.njk makes one page per
 * choreography sidecar, and layer.njk one per folder under js/choreography/.
 * No page restates a sidecar, so the sidecars stay the authority.
 *
 * Navigation: everything is a child of the "Design" root, under the part
 * "Choreography". The README is a leaf, "Overview". Each own-section layer
 * (atoms, molecules, organisms, pages) and "System" is a top-level section;
 * the reader says which layer folds into System and where each module sits
 * (`section`, `group`, `order`). A folded layer's index page still builds but
 * has no entry. System's authored pages: strategy first, no group; reference
 * under "Contracts"; then the reader's modules (orders from 1000).
 */

const PART = "Choreography";

/**
 * Top-level slot for this part, between design.11tydata.js's "organisms" and
 * "maintenance". Sections take fractions of it so they stay together.
 */
const SLOT = 70;

const CONTRACTS_GROUP = "Contracts";
/** Authored pages sort ahead of the reader's modules, which start at 1000. */
const CONTRACTS_ORDER = 100;

export default {
  eleventyComputed: {
    eyebrow: (data) => data.choreographyModule?.layer,

    eleventyNavigation: (data) => {
      if (data.eleventyNavigation?.key) return data.eleventyNavigation;

      const mod = data.choreographyModule;
      if (mod) {
        return {
          key: mod.url,
          parent: mod.section,
          title: mod.name,
          group: mod.group || undefined,
          order: mod.order,
        };
      }
      const layer = data.choreographyLayer;
      if (layer) {
        // A folded layer is reached from the System page, not the sidebar.
        if (layer.folded) return undefined;
        return {
          key: layer.section,
          parent: "Design",
          title: layer.title,
          part: PART,
          order: SLOT + (layer.sectionOrder + 1) / 10,
        };
      }

      const stem = data.page?.filePathStem || "";
      const parts = stem
        .replace(/^\/docs\/design\/choreography\/?/, "")
        .split("/");
      if (parts.length === 1 && parts[0] === "README") {
        return {
          key: stem,
          parent: "Design",
          title: "Overview",
          part: PART,
          order: SLOT,
        };
      }
      const inContracts = parts[0] === "reference";
      return {
        key: stem,
        parent: "choreography/system",
        title: data.title,
        group: inContracts ? CONTRACTS_GROUP : undefined,
        order: (inContracts ? CONTRACTS_ORDER : 0) + (data.order ?? 99),
      };
    },
  },
};
