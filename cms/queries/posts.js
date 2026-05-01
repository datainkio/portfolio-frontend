/** @format */
import groq from "groq";

export const postsQuery = {
  id: "posts",
  description: "Published posts with relationships and metadata",
  cacheDuration: "1d",
  query: groq`*[_type == "post" && status == "published"]{
    _id,
    _updatedAt,
    "title": page.title,
    "slug": page.slug.current,
    "abstract": page.abstract,
    seo,
    publishDate,
    updateDate,
    author,
    postType,
    categories,
    tags,
    status,
    featured,
    featuredImage{
      alt,
      caption,
      asset->{url, metadata{dimensions, lqip}}
    },
    excerpt,
    relatedProjects[]->{
      _id,
      "title": page.title,
      "slug": page.slug.current,
      "status": meta.status,
      "featured": meta.featured
    },
    relatedPosts[]->{
      _id,
      "title": page.title,
      "slug": page.slug.current,
      "status": status,
      "featured": featured
    },
    readingTime
  } | order(featured desc, publishDate desc, title asc)`,
};
