/** @format */
import groq from "groq";

export const landingQuery = {
  id: "landing",
  description: "Landing page singleton (tagline and core fields)",
  cacheDuration: "1d",
  query: groq`*[_type == "landing"] | order(_updatedAt desc)[0...1]{
    _id,
    _updatedAt,
    tagline,
    "videoSrc": backgroundVideo.asset->url,
    "videoPoster": backgroundPoster.asset->url,
    valuePropHeading,
    valuePropSubHeading,
    valuePropBody,
    recognitionHeading,
    recognitionBody
  }`,
};
