/**
 * Directory data file: ia/docs/design/choreography/
 *
 * Every page here uses the design-doc layout with the "Choreography" sidebar. Two
 * templates are paginated over the `choreographyDocs` global (see
 * eleventy/collections/choreographySystem.js): module.njk makes one page per
 * choreography sidecar, and layer.njk one per folder under js/choreography/.
 * No page restates a sidecar, so the sidecars stay the authority.
 *
 * Navigation: this folder's README is the "Choreography" key, under the same
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
  docsNav: "Choreography",
  eleventyComputed: {
    eyebrow: (data) => data.choreographyModule?.layer,

    eleventyNavigation: (data) => {
      if (data.eleventyNavigation?.key) return data.eleventyNavigation;

      const mod = data.choreographyModule;
      if (mod) {
        return {
          key: mod.url,
          parent: `choreography/${mod.layer}`,
          title: mod.name,
          group: mod.group || undefined,
          order: mod.order,
        };
      }
      const layer = data.choreographyLayer;
      if (layer) {
        return {
          key: `choreography/${layer.name}`,
          parent: "Choreography",
          title: layer.title,
          order: SECTION_ORDER.length + layer.order,
        };
      }

      const stem = data.page?.filePathStem || "";
      const parts = stem
        .replace(/^\/docs\/design\/choreography\/?/, "")
        .split("/");
      const title = data.title;
      if (parts.length === 1 && parts[0] === "README") {
        return { key: "Choreography", parent: "Docs", title };
      }
      const section = parts[0];
      if (parts.length === 2 && parts[1] === "README") {
        const order = SECTION_ORDER.indexOf(section);
        return {
          key: `choreography/${section}`,
          parent: "Choreography",
          title,
          order: order < 0 ? 99 : order,
        };
      }
      return {
        key: stem,
        parent: `choreography/${section}`,
        title,
        order: data.order ?? 99,
      };
    },
  },
};
