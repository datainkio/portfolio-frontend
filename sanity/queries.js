/**
 * ---
 * aix:
 *   id: frontend.sanity.queries
 *   role: Sanity integration module: sanity/queries.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - sanity
 *     - queries.js
 * ---
 */
/** @format */

import groq from 'groq';

export const SANITY_QUERIES = [
  {
    id: 'sanityOrganizations',
    description: 'Organizations with industry taxonomy and brand assets',
    cacheDuration: '1d',
    query: groq`*[_type == "organization"]{
      _id,
      _updatedAt,
      featured,
      organizationType,
      website,
      location,
      "title": page.title,
      "slug": page.slug.current,
      "abstract": page.abstract,
      "weight": page.weight,
      "industry": industry->{
        _id,
        title,
        "slug": slug.current,
        description,
        color,
        icon
      },
      logo{
        alt,
        asset->{
          url,
          metadata{dimensions, lqip}
        }
      }
    } | order(featured desc, weight desc, title asc)`,
  },
  {
    id: 'sanityIndustries',
    description: 'Industry taxonomy for organizations and projects',
    cacheDuration: '1d',
    query: groq`*[_type == "industry"]{
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      icon,
      color,
      weight
    } | order(weight desc, title asc)`,
  },
  {
    id: 'sanityActivities',
    description: 'Activities taxonomy for project classification',
    cacheDuration: '1d',
    query: groq`*[_type == "activity"]{
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      icon,
      color,
      weight,
      featured
    } | order(featured desc, weight desc, title asc)`,
  },
  {
    id: 'sanityRoles',
    description: 'Roles taxonomy for project metadata',
    cacheDuration: '1d',
    query: groq`*[_type == "role"]{
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      category,
      weight
    } | order(weight desc, title asc)`,
  },
  {
    id: 'sanityOutcomes',
    description: 'Outcomes taxonomy for deliverables',
    cacheDuration: '1d',
    query: groq`*[_type == "outcome"]{
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      category,
      icon,
      weight
    } | order(weight desc, title asc)`,
  },
  {
    id: 'sanityAwards',
    description: 'Awards with organization and project context',
    cacheDuration: '1d',
    query: groq`*[_type == "award"]{
      _id,
      _updatedAt,
      title,
      "slug": slug.current,
      description,
      level,
      category,
      url,
      featured,
      organization->{
        _id,
        "title": page.title,
        "slug": page.slug.current,
        logo{
          alt,
          asset->{url, metadata{dimensions, lqip}}
        }
      },
      project->{
        _id,
        "title": page.title,
        "slug": page.slug.current,
        "published": meta.published,
        "featured": meta.featured
      }
    } | order(featured desc, title asc)`,
  },
  {
    id: 'sanityProjects',
    description: 'Published projects for portfolio grids and detail pages',
    cacheDuration: '1d',
    query: groq`*[_type == "project" && meta.published == true]{
      _id,
      _updatedAt,
      "title": page.title,
      "slug": page.slug.current,
      "abstract": page.abstract,
      "weight": page.weight,
      "status": meta.status,
      "featured": meta.featured,
      "organization": meta.organization->{
        _id,
        "title": page.title,
        "slug": page.slug.current,
        organizationType,
        featured
      },
      "roles": meta.roles[]->{_id, title, "slug": slug.current},
      "activities": meta.activities[]->{_id, title, "slug": slug.current, color, icon},
      "outcomes": meta.outcomes[]->{_id, title, "slug": slug.current},
      "awards": meta.awards[]->{_id, title, "slug": slug.current},
      featuredImage{
        alt,
        asset->{url, metadata{dimensions, lqip}}
      },
      externalLink,
      caseStudyUrl
    } | order(featured desc, weight desc, title asc)`,
  },
  {
    id: 'sanityImageAssets',
    description: 'Published image assets with metadata',
    cacheDuration: '1d',
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
  },
  {
    id: 'sanityPosts',
    description: 'Published posts with relationships and metadata',
    cacheDuration: '1d',
    query: groq`*[_type == "post" && status == "published"]{
      _id,
      _updatedAt,
      "title": page.title,
      "slug": page.slug.current,
      "abstract": page.abstract,
      "weight": page.weight,
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
  },
];
