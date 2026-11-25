/** @format */
import groq from "groq";
import { FEATURED_IMAGE_PROJECTION } from "../image/featuredImageProjection.js";

/**
 * Post reference projection (inner shape — excludes field name and traversal operator).
 * Used for relatedPosts[] references on post documents.
 */
export const POST_REF_PROJECTION = groq`{
  _id,
  "title": page.title,
  "slug": page.slug.current
}`;

/**
 * Post card projection (inner shape — excludes field name and traversal operator).
 * Used for the inventory list. Reading time is derived from `body`, not stored:
 * ~200 wpm at ~5 characters per word.
 */
export const POST_CARD_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract,
  publishDate,
  "author": author->name,
  "readingMinutes": round(length(pt::text(body)) / 1000),
  "featuredImage": featuredImage->${FEATURED_IMAGE_PROJECTION}
}`;

/**
 * Post page projection (inner shape — excludes field name and traversal operator).
 * Used for post detail pages: the card shape plus body, files, relations and SEO.
 * `topics` merges the three taxonomy arrays into one list of labels.
 */
export const POST_PAGE_PROJECTION = groq`{
  _id,
  _updatedAt,
  "title": page.title,
  "slug": page.slug.current,
  "abstract": page.abstract,
  publishDate,
  updateDate,
  "author": author->name,
  "readingMinutes": round(length(pt::text(body)) / 1000),
  "featuredImage": featuredImage->${FEATURED_IMAGE_PROJECTION},
  "topics": array::unique(
    coalesce(activities[]->prefLabel, []) +
    coalesce(roles[]->prefLabel, []) +
    coalesce(industries[]->prefLabel, [])
  ),
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{url, description, metadata{dimensions, lqip}}
    }
  },
  attachments[]{
    _key,
    title,
    description,
    "url": asset->url,
    "extension": asset->extension
  },
  relatedProjects[]->{
    _id,
    "title": page.title,
    "slug": page.slug.current
  },
  relatedPosts[]->${POST_REF_PROJECTION},
  "seo": seo{
    title,
    description,
    noIndex,
    "ogImage": ogImage.asset->url
  }
}`;
