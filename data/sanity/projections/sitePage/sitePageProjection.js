/** @format */
import groq from "groq";

/**
 * Site page projection (inner shape — excludes field name and traversal operator).
 * Used for every `sitePage` document. `parent` keeps only `_id` and `_type`, which
 * is enough for the transform to walk the chain and build the URL.
 */
export const SITE_PAGE_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract,
  navLabel,
  "parent": parent->{_id, _type},
  body[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
        description,
        metadata{dimensions, lqip}
      }
    }
  },
  "seo": seo{
    title,
    description,
    noIndex,
    "ogImage": ogImage.asset->url
  }
}`;
