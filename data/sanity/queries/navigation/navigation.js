/** @format */
import groq from "groq";

// Referenced documents expose their title/slug under different field names
// depending on type (root `pageTitle`/`title`/`slug`, or nested `page.title`/
// `page.slug`) — coalesce across them instead of branching on `_type`, so any
// document type added to navigation.ts's reference list resolves without a
// query change.
const navigationItemProjection = groq`{
  _id,
  _type,
  "label": coalesce(pageTitle, page.title, title, "Untitled"),
  "slug": coalesce(slug.current, page.slug.current, null)
}`;

export const navigationQuery = {
  id: "navigation",
  description: "Navigation singleton with header and footer reference items",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "navigation"] | order(_updatedAt desc)[0...1]{
    _id,
    _updatedAt,
    "headerItems": header.items[]->${navigationItemProjection},
    "footerItems": footer.items[]->${navigationItemProjection}
  }`,
};
