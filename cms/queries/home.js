/** @format */
import groq from "groq";

export const homeQuery = {
  id: "home",
  description: "Home page singleton (hero, value copy, and recognition)",
  cacheDuration: "1d",
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
          "url": url
        }
      },
      _type == "sub_section" => {
        ...,
        body[]{
          ...,
          _type == "image" => {
            ...,
            "asset": asset->{
              "url": url
            }
          }
        }
      }
    },
    recognitionHeading,
    recognitionBody
  }`,
};
