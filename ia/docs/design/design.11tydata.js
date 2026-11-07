/**
 * Directory data file: ia/docs/design/
 *
 * Every page here uses the design-doc layout and gets a sidebar entry. A page
 * whose frontmatter names a `component` (a path under views/) also gets
 * `componentDoc`: the description and params read from that component's
 * sidecar, so the reference never restates them.
 *
 * Navigation: this folder's README is the "Design" key; each subfolder's
 * README is a section under it; every other page sits under its section.
 * "Design" names a "Docs" parent that doesn't exist, which keeps it out of
 * root-level eleventyNavigation lists such as primary-nav's fallback.
 */
import { readComponentSidecar } from "../../../eleventy/collections/designSystem.js";

const SECTION_ORDER = [
  "tokens",
  "atoms",
  "molecules",
  "organisms",
  "templates",
  "layouts",
];

/**
 * eleventy-navigation sorts siblings by a numeric `order` only. This encodes
 * the first six characters of a title in base 37, so siblings sort
 * alphabetically.
 */
const ALPHABET = " 0123456789abcdefghijklmnopqrstuvwxyz";
const alphaOrder = (title = "") =>
  [...String(title).toLowerCase().padEnd(6).slice(0, 6)].reduce(
    (n, ch) => n * 37 + Math.max(0, ALPHABET.indexOf(ch)),
    0,
  );

export default {
  layout: "layouts/design-doc.njk",
  eleventyComputed: {
    componentDoc: (data) =>
      data.component ? readComponentSidecar(data.component) : undefined,

    eleventyNavigation: (data) => {
      if (data.eleventyNavigation?.key) return data.eleventyNavigation;
      const stem = data.page?.filePathStem || "";
      const parts = stem.replace(/^\/docs\/design\/?/, "").split("/");
      const title = data.title;

      if (parts.length === 1 && parts[0] === "README") {
        return { key: "Design", parent: "Docs", title };
      }
      const section = parts[0];
      if (parts.length === 2 && parts[1] === "README") {
        const order = SECTION_ORDER.indexOf(section);
        return {
          key: `design/${section}`,
          parent: "Design",
          title,
          order: order < 0 ? 99 : order,
        };
      }
      return {
        key: stem,
        parent: parts.length > 1 ? `design/${section}` : "Design",
        title,
        order: alphaOrder(title),
      };
    },
  },
};
