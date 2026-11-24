/** @format */
import groq from "groq";

/**
 * Documentation landing page projection (inner shape — excludes field name and traversal operator).
 * Used for the documentation landing page singleton.
 */
export const DOCUMENTATION_LANDING_PROJECTION = groq`{
  _id,
  _updatedAt,
  pageTitle,
  pageNavLabel,
  pageBody[]{
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
}`;
