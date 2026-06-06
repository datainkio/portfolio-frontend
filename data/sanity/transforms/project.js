/** @format */

import { serializePortableTextToHtml } from "./portableText.js";

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

export function normalizeProjectPageRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    url: resolveProjectCardUrl(record),
    bodyHtml: serializePortableTextToHtml(record?.body || []),
  }));
}
