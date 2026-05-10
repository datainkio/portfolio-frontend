/** @format */
import groq from "groq";

export const projectsByIndustryQuery = {
  id: "projectsByIndustry",
  description:
    "Projects grouped by industry concepts that are linked through project organizations (max 5 industries)",
  cacheDuration: "1d",
  query: groq`*[
    _type == "skosConcept" &&
    (
      _id in *[_type == "skosConceptScheme" && (schemeId in ["industry", "industries"] || title in ["Industry", "Industries"])][0].concepts[]._ref ||
      _id in *[_type == "skosConceptScheme" && (schemeId in ["industry", "industries"] || title in ["Industry", "Industries"])][0].topConcepts[]._ref
    ) &&
    (
      _id in *[_type == "project"].organization[]->industry._ref ||
      _id in *[_type == "project"].projectMeta.organization[]->industry._ref
    )
  ]{
    _id,
    "title": prefLabel,
    "conceptId": coalesce(conceptId, _id),
    "projects": *[
      _type == "project" &&
      (
        ^._id in organization[]->industry._ref ||
        ^._id in projectMeta.organization[]->industry._ref
      )
    ]{
      _id,
      _updatedAt,
      "title": page.title,
      "slug": page.slug.current,
      "abstract": page.abstract,
      "organizations": organization[]->{
        _id,
        "title": page.title,
        "slug": page.slug.current,
        "industry": industry->{
          _id,
          "preferredLabel": prefLabel
        },
        organizationType,
        featured
      },
      "organization": organization[0]->{
        _id,
        "title": page.title,
        "slug": page.slug.current,
        "industry": industry->{
          _id,
          "preferredLabel": prefLabel
        },
        organizationType,
        featured
      },
      "featuredImage": featuredImage->{
        "alt": image.alt,
        "caption": image.caption,
        "asset": image.asset->{url, metadata{dimensions, lqip}}
      },
      externalLink,
      caseStudyUrl
    } | order(page.title asc)
  } | order(title asc)[0...5]`,
};
