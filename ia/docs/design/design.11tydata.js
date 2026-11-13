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
 *
 * Within a section, pages are grouped by role and ordered by composition
 * (base before variants, page order for page sections). GROUPS below is the
 * authority: a page it doesn't list still renders, under "Ungrouped", so the
 * gap is visible rather than hidden.
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
 * Sidebar groups per section. Keys are a page's path under its section
 * folder, without the extension. A group with no `title` renders its pages
 * directly under the section heading. Order in these arrays is the order in
 * the sidebar.
 */
const GROUPS = {
  tokens: [
    {
      pages: [
        "colour",
        "typography",
        "spacing",
        "radius-and-shadow",
        "motion",
        "utilities",
      ],
    },
  ],
  atoms: [
    {
      title: "Text and actions",
      pages: ["heading", "link/link", "link/nav-link", "button", "cta"],
    },
    {
      title: "Glyphs and marks",
      pages: [
        "icon",
        "svg/inline",
        "hanko/hanko",
        "svg/email",
        "svg/globe",
        "svg/location",
      ],
    },
    {
      title: "Print proof",
      pages: [
        "printmarks/trim-marks",
        "printmarks/margin-bleed-marks",
        "printmarks/registration-marks",
        "printmarks/ink-marks",
        "svg/registration-mark",
        "svg/colors",
        "svg/neutrals",
      ],
    },
    {
      title: "Overlays and media",
      pages: ["video/video", "gel", "pixelator", "svg/ui-components-loop"],
    },
    { title: "Record text", pages: ["award", "organization"] },
  ],
  molecules: [
    {
      title: "Cards",
      pages: [
        "card/card",
        "card/project",
        "card/organization",
        "card/award",
        "card/award-organization",
        "card/design-decision",
      ],
    },
    {
      title: "Lists",
      pages: [
        "list/project-cards",
        "list/project-details",
        "list/project-orgs",
        "list/roles",
        "list/activities",
        "list/organizations",
        "list/industry",
        "list/main-pages",
        "list/child-pages",
        "list/social-accounts-list",
      ],
    },
    {
      title: "Navigation",
      pages: [
        "input/nav-item",
        "navigation/pager",
        "navigation/article-nav-links",
        "list/industry-links",
      ],
    },
    {
      title: "Sections",
      pages: [
        "section/section-frame",
        "section/section-statement",
        "star-summary/star-summary",
        "design-decisions",
        "section/industry-section",
        "awards",
      ],
    },
    {
      title: "Content blocks",
      pages: [
        "figure/media",
        "lightbox/lightbox-dialog",
        "stats/stats",
        "project-metadata/project-metadata",
        "callout",
        "social-account/social-account",
      ],
    },
    {
      title: "Backgrounds and marks",
      pages: [
        "band/band",
        "background/sizzle-background",
        "printmarks",
        "labels/accession-label",
      ],
    },
    { title: "Forms", pages: ["form/field", "form/honeypot"] },
    {
      title: "Docs and tooling",
      pages: ["list/design-pages", "list/build-info", "section-playback"],
    },
  ],
  organisms: [
    {
      title: "Chrome",
      pages: [
        "header/global-header",
        "footer/global-footer",
        "status/preloader",
      ],
    },
    {
      title: "Navigation",
      pages: [
        "navigation/skip-links-nav",
        "navigation/primary-nav",
        "navigation/page-nav",
        "navigation/industry-nav/industry-nav",
      ],
    },
    {
      title: "Page headers",
      pages: ["header/article/article-header", "header/project/project-header"],
    },
    {
      title: "Homepage sections",
      pages: [
        "section/hero",
        "section/work",
        "section/organizations",
        "section/awards",
        "section/process",
      ],
    },
    { title: "Forms", pages: ["forms/contact-form"] },
  ],
};

/** Pages GROUPS doesn't list land here, after every listed group. */
const UNGROUPED = { title: "Ungrouped", index: 99 };

/** Room for every page in a group and every alphaOrder value below it. */
const GROUP_STRIDE = 1e10;

/**
 * eleventy-navigation sorts siblings by a numeric `order` only. This encodes
 * the first six characters of a title in base 37, so unlisted siblings sort
 * alphabetically within "Ungrouped".
 */
const ALPHABET = " 0123456789abcdefghijklmnopqrstuvwxyz";
const alphaOrder = (title = "") =>
  [...String(title).toLowerCase().padEnd(6).slice(0, 6)].reduce(
    (n, ch) => n * 37 + Math.max(0, ALPHABET.indexOf(ch)),
    0,
  );

/** The group and sort order for a page at `path` under `section`. */
const placement = (section, path, title) => {
  const groups = GROUPS[section] || [];
  for (const [index, group] of groups.entries()) {
    const position = group.pages.indexOf(path);
    if (position >= 0) {
      return {
        group: group.title,
        order: (index + 1) * GROUP_STRIDE + position,
      };
    }
  }
  return {
    group: UNGROUPED.title,
    order: UNGROUPED.index * GROUP_STRIDE + alphaOrder(title),
  };
};

export default {
  layout: "layouts/design-doc.njk",
  // Site stylesheet plus the reference-only classes; see styles/docs.css.
  stylesheet: "/assets/docs.css",
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
      if (parts.length === 1) {
        return { key: stem, parent: "Design", title, order: alphaOrder(title) };
      }
      const path = parts.slice(1).join("/");
      return {
        key: stem,
        parent: `design/${section}`,
        title,
        ...placement(section, path, title),
      };
    },
  },
};
