/**
 * ---
 * aix:
 *   id: frontend.eleventy.collections.cms
 *   role: Eleventy module: eleventy/collections/sanity.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - eleventy
 *     - collections
 *     - cms
 * ---
 */
/** @format */
import fetchSanityData from "../../cms/fetchSanityData.js";
import { toHTML } from "@portabletext/to-html";
import {
  createSanityClient,
  resolveSanityConfig,
  sanitizeConfigForLogs,
} from "../../cms/client.js";
import { CMS_QUERIES } from "../../cms/queries.js";
import logger, { LumberjackStyle } from "@datainkio/lumberjack";

logger.enabled = true;

const titleStyle = new LumberjackStyle("#0A9396", "\n🛰️ ");
const msgStyle = new LumberjackStyle("#CA6702", "•");
const successStyle = new LumberjackStyle("#EE9B00", "\n👍");
const warnStyle = new LumberjackStyle("#AE2012", "⛔");

const svgMarkupCache = new Map();

function normalizeLinkHref(href) {
  if (!href || typeof href !== "string") {
    return "";
  }

  const trimmed = href.trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return "";
  }

  return "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderAsideResources(resources) {
  if (!Array.isArray(resources) || resources.length === 0) {
    return "";
  }

  const items = resources
    .map((resource) => {
      const href = normalizeLinkHref(resource?.href);
      if (!href) {
        return "";
      }

      const label = escapeHtml(resource?.label || href);
      const external =
        href.startsWith("http://") || href.startsWith("https://");
      const openInNewTab = Boolean(resource?.openInNewTab) || external;
      const rel = openInNewTab ? ' rel="noopener noreferrer"' : "";
      const target = openInNewTab ? ' target="_blank"' : "";

      return `<li><a href="${href}"${target}${rel}>${label}<span aria-hidden="true">↗</span></a></li>`;
    })
    .filter(Boolean)
    .join("");

  if (!items) {
    return "";
  }

  return `<aside><h3>Resources</h3><ul>${items}</ul></aside>`;
}

function serializePortableTextToHtml(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "";
  }

  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) => {
          const src = value?.asset?.url;
          if (!src) {
            return "";
          }

          const alt = escapeHtml(value?.alt || "");
          return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" data-bio-el="body" />`;
        },
        sub_section: ({ value }) => {
          const heading = escapeHtml(value?.heading || "");
          const bodyHtml = serializePortableTextToHtml(value?.body);

          if (!heading && !bodyHtml) {
            return "";
          }

          const headingHtml = heading
            ? `<h3 data-bio-el="sub-section-heading">${heading}</h3>`
            : "";
          const nestedBodyHtml = bodyHtml
            ? `<div data-bio-el="sub-section-body">${bodyHtml}</div>`
            : "";

          return `<section class="sub-section" data-bio-el="sub-section">${headingHtml}${nestedBodyHtml}</section>`;
        },
        project_aside: ({ value }) => {
          const heading = escapeHtml(value?.title || "");
          const bodyHtml = serializePortableTextToHtml(value?.body);
          const resourcesHtml = renderAsideResources(value?.resources);

          if (!heading && !bodyHtml && !resourcesHtml) {
            return "";
          }

          const headingHtml = heading
            ? `<h3 class="project-aside__heading" data-bio-el="project-aside-heading">${heading}</h3>`
            : "";
          const narrativeHtml = bodyHtml
            ? `<div class="project-aside__body" data-bio-el="project-aside-body">${bodyHtml}</div>`
            : "";

          return `<aside class="project-aside" data-bio-el="project-aside">${headingHtml}${narrativeHtml}${resourcesHtml}</aside>`;
        },
      },
      block: {
        normal: ({ children }) => `<p>${children}</p>`,
      },
      marks: {
        link: ({ children, value }) => {
          const href = normalizeLinkHref(value?.href);
          if (!href) {
            return children;
          }

          const external =
            href.startsWith("http://") || href.startsWith("https://");
          const rel = external ? ' rel="noopener noreferrer"' : "";
          const target = external ? ' target="_blank"' : "";
          return `<a href=\"${href}\"${target}${rel}>${children}</a>`;
        },
      },
    },
  });
}

function normalizeLandingRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const valuePropBodyHtml = serializePortableTextToHtml(
      record?.valuePropRichText,
    );

    return {
      ...record,
      valuePropBodyHtml,
    };
  });
}

function resolveProjectCardUrl(project) {
  if (project?.slug) {
    return `/work/${project.slug}/`;
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

function buildProjectCardRecord(project = {}) {
  const title = project?.title || "Untitled project";
  const organization = project?.organization?.title || "";
  const status = project?.status || "";

  return {
    title,
    image: project?.featuredImage,
    url: resolveProjectCardUrl(project),
    eyebrow: organization,
    description: project?.abstract || "",
    meta: status ? `Status: ${status}` : "",
    featured: Boolean(project?.featured),
  };
}

function buildOrganizationCardRecord(organization = {}) {
  const title = organization?.title || "Untitled organization";
  const url = organization?.slug ? `/organizations/${organization.slug}/` : "";
  const industry = organization?.industry?.title || "";
  const website =
    typeof organization?.website === "string" ? organization.website : "";

  return {
    title,
    image: organization?.logo,
    url,
    eyebrow: industry,
    description: organization?.abstract || "",
    meta: website,
    featured: Boolean(organization?.featured),
  };
}

function buildAwardCardRecord(award = {}) {
  const title = award?.title || "Untitled award";
  const level = typeof award?.level === "string" ? award.level.trim() : "";
  const category =
    typeof award?.category === "string" ? award.category.trim() : "";
  const meta = [level, category].filter(Boolean).join(" - ");

  return {
    title,
    image: award?.organization?.logo,
    url: award?.url || "",
    eyebrow: award?.organization?.title || "",
    description: award?.description || "",
    meta,
    featured: Boolean(award?.featured),
  };
}

function normalizeProjectRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => {
    const bodyBlocks = Array.isArray(record?.body) ? record.body : [];
    const bodyHtml = serializePortableTextToHtml(bodyBlocks);

    return {
      ...record,
      body: bodyBlocks,
      bodyHtml,
      card: buildProjectCardRecord(record),
    };
  });
}

function normalizeOrganizationRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    card: buildOrganizationCardRecord(record),
  }));
}

function normalizeAwardRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    card: buildAwardCardRecord(record),
  }));
}

function resolveNavigationHref(item) {
  if (!item || typeof item !== "object") {
    return "";
  }

  switch (item._type) {
    case "home":
      return "/";
    case "projects":
      return "/projects/";
    case "contact":
      return "/contact/";
    case "project":
      return item.slug ? `/work/${item.slug}/` : "";
    case "post":
      return item.slug ? `/posts/${item.slug}/` : "/posts/";
    case "documentation":
      return "/docs/";
    default:
      return "";
  }
}

function resolveNavigationLabel(item) {
  const label = typeof item?.label === "string" ? item.label.trim() : "";
  if (label) {
    return label;
  }

  switch (item?._type) {
    case "home":
      return "Home";
    case "projects":
      return "Projects";
    case "contact":
      return "Contact";
    case "project":
      return "Project";
    case "post":
      return "Post";
    case "documentation":
      return "Documentation";
    default:
      return "Untitled";
  }
}

function normalizeNavigationItems(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const url = resolveNavigationHref(item);
      if (!url) {
        return null;
      }

      const title = resolveNavigationLabel(item);
      return {
        title,
        key: title,
        url,
      };
    })
    .filter(Boolean);
}

function normalizeNavigationRecords(records = []) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records.map((record) => ({
    ...record,
    headerItems: normalizeNavigationItems(record?.headerItems),
    footerItems: normalizeNavigationItems(record?.footerItems),
  }));
}

