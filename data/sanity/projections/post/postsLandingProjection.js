/** @format */
import groq from "groq";

/**
 * Posts landing page projection (inner shape — excludes field name and traversal operator).
 * Used for the posts inventory page singleton.
 */
export const POSTS_LANDING_PROJECTION = groq`{
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
