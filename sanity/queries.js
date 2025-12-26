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
];
