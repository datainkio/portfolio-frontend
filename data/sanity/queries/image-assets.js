/** @format */
import groq from "groq";

export const imageAssetsQuery = {
  id: "imageAssets",
  description: "Published image assets with metadata",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "imageAsset" && published != false]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    credit,
    tags,
    sourceUrl,
    published,
    image{
      alt,
      caption,
      asset->{url, metadata{dimensions, lqip}}
    }
  } | order(_updatedAt desc, title asc)`,
};
