/** @format */

import { serializePortableTextToHtml } from "./portableText.js";
import { resolveProjectCardUrl } from "./project.js";

export function normalizeLandingRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const valuePropBodyHtml = serializePortableTextToHtml(
      record?.valuePropRichText,
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

    return {
      ...record,
      valuePropBodyHtml,
      workBodyHtml,
      featuredProjects,
    };
  });
}
