/** @format */
import groq from "groq";

/**
 * Documentation landing page projection (inner shape — excludes field name and traversal operator).
 * Used for the documentation landing page singleton.
 * The singleton keeps these on a `page` object (`landingPage`) since the
 * 2026-11-24 schema change; the old root names are the fallback. The output
 * names stay flat (`pageTitle`, `pageNavLabel`, `pageBody`) so templates and
 * transforms did not change.
 */
export const DOCUMENTATION_LANDING_PROJECTION = groq`{
  _id,
  _updatedAt,
  "pageTitle": coalesce(page.title, pageTitle),
  "pageNavLabel": coalesce(page.navLabel, pageNavLabel),
  "seo": page.seo{title, description, noIndex, "ogImage": ogImage.asset->url},
  "pageBody": coalesce(page.body, pageBody)[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
        description,
        metadata{dimensions, lqip}
      }
    }
  }
}`;