async function fetchSvgMarkup(url) {
  if (!url || typeof url !== "string") {
    return "";
  }

  const cached = svgMarkupCache.get(url);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch SVG: ${response.status} ${response.statusText}`,
      );
    }

    const svgMarkup = await response.text();
    svgMarkupCache.set(url, svgMarkup);
    return svgMarkup;
  } catch (error) {
    logger.trace(
      `Award logo inline fetch failed for ${url}: ${error.message}`,
      null,
      "brief",
      warnStyle,
    );
    svgMarkupCache.set(url, "");
    return "";
  }
}

async function hydrateAwardInlineLogos(records = []) {
  const awards = Array.isArray(records) ? records : [];

  return Promise.all(
    awards.map(async (award) => {
      const logoUrl = award?.organization?.logo?.asset?.url || award?.logo;
      const logoInline = await fetchSvgMarkup(logoUrl);

      if (!logoInline) {
        return award;
      }

      const organization = award?.organization || {};
      const organizationLogo = organization.logo || {};

      return {
        ...award,
        logoInline,
        organization: {
          ...organization,
          logo: {
            ...organizationLogo,
            inline: logoInline,
          },
        },
      };
    }),
  );
}

async function fetchAllQueries({ client, cacheDefault, useParallel }) {
  const tasks = CMS_QUERIES.map(async (definition) => {
    const cacheDuration = definition.cacheDuration || cacheDefault;
    let data = await fetchSanityData({
      client,
      id: definition.id,
      query: definition.query,
      params: definition.params || {},
      cacheDuration,
    });

    if (definition.id === "awards") {
      data = await hydrateAwardInlineLogos(data);
      data = normalizeAwardRecords(data);
    }

    if (definition.id === "home") {
      data = normalizeLandingRecords(data);
    }

    if (definition.id === "projects") {
      data = normalizeProjectRecords(data);
    }

    if (definition.id === "organizations") {
      data = normalizeOrganizationRecords(data);
    }

    if (definition.id === "navigation") {
      data = normalizeNavigationRecords(data);
    }

    return { id: definition.id, data };
  });

  if (useParallel) {
    return Promise.all(tasks);
  }

  const results = [];
  for (const task of tasks) {
    results.push(await task);
  }
  return results;
}

export async function init(eleventyConfig, site) {
  logger.trace("Syncing CMS content", null, "brief", titleStyle);
  logger.trace(
    "process.env.SANITY_CACHE_DURATION: " + process.env.SANITY_CACHE_DURATION,
    null,
    "brief",
    msgStyle,
  );
  logger.trace(
    "process.env.FORCE_REFRESH: " + process.env.SANITY_FORCE_REFRESH,
    null,
    "brief",
    msgStyle,
  );
  const cmsConfig = resolveSanityConfig(site?.cms || site?.sanity || {});

  if (!cmsConfig.projectId || !cmsConfig.dataset) {
    eleventyConfig.addGlobalData("cms", {});
    logger.trace(
      "CMS skipped: missing projectId/dataset",
      null,
      "brief",
      warnStyle,
    );
    return;
  }

  const client = createSanityClient(cmsConfig);
  if (!client) {
    eleventyConfig.addGlobalData("cms", {});
    return;
  }

  eleventyConfig.addGlobalData("cmsMeta", sanitizeConfigForLogs(cmsConfig));

  const cacheDuration = cmsConfig.cacheDuration || "1d";
  const useParallel = cmsConfig.parallel !== false;
  const results = await fetchAllQueries({
    client,
    cacheDefault: cacheDuration,
    useParallel,
  });

  const cmsPayload = results.reduce((payload, { id, data }) => {
    payload[id] = data || [];
    return payload;
  }, {});

  eleventyConfig.addGlobalData("cms", cmsPayload);

  results.forEach(({ id, data }) => {
    eleventyConfig.addCollection(id, () => data || []);
  });

  logger.trace("CMS collections registered", null, "brief", successStyle);
}
