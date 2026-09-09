/** @format */
import groq from "groq";

/**
 * Contact page projection (inner shape — excludes field name and traversal operator).
 * Used for the contact page singleton.
 */
export const CONTACT_PROJECTION = groq`{
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
  },
  socialAccounts[]{
    title,
    "logo": logo.asset->{
      url,
      metadata{dimensions, lqip}
    },
    url
  }
}`;
