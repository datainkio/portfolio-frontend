/** @format */

import { serializePortableTextToHtml } from "./portableText.js";
import { hydrateAwardInlineLogos } from "./award.js";

export function resolveProjectCardUrl(project) {
  if (project?.slug) {
    return `/case-studies/${project.slug}/`;
  }

  const caseStudyUrl =
    typeof project?.caseStudyUrl === "string" ? project.caseStudyUrl : "";
  if (caseStudyUrl) {
    return caseStudyUrl;
  }

  if (typeof project?.externalLink === "string") {
    return project.externalLink;
  }

  if (typeof project?.externalLink?.href === "string") {
    return project.externalLink.href;
  }

  return "";
}

export function addProjectUrls(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    url: resolveProjectCardUrl(record),
  }));
}

export function addUrlsToProjectsByIndustry(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((industry) => {
    const projects = Array.isArray(industry?.projects)
      ? industry.projects.map((project) => ({
          ...project,
          url: resolveProjectCardUrl(project),
        }))
      : [];

    return { ...industry, projects };
  });
}

export async function normalizeProjectPageRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return Promise.all(
    records.map(async (record) => ({
      ...record,
      url: resolveProjectCardUrl(record),
      bodyHtml: serializePortableTextToHtml(record?.body || []),
      awards: Array.isArray(record?.awards)
        ? await hydrateAwardInlineLogos(record.awards)
        : record?.awards,
    })),
  );
}
