/** @format */
import groq from "groq";

/**
 * User Guide projection (inner shape — excludes field name and traversal operator).
 * Used for the user guide singleton page.
 */
export const USER_GUIDE_PROJECTION = groq`{
  _id,
  _updatedAt,
  pageTitle,
  valuePropRichText[]{
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{
        url
      }
    },
    _type == "sub_section" => {
      ...,
      body[]{
        ...,
        _type == "image" => {
          ...,
          "asset": asset->{
            url
          }
        }
      }
    }
  }
}`;
