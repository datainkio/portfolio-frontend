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

          return `<section data-bio-el="sub-section">${headingHtml}${nestedBodyHtml}</section>`;
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
    }

    if (definition.id === "landing") {
      data = normalizeLandingRecords(data);
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
