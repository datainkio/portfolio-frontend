/**
 * Directory data file: ia/docs/motion/
 *
 * Every page here uses the design-doc layout with the "Motion" sidebar. Two
 * templates are paginated over the `motionDocs` global (see
 * eleventy/collections/motionSystem.js): module.njk makes one page per
 * choreography sidecar, and layer.njk one per folder under js/choreography/.
 * No page restates a sidecar, so the sidecars stay the authority.
 *
 * Navigation: this folder's README is the "Motion" key, under the same
 * nonexistent "Docs" parent the Design reference names. Sections follow:
 * the authored ones in SECTION_ORDER, then one per choreography layer in the
 * reader's order. A module's `group` and `order` come from the reader.
 */

/** Authored sections, ahead of the generated layer sections. */
const SECTION_ORDER = ["strategy", "reference"];

export default {
  layout: "layouts/design-doc.njk",
  // Site stylesheet plus the reference-only classes; see styles/docs.css.
  stylesheet: "/assets/docs.css",
  docsNav: "Motion",
  eleventyComputed: {
    eyebrow: (data) => data.motionModule?.layer,

    eleventyNavigation: (data) => {
      if (data.eleventyNavigation?.key) return data.eleventyNavigation;

      const mod = data.motionModule;
      if (mod) {
        return {
          key: mod.url,
          parent: `motion/${mod.layer}`,
          title: mod.name,
          group: mod.group || undefined,
          order: mod.order,
        };
      }
      const layer = data.motionLayer;
      if (layer) {
        return {
          key: `motion/${layer.name}`,
          parent: "Motion",
          title: layer.title,
          order: SECTION_ORDER.length + layer.order,
        };
      }

      const stem = data.page?.filePathStem || "";
      const parts = stem.replace(/^\/docs\/motion\/?/, "").split("/");
      const title = data.title;
      if (parts.length === 1 && parts[0] === "README") {
        return { key: "Motion", parent: "Docs", title };
      }
      const section = parts[0];
      if (parts.length === 2 && parts[1] === "README") {
        const order = SECTION_ORDER.indexOf(section);
        return {
          key: `motion/${section}`,
          parent: "Motion",
          title,
          order: order < 0 ? 99 : order,
        };
      }
      return {
        key: stem,
        parent: `motion/${section}`,
        title,
        order: data.order ?? 99,
      };
    },
  },
};
