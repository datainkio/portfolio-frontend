/** @format */
import groq from "groq";

/**
 * Site Settings projection (inner shape — excludes field name and traversal operator).
 * Mirrors the `siteSettings` singleton document defined in
 * backend/schemaTypes/documents/config/siteSettings.ts.
 *
 * Usage example (11ty query):
 *   *[_id == "siteSettings"][0]${SITE_SETTINGS_PROJECTION}
 */
export const SITE_SETTINGS_PROJECTION = groq`{
  _id,
  _updatedAt,
  siteName,
  tagline,
  canonicalUrl,
  brand{
    "logo": logo{
      alt,
      "asset": asset->{url, metadata{dimensions, lqip}}
    },
    "defaultOgImage": defaultOgImage{
      alt,
      "asset": asset->{url, metadata{dimensions, lqip}}
    }
  },
  seo{
    titleTemplate,
    defaultDescription,
    robotsIndex
  },
  integrations{
    analytics{
      gaMeasurementId,
      plausibleDomain
    }
  }
}`;
