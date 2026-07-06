/** @format */
import groq from "groq";
import { PROJECT_CARD_PROJECTION } from "../projections/project/projectCardProjection.js";

export const homeQuery = {
  id: "home",
  description: "Home page singleton (hero, value copy, and recognition)",
  cacheDuration: process.env.SANITY_CACHE_DURATION || "1d",
  query: groq`*[_type == "home"] | order(_updatedAt desc)[0...1]{
    _id,
    _updatedAt,
    pageTitle,
    tagline,
    "videoSrc": backgroundVideo.asset->url,
    "videoPoster": backgroundPoster.asset->url,
    valuePropHeading,
    valuePropSubHeading,
    valuePropRichText[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{
          "url": url,
          "description": description
        }
      },
      _type == "sub_section" => {
        ...,
        body[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{
              "url": url,
              "description": description
            }
          }
        }
      }
    },
    recognitionHeading,
    recognitionBody,
    organizationsHeading,
    organizationsBody,
    workHeading,
    workBody[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{
          "url": url,
          "description": description
        }
      }
    },
    "featuredProjects": featuredProjects[]->${PROJECT_CARD_PROJECTION},
  }`,
};
