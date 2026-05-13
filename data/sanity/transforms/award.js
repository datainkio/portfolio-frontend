/** @format */

import logger, { LumberjackStyle } from "@datainkio/lumberjack";

const warnStyle = new LumberjackStyle("#AE2012", "⛔");

const svgMarkupCache = new Map();

export async function fetchSvgMarkup(url) {
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

export async function hydrateAwardInlineLogos(records = []) {
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
