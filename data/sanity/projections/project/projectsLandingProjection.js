/** @format */
import groq from "groq";

/**
 * Projects landing page projection (inner shape — excludes field name and traversal operator).
 * Used for the projects listing/landing page singleton.
 */
export const PROJECTS_LANDING_PROJECTION = groq`{
  _id,
  _updatedAt,
  pageTitle,
  pageNavLabel,
  "pageVideo": pageVideo->{
    alt,
    videoUrl,
    "url": video.asset->url,
    "mimeType": video.asset->mimeType,
    "poster": poster->{
      "url": image.asset->url,
      "alt": image.alt
    },
    "mask": mask.asset->url,
    loop,
    muted,
    autoplay
  },
  pageBody[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
        description,
        metadata{dimensions, lqip}
      }
    },
    _type == "sub_section" => {
      ...,
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
      }
    }
  }
}`;
