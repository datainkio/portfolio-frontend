/** @format */

import { serializePortableTextToHtml } from "./portableText.js";
import { resolveProjectCardUrl } from "./project.js";
import { fetchSvgMarkup } from "./award.js";

export function normalizeLandingRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const valuePropBodyHtml = serializePortableTextToHtml(
      record?.pageBody,
    );
    const workBodyHtml = serializePortableTextToHtml(record?.workBody);

    // The home query embeds featuredProjects via PROJECT_CARD_PROJECTION, which
    // emits slug/caseStudyUrl/externalLink but no `url`. Resolve it here so the
    // card "View More" link has a destination — same source of truth as the
    // standalone `projects`/`projectsByIndustry` queries.
    const featuredProjects = Array.isArray(record?.featuredProjects)
      ? record.featuredProjects.map((project) => ({
          ...project,
          url: resolveProjectCardUrl(project),
        }))
      : record?.featuredProjects;

    // Hero statements in the shape hero.njk renders: { subheading, body (HTML), image }.
    // The value prop is prepended as item 0 in home.njk, not here.
    const statements = Array.isArray(record?.statements)
      ? record.statements.map((statement) => ({
          subheading: statement?.subheading,
          body: serializePortableTextToHtml(statement?.body),
          image: statement?.image,
        }))
      : [];

    return {
      ...record,
      valuePropBodyHtml,
      statements,
      workBodyHtml,
      featuredProjects,
    };
  });
}

// True when a Sanity asset URL points at an SVG. Sanity serves SVGs under
// `/images/` (image fields) or `/files/` (file fields) with the extension kept,
// and imageUrl() leaves them unparameterised, so the pathname is enough.
function isSvgUrl(url) {
  if (typeof url !== "string") return false;
  try {
    return new URL(url).pathname.toLowerCase().endsWith(".svg");
  } catch {
    return false;
  }
}

/**
 * Give each hero statement whose image asset is an SVG an `imageInline` string:
 * the SVG's markup, fetched at build time so section-statement.njk can inline
 * it (and the Hero choreography can reach its groups). Uses award.js's
 * module-scope `fetchSvgMarkup` cache. A failed fetch leaves the statement
 * unchanged, so it falls back to the `<img>` render.
 *
 * Run after normalizeLandingRecords (which shapes `statements`).
 */
export async function hydrateStatementInlineSvgs(records = []) {
  if (!Array.isArray(records)) return records;

  return Promise.all(
    records.map(async (record) => {
      if (!Array.isArray(record?.statements)) return record;

      const statements = await Promise.all(
        record.statements.map(async (statement) => {
          const url = statement?.image?.asset?.url;
          if (!isSvgUrl(url)) return statement;
          const imageInline = await fetchSvgMarkup(url);
          return imageInline ? { ...statement, imageInline } : statement;
        }),
      );

      return { ...record, statements };
    }),
  );
}
