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
  pageBody[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{
        url,
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
            metadata{dimensions, lqip}
          }
        }
      }
    }
  }
}`;
